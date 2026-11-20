// `npm run storage`: how much of the free 1 GB Firestore storage the CMS is using.
//
// Adds up every uploaded photo and PDF (the `media` collection, by far the largest part)
// and the published website content. Staff, form submissions, drafts and the activity
// log need a sign-in to read, so they aren't counted; they're small text anyway.
// Firestore also adds a little overhead per document (names and indexes), so the
// figure in the Firebase console can be somewhat higher.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore/lite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FREE_LIMIT = 1024 ** 3; // 1 GiB
const CONTENT = ["stories", "events", "gallery", "programmes", "leadership", "centres", "partners", "social", "reports"];

function readEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
  return { ...env, ...process.env };
}

const env = readEnv();
if (!env.VITE_FIREBASE_PROJECT_ID) {
  console.error("Firebase is not configured (.env).");
  process.exit(1);
}
const db = getFirestore(
  initializeApp({ apiKey: env.VITE_FIREBASE_API_KEY, projectId: env.VITE_FIREBASE_PROJECT_ID, appId: env.VITE_FIREBASE_APP_ID }),
);

const size = (bytes) =>
  bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2)} GB` : bytes >= 1024 ** 2 ? `${(bytes / 1024 ** 2).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
/** Rough size of a document's text fields (Firestore stores roughly this much). */
const textSize = (data) => Buffer.byteLength(JSON.stringify(data));

console.log("Measuring Firestore storage…\n");

// Uploaded photos and PDFs.
let photos = 0;
let photoBytes = 0;
const pdfs = [];
const media = await getDocs(collection(db, "media"));
for (const d of media.docs) {
  const m = d.data();
  if (m.contentType === "application/pdf") {
    // The PDF itself is stored in pieces under media/<id>/chunks.
    const chunks = await getDocs(collection(db, "media", d.id, "chunks"));
    const bytes = chunks.docs.reduce((sum, c) => sum + (c.data().bytes?.toUint8Array().length ?? 0), 0);
    pdfs.push({ name: m.originalName || d.id, bytes });
  } else {
    photos++;
    photoBytes += m.bytes?.toUint8Array().length ?? 0;
  }
}
const pdfBytes = pdfs.reduce((sum, p) => sum + p.bytes, 0);

// Published website content (text).
let contentDocs = 0;
let contentBytes = 0;
for (const name of CONTENT) {
  const snap = await getDocs(query(collection(db, name), where("published", "==", true)));
  contentDocs += snap.size;
  contentBytes += snap.docs.reduce((sum, d) => sum + textSize(d.data()), 0);
}

const total = photoBytes + pdfBytes + contentBytes;
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("Photos", 22)}${pad(photos, 8)}${size(photoBytes)}`);
console.log(`${pad("PDFs (reports)", 22)}${pad(pdfs.length, 8)}${size(pdfBytes)}`);
console.log(`${pad("Website content", 22)}${pad(contentDocs, 8)}${size(contentBytes)}`);
console.log("-".repeat(42));
console.log(`${pad("Total (approx.)", 30)}${size(total)}`);
console.log(`\nFree plan: ${size(total)} of 1 GB used (${((total / FREE_LIMIT) * 100).toFixed(1)}%), ${size(FREE_LIMIT - total)} left.`);

if (pdfs.length) {
  console.log("\nLargest PDFs:");
  for (const p of pdfs.sort((a, b) => b.bytes - a.bytes).slice(0, 5)) console.log(`  ${pad(size(p.bytes), 10)}${p.name}`);
}
console.log("\nNot counted: staff, form submissions, drafts and the activity log (small text, need a sign-in to read).");
process.exit(0);
