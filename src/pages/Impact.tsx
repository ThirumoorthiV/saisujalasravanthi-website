import { useState } from "react";
import { MapPin } from "lucide-react";
import { IMPACT_METRICS, YEARLY_IMPACT } from "@/data/impact";
import { CENTRES, NETWORK_OTHER_STATES, REPORTS } from "@/data/organisation";
import { STORIES } from "@/data/stories";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricDetail, StoryCard } from "@/components/ui/Cards";
import { Section, SectionHeading } from "@/components/ui/Primitives";
import { ReportList } from "@/components/ui/ReportList";
import { CsrBand } from "@/components/sections/Shared";
import { formatNumber } from "@/lib/format";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const IMPACT = { name: "Our Impact", path: "/impact/" };

export function ImpactGlance() {
  const stories = STORIES.filter((s) => s.change || s.category === "Healthcare Stories").slice(0, 3);
  return (
    <>
      <Seo
        title="Impact at a Glance"
        description="Measured outcomes of Sai Sujala Sravanthi's healthcare, rural development and education programmes — with definitions, periods and sources."
        jsonLd={breadcrumbSchema([ROOT, IMPACT])}
      />
      <PageHeader
        title="Impact at a Glance"
        intro="Numbers + human stories = stronger trust. Every figure here carries its definition and period."
        crumbs={[ROOT, IMPACT]}
        image="/images/site/pediatric-echo-screening.webp"
      />
      <Section tone="cream">
        <SectionHeading eyebrow="Key figures" title="What our work has achieved" action={{ label: "Year-wise dashboard", to: "/impact/dashboard/" }} />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT_METRICS.map((m) => (
            <MetricDetail key={m.id} metric={m} />
          ))}
        </div>
      </Section>
      <Section tone="white">
        <SectionHeading eyebrow="Impact stories" title="The people behind the numbers" action={{ label: "All stories", to: "/stories/" }} />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </Section>
      <CsrBand />
    </>
  );
}

export function ImpactDashboard() {
  // "all" shows totals across every year; picking a year narrows to that year.
  const [year, setYear] = useState<number | "all">("all");
  const first = YEARLY_IMPACT[0].year;
  const last = YEARLY_IMPACT[YEARLY_IMPACT.length - 1].year;
  const metrics =
    year === "all"
      ? YEARLY_IMPACT[0].metrics.map((m, i) => ({ label: m.label, value: YEARLY_IMPACT.reduce((sum, y) => sum + y.metrics[i].value, 0) }))
      : YEARLY_IMPACT.find((y) => y.year === year)!.metrics;
  const prevData = year === "all" ? undefined : YEARLY_IMPACT.find((y) => y.year === year - 1);
  // The current calendar year is still in progress, so don't compare it with a full year.
  const partial = year === new Date().getFullYear();
  const periodLabel = year === "all" ? `All years · ${first}–${last}` : partial ? `${year} · year to date` : `Calendar year ${year}`;
  const tabs: (number | "all")[] = ["all", ...YEARLY_IMPACT.map((y) => y.year)];
  const crumb = { name: "Impact Dashboard", path: "/impact/dashboard/" };
  return (
    <>
      <Seo title="Impact Dashboard" description={`Year-wise outcomes of Sai Sujala Sravanthi's programmes from ${YEARLY_IMPACT[0].year} to ${YEARLY_IMPACT[YEARLY_IMPACT.length - 1].year}.`} jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
      <PageHeader
        title="Impact Dashboard"
        intro="Year-wise outcomes across our programmes."
        crumbs={[ROOT, IMPACT, crumb]}
        image="/images/site/outreach-camp-consultations.webp"
      />
      <Section tone="cream">
        <div>
          <SectionHeading eyebrow="Year-wise data" title={year === "all" ? `Outcomes ${first}–${last}` : `Outcomes in ${year}`} />
          <div role="tablist" aria-label="Year" className="mb-8 inline-flex rounded-lg bg-white p-1 ring-1 ring-ink-200">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={year === t}
                onClick={() => setYear(t)}
                className={`min-h-[40px] rounded-md px-3 text-sm font-semibold transition sm:min-h-[44px] sm:px-5 sm:text-base ${year === t ? "bg-maroon-700 text-white" : "text-maroon-700 hover:bg-maroon-50"}`}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const prev = prevData?.metrics[i]?.value;
            const change = prev && !partial ? Math.round(((m.value - prev) / prev) * 100) : null;
            const max = Math.max(...YEARLY_IMPACT.map((y) => y.metrics[i].value));
            return (
              <div key={m.label} className="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70 md:p-6">
                <p className="font-heading text-3xl font-bold text-maroon-700 md:text-4xl">{formatNumber(m.value)}</p>
                <p className="mt-1 font-semibold">{m.label}</p>
                <p className="mt-1 text-xs text-ink-600">{periodLabel}</p>
                {change !== null && (
                  <p className={`mt-2 text-sm font-semibold ${change >= 0 ? "text-success" : "text-error"}`}>
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs {prevData!.year}
                  </p>
                )}
                {/* Trend across all years; the selected year is highlighted (all of them under "All") */}
                <div className="mt-auto flex h-24 items-end gap-1.5 pt-4" aria-hidden>
                  {YEARLY_IMPACT.map((y) => (
                    <div key={y.year} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t ${year === "all" || y.year === year ? "bg-maroon-700" : "bg-maroon-100"}`}
                        style={{ height: `${Math.max(8, (y.metrics[i].value / max) * 60)}px` }}
                      />
                      <span className="text-[10px] text-ink-600">{String(y.year).slice(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

export function ImpactLocations() {
  const crumb = { name: "Locations", path: "/impact/locations/" };
  const states = ["Telangana", "Andhra Pradesh", "Other"] as const;
  return (
    <>
      <Seo title="Locations — Geographical Impact" description="Where Sai Sujala Sravanthi works across Telangana, Andhra Pradesh and other states." jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
      <PageHeader
        title="Locations"
        intro="Our geographical impact across Telangana, Andhra Pradesh and beyond."
        crumbs={[ROOT, IMPACT, crumb]}
        image="/images/site/sai-swasthya-centre-1.webp"
      />
      <Section tone="cream">
        <SectionHeading eyebrow="Geographical impact" title="Where we work" action={{ label: "Find a healthcare centre", to: "/about-us/our-network/" }} />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {states.map((s) => {
            const centres = CENTRES.filter((c) => c.state === s);
            const places = centres.filter((c) => c.type !== "Office").map((c) => c.address.split(",")[0]);
            return (
              <div key={s} className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                  <MapPin aria-hidden />
                </span>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-maroon-700">{s}</h2>
                <p className="mt-1 font-semibold text-ink-900">
                  {s === "Other" ? `${NETWORK_OTHER_STATES.length} states (wider network)` : `${centres.length} locations`}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s === "Other" ? NETWORK_OTHER_STATES.join(", ") : places.join(", ")}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

export function ImpactReports() {
  const crumb = { name: "Annual Reports", path: "/impact/annual-reports/" };
  const reports = REPORTS.filter((r) => r.type === "Annual Report" || r.type === "Impact Report");
  return (
    <>
      <Seo title="Annual Reports" description="Annual and impact reports of Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
      <PageHeader title="Annual Reports" intro="Annual and impact reports, published for every partner and supporter." crumbs={[ROOT, IMPACT, crumb]} image="/images/free/helping-hands.webp" />
      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Downloads" title="Annual & impact reports" action={{ label: "All transparency documents", to: "/transparency/" }} />
          <ReportList items={reports} />
        </div>
      </Section>
    </>
  );
}
