import { AlertCircle, ArrowRight, CheckCircle2, Lightbulb, MapPin, Users } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { EVENTS, sortByDateDesc } from "@/data/events";
import { GALLERY } from "@/data/organisation";
import { getCategory, getProgramme, PROGRAMME_CATEGORIES, PROGRAMMES, programmesIn } from "@/data/programmes";
import { STORIES } from "@/data/stories";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard, ImageFrame, ProgrammeCard, StoryCard } from "@/components/ui/Cards";
import { QuoteBlock, Section, SectionHeading } from "@/components/ui/Primitives";
import { CsrBand, MedicalVolunteerBanner } from "@/components/sections/Shared";
import { Icon } from "@/lib/icons";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const PROGS = { name: "Our Programmes", path: "/programmes/" };

export function ProgrammesOverview() {
  const past = PROGRAMMES.filter((p) => !p.active);
  return (
    <>
      <Seo
        title="Our Programmes"
        description="Healthcare, rural development, education, community empowerment and relief programmes by Sai Sujala Sravanthi."
        jsonLd={breadcrumbSchema([ROOT, PROGS])}
      />
      <PageHeader
        title="Our Programmes"
        intro="Five programme areas, one purpose: healthier, more empowered communities."
        crumbs={[ROOT, PROGS]}
        image="/images/site/outreach-camp-consultations.webp"
      />
      {PROGRAMME_CATEGORIES.map((cat, i) => {
        const list = programmesIn(cat.slug);
        return (
          <Section key={cat.slug} tone={i % 2 ? "tint" : "cream"}>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="flex gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-maroon-700 text-gold-500">
                  <Icon name={cat.icon} size={28} />
                </span>
                <div>
                  <h2 className="font-heading text-[26px] font-semibold text-maroon-700 md:text-3xl">{cat.name}</h2>
                  <p className="mt-1 max-w-2xl text-ink-600">{cat.summary}</p>
                </div>
              </div>
              <Link to={`/programmes/${cat.slug}/`} className="inline-flex shrink-0 items-center gap-1 font-semibold text-maroon-700 hover:text-maroon-600">
                Explore {cat.name} <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProgrammeCard key={p.slug} programme={p} />
              ))}
            </div>
          </Section>
        );
      })}
      {past.length > 0 && (
        <Section tone="white">
          <p className="text-center text-ink-600">
            Looking for past initiatives such as {past.map((p) => p.name).join(", ")}?{" "}
            <Link to="/about-us/our-journey/" className="font-semibold text-maroon-700 underline">
              See Our Journey
            </Link>
          </p>
        </Section>
      )}
    </>
  );
}

export function ProgrammeCategoryPage() {
  const { category = "" } = useParams();
  const cat = getCategory(category);
  if (!cat) return <Navigate to="/programmes/" replace />;
  const list = programmesIn(cat.slug);
  const crumb = { name: cat.name, path: `/programmes/${cat.slug}/` };
  const events = sortByDateDesc(EVENTS.filter((e) => e.programme === cat.slug)).slice(0, 4);
  const stories = STORIES.filter((s) => s.programme === cat.slug).slice(0, 3);

  return (
    <>
      <Seo title={cat.pageTitle} description={cat.summary} jsonLd={breadcrumbSchema([ROOT, PROGS, crumb])} />
      <PageHeader title={cat.pageTitle} intro={cat.summary} crumbs={[ROOT, PROGS, crumb]} image={cat.image}>
        {cat.ctas.map((c, i) => (
          <ButtonLink key={c.to} to={c.to} variant={i === 0 ? "light" : "outline-light"}>
            {c.label}
          </ButtonLink>
        ))}
      </PageHeader>

      <Section tone="cream">
        <SectionHeading eyebrow={cat.name} title={`${cat.name} programmes`} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProgrammeCard key={p.slug} programme={p} />
          ))}
        </div>
        {cat.slug === "healthcare" && (
          <div className="mt-12">
            <MedicalVolunteerBanner />
          </div>
        )}
      </Section>

      {events.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="Latest updates" title={`${cat.name} events`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </Section>
      )}

      {stories.length > 0 && (
        <Section tone="tint">
          <SectionHeading eyebrow="Stories" title={`${cat.name} stories`} />
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </Section>
      )}
      <CsrBand />
    </>
  );
}

export function ProgrammeDetail() {
  const { category = "", slug = "" } = useParams();
  const programme = getProgramme(category, slug);
  const cat = getCategory(category);
  if (!programme || !cat) return <Navigate to="/programmes/" replace />;

  const crumbs = [ROOT, PROGS, { name: cat.name, path: `/programmes/${cat.slug}/` }, { name: programme.name, path: `/programmes/${cat.slug}/${programme.slug}/` }];
  const events = sortByDateDesc(EVENTS.filter((e) => e.programme === cat.slug)).slice(0, 2);
  const stories = STORIES.filter((s) => s.programme === cat.slug);
  const beneficiary = stories.find((s) => s.change);
  const photos = GALLERY.filter((g) => g.programme === cat.slug).slice(0, 4);

  return (
    <>
      <Seo title={programme.name} description={programme.summary} jsonLd={breadcrumbSchema(crumbs)} />
      <PageHeader title={programme.name} intro={programme.summary} crumbs={crumbs} image={programme.image}>
        {cat.ctas.map((c, i) => (
          <ButtonLink key={c.to} to={c.to} variant={i === 0 ? "light" : "outline-light"}>
            {c.label}
          </ButtonLink>
        ))}
      </PageHeader>

      {/* 1–2. Problem & solution */}
      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-8 ring-1 ring-ink-200">
            <AlertCircle className="text-maroon-400" aria-hidden />
            <h2 className="mt-3 font-heading text-2xl font-semibold text-maroon-700">The problem</h2>
            <p className="mt-3 text-[17px] leading-relaxed">{programme.problem}</p>
          </div>
          <div className="rounded-lg bg-maroon-700 p-8 text-white">
            <Lightbulb className="text-gold-500" aria-hidden />
            <h2 className="mt-3 font-heading text-2xl font-semibold">Our solution</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-maroon-100">{programme.solution}</p>
          </div>
        </div>
      </Section>

      {/* 3–5. Where, who, services */}
      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-maroon-700">
              <MapPin size={20} aria-hidden /> Where we work
            </h2>
            <ul className="mt-3 space-y-2">
              {programme.locations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-maroon-700">
              <Users size={20} aria-hidden /> Who we serve
            </h2>
            <ul className="mt-3 space-y-2">
              {programme.whoWeServe.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-maroon-700">
              <CheckCircle2 size={20} aria-hidden /> Services
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {programme.services.map((s) => (
                <li key={s} className="rounded-full bg-maroon-100 px-3 py-1 text-sm text-maroon-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 6. Impact */}
      <Section tone="maroon">
        <SectionHeading eyebrow="Impact" title="What this programme has achieved" light />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programme.impact.map((m) => (
            <div key={m.label} className="rounded-lg bg-maroon-700 p-6">
              <p className="font-heading text-3xl font-bold text-gold-500">{m.value}</p>
              <p className="mt-1 text-maroon-100">{m.label}</p>
            </div>
          ))}
        </div>
        <Link to="/impact/" className="mt-6 inline-flex items-center gap-1 font-semibold text-gold-100 hover:text-white">
          Definitions & data sources <ArrowRight size={16} aria-hidden />
        </Link>
      </Section>

      {/* 7. Latest updates */}
      {events.length > 0 && (
        <Section tone="cream">
          <SectionHeading eyebrow="Latest updates" title="Recent and upcoming events" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </Section>
      )}

      {/* 8. Photos */}
      {photos.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="Photos" title="From the field" action={{ label: "View gallery", to: "/gallery/" }} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((p) => (
              <figure key={p.id}>
                <ImageFrame src={p.src} alt={p.alt} className="rounded-xl" />
                <figcaption className="mt-2 text-sm text-ink-600">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* 9. Beneficiary stories */}
      {beneficiary?.change && (
        <Section tone="tint">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Stories of change" title={beneficiary.title} intro={beneficiary.excerpt} />
              <ButtonLink to={`/stories/${beneficiary.slug}/`} variant="secondary" className="-mt-4">
                Read the full story
              </ButtonLink>
            </div>
            <QuoteBlock quote={beneficiary.change.quote} by={beneficiary.change.quoteBy} />
          </div>
        </Section>
      )}
      <CsrBand />
    </>
  );
}
