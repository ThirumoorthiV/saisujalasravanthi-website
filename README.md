# Sai Sujala Sravanthi — Website

Built from *Sai Sujala Sravanthi Website — Requirements & Analysis v1.1*.

**Stack:** React 18 · TypeScript (strict) · Vite · Tailwind CSS (maroon tokens, §6) · Lucide React · React Router · react-helmet-async · React Hook Form + Zod

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build to dist/
npm run preview   # serve dist/
```

## Structure

```
src/
├── components/layout/    Header (utility bar + sticky nav), Footer, PageHeader/Breadcrumbs, Layout
├── components/ui/        Button, Tag, Section, QuoteBlock, Cards (Programme/Story/Event/Stat), Form, Filters
├── components/sections/  ImpactAtAGlance, CsrBand, GetInvolvedCards, MedicalVolunteerBanner
├── pages/                Home, About (4 sub-pages), Programmes (overview/category/detail), Impact,
│                         Stories (+detail), Events (+detail), Gallery, Csr, GetInvolved, Transparency, Contact
├── data/                 Content collections (stand-in for the headless CMS, §10)
├── types/                TypeScript models for every CMS collection
├── hooks/useFilters.ts   URL-synced filters (shareable filtered views)
├── lib/                  SEO + JSON-LD (NGO, Event, Article, BreadcrumbList), form schemas, UTM helper
└── routes.tsx            URL structure per §4.4
```

## Placeholder content

All content in `src/data/` is **sample data** to be replaced with Trust-supplied material (§11).
Search the code for `TODO` to find every pending item. Notable ones:

- **Impact figures** are in one place (`src/data/impact.ts`) so homepage and Impact page always match.
  Every metric shows a "Pending confirmation" badge until `verified: true` — including the
  **18 vs 22 PHCs** conflict (§2.1).
- Year-wise figures (2024–2026) show "Data pending".
- Registration, FCRA and 12A/80G numbers, phone number and the enquiry inboxes (`src/data/site.ts`).
- Report PDFs link to `#`.
- Partner logos only render when `permissionGranted: true`.
- Images are maroon placeholders with descriptive `aria-label`s; swap in WebP photos.

## Form submissions (Firestore + Web3Forms)

All forms (Contact, CSR enquiry, Volunteer, Medical volunteer, Share expertise) go through
`src/lib/submit.ts`, which does both of these:

- **Firestore** (`src/lib/firebase.ts`): saves the submission to the `submissions` collection, a
  permanent record staff can view and export in the Firebase console.
- **Web3Forms**: emails it to the inbox that owns the access key (reply-to is the submitter).

If either one succeeds the visitor sees "Thank you", so an outage of one service never loses an
enquiry. Configure both in `.env` (see `.env.example`). All values there are public by design,
but `.env` is not committed (GitHub's secret scanner flags the Firebase key): for builds,
the same values are set as GitHub repository **Variables** (used by the deploy workflow)
and as Vercel **Environment Variables**.
Firestore access is limited by `firestore.rules` (the website can only create submissions), which
must be pasted into Firebase console, then Firestore, then Rules. The Firebase SDK is only downloaded
when someone submits a form.

## Content management (CMS: sign in at `/login/`)

Trust staff sign in at `<site>/login/` (the **Sign in** link in the header). Admins then work at
`/admin/` and editors at `/staff/`; editors opening `/admin/` are sent to `/staff/`. The code is in
`src/admin/` (one app with three entry pages: `login/`, `admin/`, `staff/`), so visitors never download it. Everything is stored in Firebase:

- **Firestore** `stories`, `events`, `gallery`: one document per item, with `published: true/false`.
- **Firestore** `media`: uploaded photos, resized in the browser (max 1600px, WebP, under 900 KB),
  so no Firebase Storage / paid plan is needed.
- **Firebase Authentication** (Email/Password) for logins; the `staff` collection says who has access
  (`role: "admin"` or `"editor"`). Admins also see form submissions and manage staff.
- `firestore.rules` enforces all of this; publish it after any change.

**How content reaches the site:** `scripts/fetch-content.mjs` runs before `npm run dev` / `npm run build`,
downloads published items into `src/data/cms.generated.json` and photos into `public/images/cms/`
(both gitignored), and the pages are prerendered from them as before. While `npm run dev` is running
it checks for CMS changes every 10 seconds and the page updates by itself; `npm run content`
downloads on demand. Every CMS save updates
`meta/site`; the "Update website" workflow checks it every 5 minutes and rebuilds when it has changed.
For an immediate update: GitHub → Actions → Update website → Run workflow.

**Automatic update on save (Vercel):** after every publish, update or delete, the CMS calls
the Vercel deploy hook, so changes are live in ~2–3 minutes (GitHub's schedule is a backup;
it often runs late). One-time setup in the Firebase console → Firestore → Start collection
`settings` → document ID `deploy` → field `hookUrl` (string) = the Vercel deploy hook URL.
Only signed-in staff can read it (firestore.rules).

Until an admin clicks **Import current content** on the CMS dashboard, the site uses the built-in
`SEED_*` lists in `src/data/`. After that the CMS is the source of truth, and edits to the `SEED_*`
lists no longer show on the site.

**One-time setup:**
1. Publish `firestore.rules` (Firestore → Rules).
2. Authentication → Get started → Sign-in method → enable **Email/Password**.
3. Authentication → Users → Add user (first admin); copy the **User UID**.
4. Firestore → Start collection `staff` → Document ID = that UID, fields `name` (string),
   `email` (string), `role` (string) = `admin`.
5. Open `/login/`, sign in, and click **Import** on the Dashboard.

Further staff are added by an admin on the CMS **Staff access** page: it creates their login and
Firebase emails them a link to set their own password (Authentication → Templates → Password reset
controls that email's wording and sender name).

## Images

- `public/images/brand/`, `site/`, `leaders/`, `partners/` — the Trust's own logo, photos, leader portraits,
  partner logos and donation QR code, taken from the existing saisujalasravanthi.in site.
- `public/images/free/` — free photos from Unsplash (Unsplash License: free for commercial use, no attribution
  required). Used for Get Involved, CSR, Donate and a few page banners where the Trust has no photo yet.
- Partner logos are shown because they already appear on the existing site — confirm written permission (§5.9).

## SEO and deployment

`npm run build` builds the app, then prerenders every page to static HTML
(`src/entry-server.tsx` + `scripts/prerender.mjs`) so search engines and social previews see real
content. It also writes `dist/404.html`, `dist/sitemap.xml` and `dist/robots.txt`.

- **New pages** are found by following links from the homepage, so anything linked from the site is
  prerendered and added to the sitemap automatically. The build fails if a link points to a missing page.
- **Share image** for Facebook / LinkedIn / WhatsApp is `public/og-image.jpg` (1200x630).
- **Domain**: canonical URLs use `https://www.saisujalasravanthi.in` (`SITE.url`); the bare domain
  must redirect to www.
- After launch, add the site to Google Search Console and submit `/sitemap.xml`.

### SiteGround (production)

`.github/workflows/deploy-siteground.yml` builds on every push to `main` and uploads `dist/` to
SiteGround over SSH (rsync). The repository secrets it needs are listed at the top of that file.
`public/.htaccess` does on Apache what `vercel.json` does on Vercel: HTTPS + www redirects, the
old-site 301 redirects, the 404 page and caching. Keep its redirect list in sync with `vercel.json`.

### Vercel (preview copy)

Vercel still deploys every push to `saisujalasravanthi-website.vercel.app` using `vercel.json`
(redirects, `trailingSlash: true`). Forms there write to the same Firestore and inbox, so mark
test submissions clearly.

## Before launch (not yet done)

1. **CMS, later phases**: move programmes, leadership, impact figures and reports into the CMS too.
2. GA4, interactive map (react-leaflet) once centre lat/long exist.
