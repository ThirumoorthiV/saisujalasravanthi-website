export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const formatNumber = (n: number) => n.toLocaleString("en-IN");

export const dateBadge = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
    year: d.getFullYear(),
  };
};

/** Appends UTM parameters to outbound campaign / social links (§5.13). */
export const withUtm = (href: string, source: string, medium = "website", campaign = "site") => {
  if (href === "#") return href;
  const url = new URL(href);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
};
