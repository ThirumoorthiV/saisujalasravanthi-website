import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { IMPACT_METRICS, YEARLY_IMPACT } from "@/data/impact";
import { CENTRES, NETWORK_OTHER_STATES, REPORTS } from "@/data/organisation";
import { STORIES } from "@/data/stories";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricDetail, StoryCard } from "@/components/ui/Cards";
import { GrowthBars, ImpactTable, seriesFor, Sparkline, TrendChart } from "@/components/ui/ImpactCharts";
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

const HERO = "Patients served";
const HEALTH_TILES = ["Medical camps", "Health screenings", "Surgeries supported"];
const REACH = ["Villages reached", "Students supported", "Volunteers engaged", "CSR projects completed"];

export function ImpactDashboard() {
  // "all" shows totals across every year; picking a year narrows to that year.
  const [year, setYear] = useState<number | "all">("all");
  const first = YEARLY_IMPACT[0];
  const last = YEARLY_IMPACT[YEARLY_IMPACT.length - 1];
  const fullYears = YEARLY_IMPACT.filter((y) => !y.partial);
  const lastFull = fullYears[fullYears.length - 1];
  const current = year === "all" ? undefined : YEARLY_IMPACT.find((y) => y.year === year)!;
  const prev = current && !current.partial ? YEARLY_IMPACT.find((y) => y.year === current.year - 1) : undefined;
  const periodLabel = !current ? `Total · ${first.year}–${last.year}` : current.partial ? `${current.year} · year to date` : `Calendar year ${current.year}`;
  const tabs: (number | "all")[] = ["all", ...YEARLY_IMPACT.map((y) => y.year)];
  const crumb = { name: "Impact Dashboard", path: "/impact/dashboard/" };

  const valueOf = (label: string) => {
    const series = seriesFor(YEARLY_IMPACT, label);
    return current ? series.find((p) => p.year === current.year)!.value : series.reduce((sum, p) => sum + p.value, 0);
  };
  // Change vs the previous full year; none under "All" or for a year in progress.
  const changeOf = (label: string) => {
    if (!prev) return null;
    const before = seriesFor([prev], label)[0].value;
    return Math.round(((valueOf(label) - before) / before) * 100);
  };
  const Change = ({ label }: { label: string }) => {
    const c = changeOf(label);
    if (c === null) return null;
    return (
      <p className={`text-sm font-semibold ${c >= 0 ? "text-success" : "text-error"}`}>
        <span aria-hidden>{c >= 0 ? "▲" : "▼"}</span> {Math.abs(c)}% <span className="font-normal text-ink-600">vs {prev!.year}</span>
      </p>
    );
  };

  return (
    <>
      <Seo title="Impact Dashboard" description={`Year-wise outcomes of Sai Sujala Sravanthi's programmes from ${first.year} to ${last.year}.`} jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
      <PageHeader
        title="Impact Dashboard"
        intro="Year-wise outcomes across our programmes."
        crumbs={[ROOT, IMPACT, crumb]}
        image="/images/site/outreach-camp-consultations.webp"
      />
      <Section tone="cream">
        <SectionHeading eyebrow="Year-wise data" title={current ? `Outcomes in ${current.year}` : `Outcomes ${first.year}–${last.year}`} />
        <div role="tablist" aria-label="Year" className="mb-8 inline-flex max-w-full overflow-x-auto rounded-lg bg-white p-1 ring-1 ring-ink-200">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={year === t}
              onClick={() => setYear(t)}
              className={`min-h-[40px] shrink-0 rounded-md px-3 text-sm font-semibold transition sm:min-h-[44px] sm:px-5 sm:text-base ${year === t ? "bg-maroon-700 text-white" : "text-maroon-700 hover:bg-maroon-50"}`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="space-y-6">
          {/* Headline: patients served with its full trend */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70 md:p-6 lg:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                  <p className="font-semibold text-ink-900">{HERO}</p>
                  <p className="mt-1 font-heading text-5xl font-bold leading-none text-maroon-700 md:text-6xl">{formatNumber(valueOf(HERO))}</p>
                  <p className="mt-2 text-xs text-ink-600">{periodLabel}</p>
                </div>
                <Change label={HERO} />
              </div>
              <div className="mt-4">
                <div className="sm:hidden">
                  <TrendChart points={seriesFor(YEARLY_IMPACT, HERO)} selected={year} label={HERO} width={340} />
                </div>
                <div className="hidden sm:block">
                  <TrendChart points={seriesFor(YEARLY_IMPACT, HERO)} selected={year} label={HERO} />
                </div>
              </div>
            </div>

            {/* Healthcare stat tiles */}
            <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-4">
              {HEALTH_TILES.map((label) => (
                <li key={label} className="flex flex-col justify-between gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70">
                  <div>
                    <p className="font-semibold text-ink-900">{label}</p>
                    <p className="mt-0.5 text-xs text-ink-600">{periodLabel}</p>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="font-heading text-3xl font-bold leading-none text-maroon-700">{formatNumber(valueOf(label))}</p>
                      <div className="mt-2 min-h-[20px]">
                        <Change label={label} />
                      </div>
                    </div>
                    <Sparkline points={seriesFor(YEARLY_IMPACT, label)} selected={year} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach: the period's figures beside growth over the full-year span */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-maroon-700 p-5 text-white shadow-sm md:p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">Community reach</p>
              <p className="mt-1 text-xs text-maroon-100">{periodLabel}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
                {REACH.map((label) => (
                  <div key={label} className="flex flex-col-reverse">
                    <dt className="mt-1.5 text-sm leading-snug text-maroon-100">{label}</dt>
                    <dd className="font-heading text-3xl font-bold leading-none text-gold-500">{formatNumber(valueOf(label))}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70 md:p-6 lg:col-span-2">
              <h3 className="font-semibold text-ink-900">Where we grew most</h3>
              <p className="mt-1 text-xs text-ink-600">
                Change from {first.year} to {lastFull.year} (latest full year)
              </p>
              <div className="mt-5">
                <GrowthBars
                  rows={REACH.map((label) => ({
                    label,
                    from: seriesFor([first], label)[0].value,
                    to: seriesFor([lastFull], label)[0].value,
                  }))}
                />
              </div>
            </div>
          </div>

          <details className="group">
            <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 font-semibold text-maroon-700 hover:underline">
              <ChevronDown size={18} className="transition group-open:rotate-180" aria-hidden /> View all figures as a table
            </summary>
            <div className="mt-4">
              <ImpactTable data={YEARLY_IMPACT} selected={year} />
            </div>
          </details>
          {last.partial && (
            <p className="text-sm text-ink-600">
              {last.year} figures are year to date. They're drawn dashed in the charts and aren't compared with full years.
            </p>
          )}
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
      <Seo title="Impact & Annual Reports" description="Annual and impact reports of Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, IMPACT, crumb])} />
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
