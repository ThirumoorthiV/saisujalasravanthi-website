import { ArrowLeft, ArrowRight, Calendar, ShieldCheck, User } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getEvent } from "@/data/events";
import { getCategory, PROGRAMME_CATEGORIES } from "@/data/programmes";
import { SITE } from "@/data/site";
import { getStory, STORIES, STORY_CATEGORIES } from "@/data/stories";
import type { StoryCategory } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard, ImageFrame, StoryCard } from "@/components/ui/Cards";
import { FilterBar } from "@/components/ui/Filters";
import { QuoteBlock, Section, Tag } from "@/components/ui/Primitives";
import { useFilters } from "@/hooks/useFilters";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const STORIES_CRUMB = { name: "Stories & Updates", path: "/stories/" };

/** Dedicated sub-pages of Stories & Updates, each fixed to one category. */
export const STORY_PAGES: Record<string, { category: StoryCategory; title: string; intro: string; image: string }> = {
  "beneficiary-stories": {
    category: "Beneficiary Stories",
    title: "Beneficiary Stories",
    intro: "Stories of change — the challenge, the journey, the intervention and the outcome.",
    image: "/images/site/infant-cardiac-care.webp",
  },
  "volunteer-stories": {
    category: "Volunteer Stories",
    title: "Volunteer Stories",
    intro: "Experiences from the doctors, Sai Youth and volunteers who make our work possible.",
    image: "/images/free/volunteer.webp",
  },
  "media-press": {
    category: "Media & Press",
    title: "Media & Press",
    intro: "News coverage and press resources. Media enquiries are welcome via our contact page.",
    image: "/images/free/helping-hand-reach.webp",
  },
};

export function StoriesList({ page }: { page?: string }) {
  const fixed = page ? STORY_PAGES[page] : undefined;
  const { values, set, reset } = useFilters(["category", "programme"]);
  const category = fixed?.category ?? values.category;
  const list = [...STORIES]
    .filter((s) => (!category || s.category === category) && (!values.programme || s.programme === values.programme))
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  const [featured, ...rest] = list;
  const crumbs = fixed ? [ROOT, STORIES_CRUMB, { name: fixed.title, path: `/stories/${page}/` }] : [ROOT, STORIES_CRUMB];

  return (
    <>
      <Seo
        title={fixed?.title ?? "Stories & Updates"}
        description={
          fixed?.intro ??
          "Beneficiary stories, programme updates, volunteer experiences and health awareness articles from rural Telangana and Andhra Pradesh."
        }
        jsonLd={breadcrumbSchema(crumbs)}
      />
      <PageHeader
        title={fixed?.title ?? "Stories & Updates"}
        intro={fixed?.intro ?? "The people behind the numbers — stories of change, programme updates and reflections on service."}
        crumbs={crumbs}
        image={fixed?.image ?? "/images/site/community-women.webp"}
      >
        <ButtonLink to="/impact/" variant="outline-light">
          Explore Our Impact
        </ButtonLink>
      </PageHeader>

      <Section tone="cream">
        <FilterBar
          filters={[
            ...(fixed ? [] : [{ key: "category", label: "Category", options: STORY_CATEGORIES.map((x) => ({ value: x, label: x })) }]),
            { key: "programme", label: "Programme", options: PROGRAMME_CATEGORIES.map((x) => ({ value: x.slug, label: x.name })) },
          ]}
          values={fixed ? { programme: values.programme } : values}
          onChange={set}
          onReset={reset}
          count={list.length}
        />

        {featured ? (
          <>
            <Link
              to={`/stories/${featured.slug}/`}
              className="group mb-10 grid overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink-200/70 transition hover:shadow-lg md:grid-cols-2"
            >
              <ImageFrame src={featured.cover} alt={featured.coverAlt} className="h-full" />
              <div className="flex flex-col justify-center p-8">
                <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
                  <Tag>{featured.category}</Tag>
                  <time dateTime={featured.publishDate}>{formatDate(featured.publishDate)}</time>
                </div>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-maroon-700">{featured.title}</h2>
                <p className="mt-3 text-lg text-ink-600">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-semibold text-maroon-700">
                  Read story <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </>
        ) : (
          <p className="rounded-lg bg-white p-10 text-center text-ink-600 ring-1 ring-ink-200">No stories in this category yet.</p>
        )}
      </Section>
    </>
  );
}

const CHANGE_SECTIONS = [
  { key: "challenge", title: "The Challenge" },
  { key: "journey", title: "The Journey" },
  { key: "intervention", title: "The Intervention" },
  { key: "outcome", title: "The Outcome" },
] as const;

export function StoryDetail() {
  const { slug = "" } = useParams();
  const story = getStory(slug);
  if (!story) return <Navigate to="/stories/" replace />;
  const programme = getCategory(story.programme);
  const event = story.relatedEvent ? getEvent(story.relatedEvent) : undefined;
  const related = STORIES.filter((s) => s.slug !== story.slug && s.programme === story.programme).slice(0, 3);
  const crumbs = [ROOT, STORIES_CRUMB, { name: story.title, path: `/stories/${story.slug}/` }];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.metaDescription,
    datePublished: story.publishDate,
    author: { "@type": "Person", name: story.author },
    publisher: { "@type": "NGO", name: SITE.legalName, url: SITE.url },
    keywords: story.tags.join(", "),
  };

  return (
    <>
      <Seo title={story.metaTitle} description={story.metaDescription} type="article" jsonLd={[articleSchema, breadcrumbSchema(crumbs)]} />
      <PageHeader title={story.title} intro={story.excerpt} crumbs={crumbs} image={story.cover}>
        <span className="flex items-center gap-2 text-maroon-100">
          <Calendar size={16} aria-hidden /> {formatDate(story.publishDate)}
        </span>
        <span className="flex items-center gap-2 text-maroon-100">
          <User size={16} aria-hidden /> {story.author}
        </span>
      </PageHeader>

      <Section tone="cream">
        <article className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Tag>{story.category}</Tag>
            {programme && (
              <Link to={`/programmes/${programme.slug}/`}>
                <Tag>{programme.name}</Tag>
              </Link>
            )}
          </div>
          <ImageFrame src={story.cover} alt={story.coverAlt} aspect="aspect-[16/9]" className="mt-6 rounded-xl" eager />

          <div className="mt-8 space-y-5 text-[17px] leading-relaxed">
            {story.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {story.change && (
            <div className="mt-10 space-y-8">
              {CHANGE_SECTIONS.map(({ key, title }, i) => (
                <section key={key} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon-700 font-heading font-bold text-gold-500">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-maroon-700">{title}</h2>
                    <p className="mt-2 text-[17px] leading-relaxed">{story.change![key]}</p>
                  </div>
                </section>
              ))}
              <QuoteBlock quote={story.change.quote} by={story.change.quoteBy} />
              {story.change.consentRecorded && (
                <p className="flex items-center gap-2 text-sm text-ink-600">
                  <ShieldCheck size={16} className="text-success" aria-hidden /> Shared with the written consent of the beneficiary / guardian. Names may be changed.
                </p>
              )}
            </div>
          )}

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
            {story.tags.map((t) => (
              <li key={t} className="rounded-full bg-white px-3 py-1 text-sm text-ink-600 ring-1 ring-ink-200">
                #{t}
              </li>
            ))}
          </ul>

          {event && (
            <div className="mt-10">
              <h2 className="mb-4 font-heading text-2xl font-semibold text-maroon-700">Related event</h2>
              <EventCard event={event} />
            </div>
          )}

          <div className="mt-10 rounded-lg bg-maroon-700 p-6 text-white">
            <p className="font-heading text-xl font-semibold">Help write the next story of change.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink to="/get-involved/" variant="light">
                Get Involved
              </ButtonLink>
              <ButtonLink to="/impact/" variant="outline-light">
                Explore Our Impact
              </ButtonLink>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon-700">More stories</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </div>
        )}

        <Link to="/stories/" className="mt-12 inline-flex items-center gap-1 font-semibold text-maroon-700 hover:text-maroon-600">
          <ArrowLeft size={16} aria-hidden /> All stories
        </Link>
      </Section>
    </>
  );
}
