import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE } from "@/data/site";

interface SeoProps {
  title: string;
  description: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Keep the page out of search results (e.g. the 404 page) */
  noindex?: boolean;
}

/** Shared by every page when a link is posted on social media (1200×630). */
const SHARE_IMAGE = { src: "/og-image.jpg", width: "1200", height: "630", alt: "Sai Sujala Sravanthi — free healthcare and community service" };

/** Per-page meta, Open Graph, Twitter card and JSON-LD (§8). */
export function Seo({ title, description, type = "website", jsonLd, noindex = false }: SeoProps) {
  const { pathname } = useLocation();
  // vercel.json enforces trailing slashes, so canonical URLs always carry one.
  const url = SITE.url + (pathname.endsWith("/") ? pathname : `${pathname}/`);
  const image = SITE.url + SHARE_IMAGE.src;
  const fullTitle = pathname === "/" ? title : `${title} | ${SITE.name}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={SHARE_IMAGE.width} />
      <meta property="og:image:height" content={SHARE_IMAGE.height} />
      <meta property="og:image:alt" content={SHARE_IMAGE.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

export const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE.legalName,
  url: SITE.url,
  foundingDate: String(SITE.founded),
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
};

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: SITE.url + item.path,
  })),
});
