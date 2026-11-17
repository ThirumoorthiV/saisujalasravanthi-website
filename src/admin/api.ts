// Firestore reads and writes for the CMS. Access is enforced by firestore.rules,
// not by this code: only staff can write, only admins can manage staff.
import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import {
  Bytes,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { COLLECTIONS, type CollectionDef, type CollectionName } from "./collections";

export type Item = Record<string, unknown> & { id: string; published: boolean; updatedAt?: Timestamp };

export async function listItems(name: CollectionName): Promise<Item[]> {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Item);
}

export async function getItem(name: CollectionName, id: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Item) : null;
}

/** Tells the deploy workflow that the website needs rebuilding. */
const touchSite = () => setDoc(doc(db, "meta", "site"), { updatedAt: serverTimestamp() }, { merge: true });

export async function saveItem(def: CollectionDef, id: string | null, item: Record<string, unknown>, published: boolean) {
  const ref = id ? doc(db, def.name, id) : def.idField ? doc(db, def.name, String(item[def.idField])) : doc(collection(db, def.name));
  if (!id && (await getDoc(ref)).exists()) {
    throw new Error(`Another ${def.singular} already uses this web address. Please change it.`);
  }
  const data: Record<string, unknown> = { ...item, published, updatedAt: serverTimestamp() };
  if (def.name === "gallery") delete data.id;
  await setDoc(ref, data);
  await touchSite();
  return ref.id;
}

export async function deleteItem(name: CollectionName, id: string) {
  await deleteDoc(doc(db, name, id));
  await touchSite();
}

// --- Site status ------------------------------------------------------------

export interface SiteMeta {
  /** Set by the first import (stories, events and gallery). */
  imported?: boolean;
  /** Which collections the website is built from; the others use the built-in content. */
  collections?: Partial<Record<CollectionName, boolean>>;
  updatedAt?: Timestamp;
}

const FIRST_IMPORT: CollectionName[] = ["stories", "events", "gallery"];

/** Same rule as scripts/fetch-content.mjs. */
export const isImported = (meta: SiteMeta | null | undefined, name: CollectionName) =>
  Boolean(meta?.collections?.[name] ?? (FIRST_IMPORT.includes(name) && meta?.imported));

export async function getSiteMeta(): Promise<SiteMeta | null> {
  const snap = await getDoc(doc(db, "meta", "site"));
  return snap.exists() ? (snap.data() as SiteMeta) : null;
}

/**
 * Copies the content currently built into the website into the CMS, published.
 * From then on the website builds that section from the CMS (scripts/fetch-content.mjs).
 * Existing CMS items with the same ID are left as they are.
 */
export async function importBuiltInContent(names: CollectionName[]) {
  const batch = writeBatch(db);
  let added = 0;
  for (const name of names) {
    for (const [id, data] of COLLECTIONS[name].seed()) {
      if ((await getDoc(doc(db, name, id))).exists()) continue;
      batch.set(doc(db, name, id), { ...data, published: true, updatedAt: serverTimestamp() });
      added++;
    }
  }
  batch.set(
    doc(db, "meta", "site"),
    { collections: Object.fromEntries(names.map((n) => [n, true])), updatedAt: serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
  return added;
}

// --- Photos -------------------------------------------------------------------

const MAX_BYTES = 900_000; // Firestore documents are limited to 1 MB

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process this photo."))), type, quality),
  );
}

/**
 * Resizes a photo in the browser (longest side 1600px, WebP where supported)
 * and stores it in the `media` collection. Returns the website path the
 * build will save it to, e.g. /images/cms/AbC123.webp.
 */
export async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a photo (JPG, PNG or WebP).");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => {
    throw new Error("This photo format isn't supported. Please use JPG or PNG.");
  });
  const canvas = document.createElement("canvas");
  let longest = 1600;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, longest / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; // JPEG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.7]) {
      let blob = await canvasBlob(canvas, "image/webp", quality);
      if (blob.type !== "image/webp") blob = await canvasBlob(canvas, "image/jpeg", quality); // older Safari
      if (blob.size <= MAX_BYTES) {
        const ref = doc(collection(db, "media"));
        const ext = blob.type === "image/webp" ? "webp" : "jpg";
        await setDoc(ref, {
          bytes: Bytes.fromUint8Array(new Uint8Array(await blob.arrayBuffer())),
          contentType: blob.type,
          width: canvas.width,
          height: canvas.height,
          originalName: file.name.slice(0, 200),
          createdAt: serverTimestamp(),
        });
        return `/images/cms/${ref.id}.${ext}`;
      }
    }
    longest = Math.round(longest * 0.8);
  }
  throw new Error("This photo is too large even after resizing.");
}

const previewCache = new Map<string, Promise<string>>();

/** URL to show a photo in the CMS. Uploaded photos aren't on the website until the next build. */
export function photoPreviewUrl(path: string): Promise<string> {
  const m = path.match(/^\/images\/cms\/([\w-]+)\.\w+$/);
  if (!m) return Promise.resolve(path);
  if (!previewCache.has(path)) {
    previewCache.set(
      path,
      getDoc(doc(db, "media", m[1])).then((snap) => {
        if (!snap.exists()) return "";
        const data = snap.data();
        return URL.createObjectURL(new Blob([data.bytes.toUint8Array()], { type: data.contentType }));
      }),
    );
  }
  return previewCache.get(path)!;
}

// --- Staff and submissions ----------------------------------------------------

export interface StaffMember {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  /** Profile photo: a small square image stored right in the staff document (a data: URL). */
  photo?: string;
}

/**
 * Turns a chosen photo into a 256×256 square (centre-cropped) profile picture,
 * small enough (~10–30 KB) to keep in the person's staff document.
 */
export async function makeProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a photo (JPG, PNG or WebP).");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => {
    throw new Error("This photo format isn't supported. Please use JPG or PNG.");
  });
  const SIZE = 256;
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  let url = canvas.toDataURL("image/webp", 0.85);
  if (!url.startsWith("data:image/webp")) url = canvas.toDataURL("image/jpeg", 0.85); // older Safari
  if (url.length > 150_000) throw new Error("This photo is too large. Please try another one.");
  return url;
}

export async function getStaff(uid: string): Promise<StaffMember | null> {
  const snap = await getDoc(doc(db, "staff", uid));
  return snap.exists() ? ({ ...snap.data(), uid } as StaffMember) : null;
}

export async function listStaff(): Promise<StaffMember[]> {
  const snap = await getDocs(collection(db, "staff"));
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }) as StaffMember);
}

export const saveStaff = ({ uid, ...rest }: StaffMember) => setDoc(doc(db, "staff", uid), rest);

/** Anyone can change their own display name and photo (and nothing else) in the staff list. */
export const saveOwnName = (uid: string, name: string) => updateDoc(doc(db, "staff", uid), { name });
/** Pass null to remove the photo. */
export const saveOwnPhoto = (uid: string, photo: string | null) =>
  updateDoc(doc(db, "staff", uid), { photo: photo ?? deleteField() });

/**
 * Creates a login for a new staff member and emails them a link to set their own
 * password. Uses a second, temporary Firebase app so the admin stays signed in.
 */
export async function createStaffAccount(member: Omit<StaffMember, "uid">): Promise<StaffMember> {
  const temp = initializeApp(app.options, `create-staff-${Date.now()}`);
  const tempAuth = getAuth(temp);
  try {
    const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(36)).join("");
    let uid: string;
    try {
      uid = (await createUserWithEmailAndPassword(tempAuth, member.email, randomPassword)).user.uid;
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code.includes("email-already-in-use")) {
        throw new Error(
          "This email already has a login. Ask them to open the CMS and sign in. The page will show their User ID, which you can add under “Already has a login?” below.",
        );
      }
      if (code.includes("invalid-email")) throw new Error("That email address isn't valid.");
      if (code.includes("admin-restricted-operation")) {
        throw new Error("Creating accounts is switched off: Firebase → Authentication → Settings → User actions → enable “Create”.");
      }
      throw err;
    }
    const created = { ...member, uid };
    await saveStaff(created);
    await sendPasswordResetEmail(tempAuth, member.email);
    return created;
  } finally {
    await signOut(tempAuth).catch(() => {});
    await deleteApp(temp);
  }
}
export const removeStaff = (uid: string) => deleteDoc(doc(db, "staff", uid));

export interface Submission {
  id: string;
  form: string;
  formName: string;
  page: string;
  data: Record<string, unknown>;
  createdAt?: Timestamp;
}

export async function listSubmissions(): Promise<Submission[]> {
  const snap = await getDocs(query(collection(db, "submissions"), orderBy("createdAt", "desc"), limit(500)));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Submission);
}

export const deleteSubmission = (id: string) => deleteDoc(doc(db, "submissions", id));
