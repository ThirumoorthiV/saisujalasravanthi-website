import { useState } from "react";
import { MapPin } from "lucide-react";
import { IMPACT_METRICS, YEARLY_IMPACT } from "@/data/impact";
import { CENTRES, NETWORK_OTHER_STATES, REPORTS } from "@/data/organisation";
import { STORIES } from "@/data/stories";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricDetail, StoryCard } from "@/components/ui/Cards";
import { PendingBadge, Section, SectionHeading } from "@/components/ui/Primitives";
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACT_METRICS.map((m) => (
            <MetricDetail key={m.id} metric={m} />
          ))}
        </div>
      </Section>
      <Section tone="white">
        <SectionHeading eyebrow="Impact stories" title="The people behind the numbers" action={{ label: "All stories", to: "/stories/" }} />
        <div className="grid gap-6 md:grid-cols-3">
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
  const [year, setYear] = useState(YEARLY_IMPACT[YEARLY_IMPACT.length - 1].year);
  const yearData = YEARLY_IMPACT.find((y) => y.year === year)!;
  const crumb = { name: "Impact Dashboard", path: "/impact/dashboard/" };
  return (
    <>
      <Seo title="Impact Dashboard" description="Year-wise outcomes of Sai Sujala Sravanthi's programmes for 2024, 2025 and 2026." jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
      <PageHeader
        title="Impact Dashboard"
        intro="Year-wise outcomes across our programmes."
        crumbs={[ROOT, IMPACT, crumb]}
        image="/images/site/outreach-camp-consultations.webp"
      />
      <Section tone="cream">
        <div>
          <SectionHeading eyebrow="Year-wise data" title={`Outcomes in ${year}`} />
          <div role="tablist" aria-label="Year" className="mb-8 inline-flex rounded-lg bg-white p-1 ring-1 ring-ink-200">
            {YEARLY_IMPACT.map((y) => (
              <button
                key={y.year}
                role="tab"
                aria-selected={year === y.year}
                onClick={() => setYear(y.year)}
                className={`min-h-[44px] rounded-md px-5 font-semibold transition ${year === y.year ? "bg-maroon-700 text-white" : "text-maroon-700 hover:bg-maroon-50"}`}
              >
                {y.year}
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {yearData.metrics.map((m) => (
            <div key={m.label} className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <p className="font-heading text-4xl font-bold text-maroon-700">{m.value ? formatNumber(m.value) : "—"}</p>
              <p className="mt-1 font-semibold">{m.label}</p>
              <p className="mt-1 text-xs text-ink-600">Calendar year {year}</p>
              {!m.value && (
                <p className="mt-auto pt-3">
                  <PendingBadge>Data pending</PendingBadge>
                </p>
              )}
            </div>
          ))}
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
        <div className="grid gap-6 md:grid-cols-3">
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
