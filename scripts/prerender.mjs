// Build step: renders every page to static HTML so search engines and social
// previews (Facebook, LinkedIn, WhatsApp) see real content and per-page meta.
// Also writes 404.html, sitemap.xml and robots.txt.
//
// Pages are discovered by following internal links from the homepage, so new
// stories, events and programmes are picked up as long as something links to them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { render, SITE_URL } = await import(pathToFileURL(path.join(root, "dist-server/entry-server.js")).href);

// The index.html head keeps only what every page shares; each page's title,
// description and social tags come from its <Seo>.
const template = fs
  .readFileSync(path.join(dist, "index.html"), "utf8")
  .replace(/\s*<title>[\s\S]*?<\/title>/, "")
  .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "");
if (!template.includes('<div id="root"></div>')) throw new Error("index.html: empty #root not found");

const page = ({ html, head }) =>
  template.replace("</head>", `${head}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`);

const normalise = (href) => {
  if (!href?.startsWith("/") || href.startsWith("//")) return null;
  const p = href.split(/[?#]/)[0];
  if (path.extname(p)) return null; // files: PDFs, images
  return p.endsWith("/") ? p : `${p}/`;
};

const seen = new Set(["/"]);
const queue = ["/"];
const pages = [];
while (queue.length) {
  const url = queue.shift();
  const out = await render(url);
  if (out.head.includes('content="noindex"')) throw new Error(`${url} rendered the 404 page — fix the link that points to it`);
  const file = path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(out));
  pages.push(url);
  for (const [, href] of out.html.matchAll(/href="([^"]+)"/g)) {
    const next = normalise(href.replace(/&amp;/g, "&"));
    if (next && !seen.has(next)) {
      seen.add(next);
      queue.push(next);
    }
  }
}

// Vercel serves this with a 404 status for any URL without a file.
fs.writeFileSync(path.join(dist, "404.html"), page(await render("/__not-found__/")));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .sort()
  .map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages + 404.html, sitemap.xml, robots.txt`);
