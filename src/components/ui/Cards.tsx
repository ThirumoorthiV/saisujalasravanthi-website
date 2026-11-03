import type { ReactNode } from "react";
import { ArrowRight, Calendar, Info, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { ImpactMetric, Programme, Story, TrustEvent } from "@/types";
import { getCategory } from "@/data/programmes";
import { dateBadge, formatDate, formatNumber } from "@/lib/format";
import { PendingBadge, Tag } from "./Primitives";

/**
 * Shows the whole photo (object-contain) inside a fixed aspect ratio, over a
 * blurred copy of itself so letterboxing never looks empty. Used for every
 * card and in-page photo so nothing gets cropped.
 */
export function ImageFrame({
  src,
  alt,
  aspect = "aspect-[4/3]",
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-maroon-50 ${aspect} ${className}`}>
      <img src={src} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl" />
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="relative h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}

interface MediaCardProps {
  image: string;
  imageAlt?: string;
  title: string;
  text?: string;
  /** Small row above the title: tags, dates, status. */
  meta?: ReactNode;
  /** Extra body content (e.g. project details) rendered above the CTA. */
  children?: ReactNode;
  cta?: string;
  to?: string;
  /** Opens `to` as a normal external link. */
  external?: boolean;
  headingLevel?: "h2" | "h3";
}

/** The one card used across the site: full image on top, consistent body, CTA pinned to the bottom. */
export function MediaCard({ image, imageAlt = "", title, text, meta, children, cta, to, external, headingLevel = "h3" }: MediaCardProps) {
  const Heading = headingLevel;
  const body = (
    <>
      <ImageFrame src={image} alt={imageAlt} />
      <div className="flex flex-1 flex-col p-6">
        {meta && <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-ink-600">{meta}</div>}
        <Heading className="font-heading text-xl font-semibold leading-snug text-maroon-700">{title}</Heading>
        {text && <p className="mt-2 line-clamp-3 text-ink-600">{text}</p>}
        {children}
        {cta && (
          <span className="mt-auto inline-flex items-center gap-1 pt-5 font-semibold text-maroon-700">
            {cta} <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );
  const cls =
    "group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lg";
  if (!to) return <article className={cls}>{body}</article>;
  if (external || /^https?:/.test(to))
    return (
      <a href={to} className={cls}>
        {body}
      </a>
    );
  return (
    <Link to={to} className={cls}>
      {body}
    </Link>
  );
}

export function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <MediaCard
      image={programme.image}
      imageAlt={programme.name}
      meta={<Tag>{getCategory(programme.category)?.name}</Tag>}
      title={programme.name}
      text={programme.summary}
      cta="Learn more"
      to={`/programmes/${programme.category}/${programme.slug}/`}
    />
  );
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <MediaCard
      image={story.cover}
      imageAlt={story.coverAlt}
      meta={
        <>
          <Tag>{story.category}</Tag>
          <time dateTime={story.publishDate}>{formatDate(story.publishDate)}</time>
        </>
      }
      title={story.title}
      text={story.excerpt}
      cta="Read story"
      to={`/stories/${story.slug}/`}
    />
  );
}

export function EventCard({ event }: { event: TrustEvent }) {
  const badge = dateBadge(event.startDate);
  const upcoming = event.status === "Upcoming";
  return (
    <MediaCard
      image={event.image}
      imageAlt={event.title}
      meta={
        <>
          <span className="inline-flex items-center gap-1 rounded bg-maroon-700 px-2 py-1 text-xs font-semibold text-white">
            <Calendar size={12} aria-hidden /> {badge.day} {badge.month} {badge.year}
          </span>
          <Tag>{event.category}</Tag>
          <span className={`rounded px-2 py-1 text-xs font-semibold ${upcoming ? "bg-success/10 text-success" : "bg-ink-200/60 text-ink-600"}`}>
            {event.status}
          </span>
        </>
      }
      title={event.title}
      cta="View event"
      to={`/events/${event.slug}/`}
    >
      <p className="mt-2 flex items-start gap-1 text-sm text-ink-600">
        <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden /> {event.location.village}, {event.location.district}, {event.location.state}
      </p>
    </MediaCard>
  );
}

export function StatBlock({ metric, dark = false }: { metric: ImpactMetric; dark?: boolean }) {
  return (
    <div className={`flex h-full flex-col rounded-xl p-6 ${dark ? "bg-maroon-900" : "bg-maroon-700"} text-white`}>
      <p className="font-heading text-[40px] font-bold leading-none text-gold-500 md:text-[52px]">
        {metric.prefix}
        {formatNumber(metric.value)}
        {metric.suffix}
      </p>
      <p className="mt-2 text-lg font-semibold">{metric.label}</p>
      <p className="mt-1 text-sm text-maroon-100">{metric.period}</p>
      <p className="mt-auto flex items-center gap-1 pt-3 text-xs text-maroon-100">
        <Calendar size={12} aria-hidden /> As of {metric.asOf}
      </p>
      {!metric.verified && (
        <p className="mt-2">
          <PendingBadge />
        </p>
      )}
    </div>
  );
}

export function MetricDetail({ metric }: { metric: ImpactMetric }) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
      <div className="flex items-center justify-between gap-3">
        <p className="whitespace-nowrap font-heading text-4xl font-bold text-maroon-700">
          {metric.prefix}
          {formatNumber(metric.value)}
          {metric.suffix}
        </p>
      </div>
      <h3 className="mt-2 truncate text-lg font-semibold text-ink-900" title={metric.label}>
        {metric.label}
      </h3>
      <div className="mt-3 h-0.5 w-10 bg-gold-500" />
      <dl className="mt-4 space-y-1.5 text-sm text-ink-600">
        <div className="flex gap-1.5">
          <Info size={14} className="mt-0.5 shrink-0 text-maroon-400" aria-hidden />
          <dt className="sr-only">Definition</dt>
          <dd>{metric.definition}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-ink-900">Period: </dt>
          <dd className="inline">{metric.period}</dd>
        </div>
        {!/pending/i.test(metric.asOf) && (
          <div>
            <dt className="inline font-semibold text-ink-900">As of: </dt>
            <dd className="inline">{metric.asOf}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
