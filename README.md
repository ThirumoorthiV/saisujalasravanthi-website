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

## Form submissions (Web3Forms)

All forms (Contact, CSR enquiry, Volunteer, Medical volunteer, Share expertise) post to
[Web3Forms](https://web3forms.com) from `src/lib/submit.ts`.

1. Create a free access key at web3forms.com using the inbox that should receive submissions.
2. `cp .env.example .env` and set `VITE_WEB3FORMS_ACCESS_KEY=...`, then rebuild/redeploy
   (also add the variable in your host's environment settings).

Each submission arrives as an email (subject names the form and enquiry type; reply-to is the
submitter). Browsing/exporting stored submissions (Submissions API, Google Sheets integration)
needs Web3Forms **Pro**. Without a key, forms show an error asking visitors to email info@.

## Images

- `public/images/brand/`, `site/`, `leaders/`, `partners/` — the Trust's own logo, photos, leader portraits,
  partner logos and donation QR code, taken from the existing saisujalasravanthi.in site.
- `public/images/free/` — free photos from Unsplash (Unsplash License: free for commercial use, no attribution
  required). Used for Get Involved, CSR, Donate and a few page banners where the Trust has no photo yet.
- Partner logos are shown because they already appear on the existing site — confirm written permission (§5.9).

## SEO and deployment (Vercel)

`npm run build` builds the app, then prerenders every page to static HTML
(`src/entry-server.tsx` + `scripts/prerender.mjs`) so search engines and social previews see real
content. It also writes `dist/404.html`, `dist/sitemap.xml` and `dist/robots.txt`.

- **New pages** are found by following links from the homepage — anything linked from the site is
  prerendered and added to the sitemap automatically. The build fails if a link points to a missing page.
- **Old-site URLs** are 301-redirected in `vercel.json`. Add new ones there (with and without a
  trailing slash).
- **Trailing slashes** are enforced by Vercel (`trailingSlash: true`); canonical URLs always use one.
- **Share image** for Facebook / LinkedIn / WhatsApp is `public/og-image.jpg` (1200×630).
- **Domain** — canonical URLs use `https://www.saisujalasravanthi.in` (`SITE.url`). In Vercel, add both
  the www and bare domain and redirect the bare domain to www.
- After launch, add the site to Google Search Console and submit `/sitemap.xml`.

## Before launch (not yet done)

1. **Headless CMS** — move `src/data/*` collections into Sanity/Strapi/Decap and rebuild on publish.
2. GA4, interactive map (react-leaflet) once centre lat/long exist.
