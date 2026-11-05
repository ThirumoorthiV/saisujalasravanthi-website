import { Building2, Compass, Eye, HandHeart, Heart, HeartPulse, MapPin, Navigation, Quote, Sprout, Stethoscope, Target, Users } from "lucide-react";
import { CENTRES, LEADERSHIP, MILESTONES, NETWORK_OTHER_STATES } from "@/data/organisation";
import { SITE } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImageFrame } from "@/components/ui/Cards";
import { IndiaMap } from "@/components/ui/IndiaMap";
import { FilterBar, uniqueOptions } from "@/components/ui/Filters";
import { Section, SectionHeading, Tag } from "@/components/ui/Primitives";
import { useFilters } from "@/hooks/useFilters";
import type { Centre, Leader } from "@/types";
import { GetInvolvedCards } from "@/components/sections/Shared";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const ABOUT = { name: "About Us", path: "/about-us/" };

export function AboutTrust() {
  return (
    <>
      <Seo
        title="About the Trust"
        description="Sri Sathya Sai Sujala Sravanthi Trust, Hyderabad, has served rural communities since 2012 with free healthcare, water, sanitation, education and nutrition."
        jsonLd={breadcrumbSchema([ROOT, ABOUT])}
      />
      <PageHeader
        title="About the Trust"
        intro="Improving the quality of life in rural and underserved communities since 2012 — run entirely by volunteers, with every service free of cost."
        crumbs={[ROOT, ABOUT]}
        image="/images/site/sai-swasthya-centre-2.webp"
      />

      <Section tone="cream">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our history" title="From clean water to free healthcare" />
            <div className="space-y-4 text-base sm:text-[17px] leading-relaxed text-ink-900">
              <p>
                Sri Sathya Sai Sujala Sravanthi Trust was established in 2012 under the guidance of Sri Madhusudan Sai to serve rural and
                underserved communities. Our early work focused on clean drinking water, sanitation and rural infrastructure.
              </p>
              <p>
                Over the years the work has grown to include education, nutrition and healthcare — rural Sai Swasthya health centres, the free
                Sai Aarogya Multi-Speciality Hospital, a pediatric heart screening centre and a pharma bank — offering preventive and primary
                care, including for diabetes and hypertension.
              </p>
              <p>The Trust is run entirely by volunteers, and every service is provided free of charge.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageFrame src="/images/site/timmayapalli-underground-drainage.webp" alt="Villagers laying underground drainage in Timmayapalli" aspect="aspect-[16/9]" className="col-span-2 rounded-xl" />
            <ImageFrame src="/images/site/pediatric-echo-screening.webp" alt="Pediatric heart screening" className="rounded-xl" />
            <ImageFrame src="/images/site/girls-classroom.webp" alt="Girl students in a classroom" className="rounded-xl" />
          </div>
        </div>
      </Section>

      <section className="bg-maroon-900 text-white">
        <div className="mx-auto grid max-w-content items-center gap-8 md:gap-10 px-4 py-16 sm:px-6 md:grid-cols-[260px_1fr]">
          <ImageFrame
            src="/images/site/sathya-sai-baba.webp"
            alt="Bhagawan Sri Sathya Sai Baba"
            aspect="aspect-[3/4]"
            className="mx-auto w-full max-w-[260px] rounded-2xl ring-4 ring-gold-500/60"
          />
          <div>
            <Quote className="text-gold-500" size={36} aria-hidden />
            <p className="mt-3 font-heading text-4xl font-bold md:text-5xl">{SITE.motto}</p>
            <p className="mt-2 font-heading text-2xl text-gold-100 md:text-3xl">{SITE.submotto}</p>
            <p className="mt-6 max-w-2xl text-maroon-100">
              Our work is inspired by the teachings of Bhagawan Sri Sathya Sai Baba — love, peace, truth, right conduct and non-violence —
              and his message that “Hands that serve are holier than lips that pray.”
            </p>
          </div>
        </div>
      </section>

      <Section tone="tint">
        <SectionHeading eyebrow="How we work" title="Our approach" align="center" />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "Community-first", text: "Programmes shaped with and for village communities." },
            { icon: Stethoscope, title: "Preventive healthcare", text: "Catching illness early, close to home." },
            { icon: Sprout, title: "Rural development", text: "Water, sanitation and infrastructure that last." },
            { icon: HandHeart, title: "Volunteer-driven", text: "Doctors and volunteers giving time selflessly." },
          ].map(({ icon: I, title, text }) => (
            <div key={title} className="flex h-full flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-ink-200/70">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                <I aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-maroon-700">{title}</h3>
              <p className="mt-1 text-ink-600">{text}</p>
            </div>
          ))}
        </div>
      </Section>
      <GetInvolvedCards tone="white" />
    </>
  );
}

export function VisionMission() {
  const crumb = { name: "Vision & Mission", path: "/about-us/vision-mission/" };
  return (
    <>
      <Seo
        title="Vision & Mission"
        description="The vision, mission and values of Sri Sathya Sai Sujala Sravanthi Trust — One World, One Family."
        jsonLd={breadcrumbSchema([ROOT, ABOUT, crumb])}
      />
      <PageHeader
        title="Vision & Mission"
        intro="Guided by vasudhaiva kutumbakam — One World, One Family."
        crumbs={[ROOT, ABOUT, crumb]}
        image="/images/site/community-women.webp"
      />
      <Section tone="cream">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              icon: Eye,
              title: "Vision",
              text: "A world where everyone can thrive and live with dignity and purpose — guided by vasudhaiva kutumbakam, “One World, One Family”.",
            },
            {
              icon: Target,
              title: "Mission",
              text: "To improve the quality of life in rural and underserved communities through drinking water, sanitation, rural infrastructure, education, nutrition and healthcare — free of cost.",
            },
            {
              icon: Heart,
              title: "Values",
              text: "Love · Peace · Truth · Right Conduct · Non-violence. Every service is offered free, regardless of caste, creed, religion or economic status.",
            },
          ].map(({ icon: I, title, text }) => (
            <div key={title} className="flex h-full flex-col rounded-xl border-t-4 border-maroon-700 bg-white p-6 md:p-8 shadow-sm ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                <I aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-maroon-700">{title}</h2>
              <p className="mt-3 text-base sm:text-[17px] leading-relaxed text-ink-900">{text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="white">
        <div className="grid items-center gap-8 md:gap-10 md:grid-cols-[240px_1fr]">
          <div className="mx-auto flex w-full max-w-[240px] items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
            <img src="/images/brand/one-world-one-family.png" alt="One World One Family Mission logo" className="h-auto w-full" loading="lazy" />
          </div>
          <div>
            <SectionHeading eyebrow="Part of a wider mission" title="One World One Family Mission" />
            <p className="text-base sm:text-[17px] leading-relaxed text-ink-900">
              The Trust is part of the One World One Family Mission, which fuses service and spirituality with a global reach, and has set up
              institutes of excellence in nutrition, education and healthcare — all offered free of cost.
            </p>
            <blockquote className="mt-6 rounded-r-lg border-l-4 border-maroon-700 bg-gold-100 p-5 font-heading text-xl italic text-ink-900">
              “Hands that serve are holier than lips that pray.” — Sri Sathya Sai Baba
            </blockquote>
          </div>
        </div>
      </Section>
    </>
  );
}

export function OurJourney() {
  const crumb = { name: "Our Journey", path: "/about-us/our-journey/" };
  return (
    <>
      <Seo title="Our Journey" description="Milestones of Sai Sujala Sravanthi from 2012 to today, including past initiatives such as COVID Relief." jsonLd={breadcrumbSchema([ROOT, ABOUT, crumb])} />
      <PageHeader
        title="Our Journey"
        intro="From clean water in one village to free healthcare across two states."
        crumbs={[ROOT, ABOUT, crumb]}
        image="/images/site/drinking-water-tank.webp"
      />
      <Section tone="cream">
        <ol className="relative mx-auto max-w-3xl border-l-2 border-maroon-100 pl-8">
          {MILESTONES.map((m) => (
            <li key={m.title} className="relative mb-10 last:mb-0">
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-maroon-700 ring-4 ring-cream" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-gold-500" />
              </span>
              <p className="font-heading text-2xl font-bold text-maroon-700">{m.year}</p>
              <h3 className="mt-1 text-xl font-semibold text-ink-900">{m.title}</h3>
              <p className="mt-1 text-ink-600">{m.text}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-3xl text-sm text-ink-600">Milestone dates marked “—” are awaiting confirmation from the Trust.</p>
      </Section>
    </>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lg">
      <ImageFrame src={leader.photo} alt={leader.name} aspect="aspect-square" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold leading-snug text-maroon-700">{leader.name}</h3>
        <p className="mt-2 text-ink-600">{leader.bio}</p>
      </div>
    </article>
  );
}

export function Leadership() {
  const crumb = { name: "Leadership", path: "/about-us/leadership/" };
  const founder = LEADERSHIP.find((l) => l.role === "Founder & Guiding Light")!;
  const trustees = LEADERSHIP.filter((l) => l.role === "Board of Trustees");
  const council = LEADERSHIP.filter((l) => l.role === "Advisory Council");
  return (
    <>
      <Seo
        title="Leadership, Trustees & Advisory Council"
        description="Meet the founder, Board of Trustees and Advisory Council who guide Sri Sathya Sai Sujala Sravanthi Trust."
        jsonLd={breadcrumbSchema([ROOT, ABOUT, crumb])}
      />
      <PageHeader
        title="Leadership & Advisory Council"
        intro="Experienced engineers, pharma leaders, regulators and entrepreneurs who guide our work."
        crumbs={[ROOT, ABOUT, crumb]}
      />

      {/* Founder — content left, photo right */}
      <Section tone="cream">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-maroon-400">{founder.role}</p>
            <h2 className="mt-2 font-heading text-[32px] font-bold leading-tight text-maroon-700 md:text-5xl">{founder.name}</h2>
            <div className="mt-4 h-0.5 w-16 bg-gold-500" />
            <p className="mt-5 text-base leading-relaxed sm:mt-6 sm:text-lg text-ink-900">{founder.bio}</p>
            <p className="mt-4 text-base leading-relaxed sm:text-lg text-ink-900">
              Guided by the principle of vasudhaiva kutumbakam — One World, One Family — his vision fuses service and spirituality to build
              a world where everyone can live with dignity and purpose.
            </p>
            <figure className="mt-8 rounded-r-lg border-l-4 border-maroon-700 bg-gold-100 p-5">
              <blockquote className="font-heading text-xl italic text-ink-900">“{SITE.motto}. {SITE.submotto}.”</blockquote>
            </figure>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl bg-gold-500/30" aria-hidden />
            <ImageFrame src={founder.photo} alt={founder.name} aspect="aspect-[4/5]" className="relative rounded-2xl shadow-lg" eager />
          </div>
        </div>
      </Section>

      {/* Board of Trustees */}
      <Section tone="white">
        <SectionHeading eyebrow="Board of Trustees" title="Stewards of the Trust" align="center" />
        <ul className="flex flex-wrap justify-center gap-6">
          {trustees.map((l) => (
            <li key={l.name} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <LeaderCard leader={l} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Advisory Council */}
      <Section tone="cream">
        <SectionHeading eyebrow="Advisory Council" title="Expertise that guides our work" align="center" />
        <ul className="flex flex-wrap justify-center gap-6">
          {council.map((l) => (
            <li key={l.name} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <LeaderCard leader={l} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

const directionsUrl = (c: Centre) => {
  const name = c.name.replace(" — ", " ");
  const parts = name.includes(c.address) ? [name, c.state] : [name, c.address, c.state];
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
};

export function OurNetwork() {
  const crumb = { name: "Our Network", path: "/about-us/our-network/" };
  const { values, set, reset } = useFilters(["state", "type"]);
  const list = CENTRES.filter((c) => (!values.state || c.state === values.state) && (!values.type || c.type === values.type));
  const states = [...new Set(list.map((c) => c.state))];
  // Map counts follow the type filter only, so every state stays selectable.
  const byType = CENTRES.filter((c) => !values.type || c.type === values.type);
  const mapCounts = byType.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.state]: (acc[c.state] ?? 0) + 1 }), {});
  const mapStates = [...new Set(CENTRES.map((c) => c.state))].filter((s) => s !== "Other");
  const countOf = (type: Centre["type"]) => list.filter((c) => c.type === type).length;
  const SUMMARY = [
    { icon: Building2, label: "Total locations", value: list.length },
    { icon: Stethoscope, label: "Sai Swasthya centres", value: countOf("Sai Swasthya Centre") },
    { icon: HeartPulse, label: "Hospitals & screening", value: countOf("Hospital") + countOf("Screening Centre") },
    { icon: Compass, label: "States", value: states.length },
  ];

  return (
    <>
      <Seo title="Our Network — Find a Healthcare Centre" description="Find a Sai Swasthya wellness centre, Sai Aarogya Hospital or our Hyderabad office." jsonLd={breadcrumbSchema([ROOT, ABOUT, crumb])} />
      <PageHeader
        title="Our Network"
        intro="Find a healthcare centre near you."
        crumbs={[ROOT, ABOUT, crumb]}
        image="/images/site/sai-swasthya-centre-1.webp"
      />
      <Section tone="cream">
        <FilterBar
          filters={[
            { key: "state", label: "State", options: uniqueOptions(CENTRES.map((c) => c.state)) },
            { key: "type", label: "Centre type", options: uniqueOptions(CENTRES.map((c) => c.type)) },
          ]}
          values={values}
          onChange={set}
          onReset={reset}
          count={list.length}
        />

        {/* Counts — update with the filters */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {SUMMARY.map(({ icon: I, label, value }) => (
            <div key={label} className="flex h-full flex-col items-start gap-3 rounded-xl bg-maroon-700 p-4 text-white shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-500 sm:h-12 sm:w-12">
                <I aria-hidden />
              </span>
              <div>
                <p className="font-heading text-[28px] font-bold leading-none text-gold-500 sm:text-3xl">{value}</p>
                <p className="mt-1 text-sm leading-snug text-maroon-100">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map + centres */}
        <div className="mt-10 grid items-start gap-6 sm:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 sm:p-6 lg:sticky lg:top-40">
            <h2 className="font-heading text-xl font-semibold text-maroon-700 sm:text-2xl">Find us on the map</h2>
            <p className="mt-1 text-sm text-ink-600">Select a highlighted state to see its centres.</p>
            <div className="mx-auto mt-4 max-w-[420px]">
              <IndiaMap counts={mapCounts} network={NETWORK_OTHER_STATES} selected={values.state} onSelect={(s) => set("state", s)} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-maroon-700" aria-hidden /> Our centres
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-gold-500/45" aria-hidden /> Wider Sai Swasthya network
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-200 pt-4" role="group" aria-label="Choose a state">
              {[{ name: "", label: "All states", count: Object.values(mapCounts).reduce((a, b) => a + b, 0) }, ...mapStates.map((s) => ({ name: s, label: s, count: mapCounts[s] ?? 0 }))].map((s) => {
                const on = values.state === s.name;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => set("state", s.name)}
                    aria-pressed={on}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors ${
                      on ? "bg-maroon-700 text-white ring-maroon-700" : "bg-white text-maroon-700 ring-ink-200 hover:bg-maroon-50"
                    }`}
                  >
                    {s.label}
                    <span className={`rounded-full px-2 text-xs ${on ? "bg-white/20" : "bg-maroon-100"}`}>{s.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div aria-live="polite">
            {list.length ? (
              states.map((s) => {
                const inState = list.filter((c) => c.state === s);
                return (
                  <section key={s} className="mb-8 last:mb-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-heading text-xl font-semibold text-maroon-700 sm:text-2xl">{s}</h2>
                      <p className="shrink-0 text-sm text-ink-600">
                        {inState.length} {inState.length === 1 ? "centre" : "centres"}
                      </p>
                    </div>
                    <div className="mt-2 h-0.5 w-12 bg-gold-500" />
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                      {inState.map((c) => (
                        <li key={c.name} className="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70">
                          <p className="mb-3 flex flex-wrap gap-2">
                            <Tag>{c.type}</Tag>
                          </p>
                          <h3 className="font-heading text-lg font-semibold text-maroon-700">{c.name}</h3>
                          <p className="mt-2 flex gap-2 text-sm text-ink-600">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-maroon-400" aria-hidden /> {c.address}, {c.state}
                          </p>
                          <a
                            href={directionsUrl(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-maroon-700 hover:underline"
                          >
                            <Navigation size={14} aria-hidden /> Get directions<span className="sr-only"> to {c.name} (opens Google Maps)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            ) : (
              <p className="rounded-xl bg-white p-10 text-center text-ink-600 ring-1 ring-ink-200">No centres match these filters.</p>
            )}
          </div>
        </div>
        <p className="mt-8 rounded-xl bg-gold-100 p-4 text-sm text-ink-900">
          The wider Sai Swasthya network also serves {NETWORK_OTHER_STATES.join(", ")}. Full addresses for each centre are being confirmed
          with the Trust.
        </p>
      </Section>
    </>
  );
}
