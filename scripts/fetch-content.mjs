// Build step: downloads the content Trust staff published in the CMS (/login/)
// from Firestore, so every page can be prerendered with it.
//
//   src/data/cms.generated.json   published stories, events and gallery photos
//   public/images/cms/            photos uploaded in the CMS
//
// Runs before `npm run dev` (with --dev: offline is fine, the last download or
// the built-in content is used) and before `npm run build` (any error stops the
// build, so the live site is never replaced by an incomplete copy).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore/lite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "src/data/cms.generated.json");
const imageDir = path.join(root, "public/images/cms");
const devMode = process.argv.includes("--dev");
// --watch (started by the dev server, see vite.config.ts): keep running and download
// again whenever something is saved in the CMS, so the local site updates by itself.
const watchMode = process.argv.includes("--watch");
const WATCH_SECONDS = 10;

// Same names and order as src/admin/collections.ts. Dates newest first; "order" smallest first.
const COLLECTIONS = {
  stories: { sort: "publishDate", dir: -1 },
  events: { sort: "startDate", dir: -1 },
  gallery: { sort: "date", dir: -1, keepId: true },
  programmes: { sort: "order", dir: 1 },
  leadership: { sort: "order", dir: 1 },
  centres: { sort: "order", dir: 1 },
};
// Imported by the first CMS import, before per-section imports existed.
const FIRST_IMPORT = ["stories", "events", "gallery"];

const compare = (key, dir) => (a, b) => {
  const x = a[key];
  const y = b[key];
  if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
  return String(x ?? "").localeCompare(String(y ?? "")) * dir;
};

/** Same lookup order as Vite: real environment first, then .env.local, then .env. */
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

/** Writes the file only when the content changed, so the dev server doesn't reload for nothing. */
const write = (content) => {
  const json = JSON.stringify(content, null, 2) + "\n";
  if (fs.existsSync(outFile) && fs.readFileSync(outFile, "utf8") === json) return;
  fs.writeFileSync(outFile, json);
};

const env = readEnv();
const db = env.VITE_FIREBASE_PROJECT_ID
  ? getFirestore(
      initializeApp({
        apiKey: env.VITE_FIREBASE_API_KEY,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      }),
    )
  : null;

/** Changes on every CMS save (see src/admin/api.ts). */
async function cmsVersion() {
  const meta = await getDoc(doc(db, "meta", "site"));
  return meta.exists() ? `${meta.data().updatedAt?.toMillis?.() ?? ""}:${meta.data().imported}` : "";
}

async function main() {
  if (!db) {
    write({});
    console.log("CMS: Firebase is not configured, using the built-in content.");
    return;
  }

  // A section comes from the CMS once an admin has imported it (Dashboard), recorded
  // in meta/site. Sections not imported yet keep the built-in content.
  const meta = await getDoc(doc(db, "meta", "site"));
  const m = meta.exists() ? meta.data() : {};
  const names = Object.keys(COLLECTIONS).filter((n) => m.collections?.[n] ?? (FIRST_IMPORT.includes(n) && m.imported));
  if (names.length === 0) {
    write({});
    console.log("CMS: content not imported yet (Admin → Dashboard), using the built-in content.");
    return;
  }

  const content = {};
  for (const name of names) {
    const { sort, dir, keepId } = COLLECTIONS[name];
    const snap = await getDocs(query(collection(db, name), where("published", "==", true)));
    content[name] = snap.docs
      .map((d) => {
        const { published, updatedAt, ...item } = d.data();
        return keepId ? { ...item, id: d.id } : item;
      })
      .sort(compare(sort, dir));
  }

  // Photos uploaded in the CMS are stored in the `media` collection and
  // referenced as /images/cms/<id>.<ext>. Each one is downloaded once.
  const refs = new Set([...JSON.stringify(content).matchAll(/\/images\/cms\/([\w-]+)\.(webp|jpg)/g)].map((m) => m[0]));
  fs.mkdirSync(imageDir, { recursive: true });
  let downloaded = 0;
  for (const ref of refs) {
    const file = path.join(root, "public", ref);
    if (fs.existsSync(file)) continue;
    const id = path.basename(ref).replace(/\.\w+$/, "");
    const media = await getDoc(doc(db, "media", id));
    if (!media.exists()) throw new Error(`CMS: photo ${ref} is used but missing from the media collection`);
    fs.writeFileSync(file, media.data().bytes.toUint8Array());
    downloaded++;
  }

  write(content);
  console.log(
    `CMS: ${names.map((n) => `${content[n].length} ${n}`).join(", ")} (${refs.size} uploaded photos, ${downloaded} new)`,
  );
}

async function watch() {
  if (!db) return;
  let last = await cmsVersion().catch(() => "");
  console.log(`CMS: watching for changes made in the CMS (every ${WATCH_SECONDS}s)`);
  setInterval(async () => {
    try {
      process.kill(process.ppid, 0); // stop when the dev server has stopped
    } catch {
      process.exit(0);
    }
    try {
      const now = await cmsVersion();
      if (now === last) return;
      last = now;
      await main();
    } catch (err) {
      console.warn(`CMS: could not check for changes (${err.message})`);
    }
  }, WATCH_SECONDS * 1000);
}

try {
  if (watchMode) {
    await watch();
  } else {
    await main();
    process.exit(0); // Firestore keeps a connection open otherwise
  }
} catch (err) {
  const reason =
    err.code === "permission-denied"
      ? "Firestore refused access. Publish the rules in firestore.rules (Firebase console → Firestore → Rules)."
      : err.message;
  if (devMode) {
    if (!fs.existsSync(outFile)) write({});
    console.warn(`CMS: could not download content (${reason}) Using the last downloaded copy.`);
    process.exit(0);
  }
  console.error(`\nCMS: ${reason}\n`);
  process.exit(1);
}
