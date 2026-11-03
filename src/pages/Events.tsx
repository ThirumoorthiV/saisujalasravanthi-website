import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Target, Users } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { EVENT_CATEGORIES, EVENTS, getEvent, SAMPLE_EVENTS, sortByDateDesc } from "@/data/events";
import { getCategory, PROGRAMME_CATEGORIES } from "@/data/programmes";
import { SITE } from "@/data/site";
import { getStory } from "@/data/stories";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard, ImageFrame, StoryCard } from "@/components/ui/Cards";
import { FilterBar, uniqueOptions } from "@/components/ui/Filters";
import { Section, Tag } from "@/components/ui/Primitives";
import { useFilters } from "@/hooks/useFilters";
import { formatDate, formatNumber } from "@/lib/format";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const EVENTS_CRUMB = { name: "Events", path: "/events/" };

export function EventsList() {
  const tab = useFilters(["status"]);
  const { values, set, reset } = useFilters(["category", "programme", "state", "year"]);
  // Open on Past events whenever nothing is scheduled.
  const hasUpcoming = EVENTS.some((e) => e.status === "Upcoming");
  const status = tab.values.status || (hasUpcoming ? "Upcoming" : "Completed");

  const filtered = EVENTS.filter(
    (e) =>
      e.status === status &&
      (!values.category || e.category === values.category) &&
      (!values.programme || e.programme === values.programme) &&
      (!values.state || e.location.state === values.state) &&
      (!values.year || e.startDate.startsWith(values.year)),
  );
  const list = status === "Upcoming" ? [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate)) : sortByDateDesc(filtered);

  return (
    <>
      <Seo
        title="Events — Medical Camps & Community Programmes"
        description="Upcoming and past free medical camps, health awareness programmes, CSR events and workshops across Telangana and Andhra Pradesh."
        jsonLd={breadcrumbSchema([ROOT, EVENTS_CRUMB])}
      />
      <PageHeader
        title="Events"
        intro="Medical camps, awareness programmes, CSR events and community gatherings — see what's coming up and what we've done."
        crumbs={[ROOT, EVENTS_CRUMB]}
        image="/images/site/outreach-medical-camp.webp"
      />
      <Section tone="cream">
        {SAMPLE_EVENTS && (
          <p className="mb-6 rounded-lg bg-gold-100 p-4 text-sm text-ink-900">
            <strong>Preview:</strong> these listings are based on our real programmes, but dates and numbers are illustrative until the Trust's
            event reports are added.
          </p>
        )}
        <div role="tablist" aria-label="Event status" className="mb-6 inline-flex rounded-lg bg-white p-1 ring-1 ring-ink-200">
          {(["Upcoming", "Completed"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => tab.set("status", s)}
              className={`min-h-[44px] rounded-md px-6 font-semibold transition ${
                status === s ? "bg-maroon-700 text-white" : "text-maroon-700 hover:bg-maroon-50"
              }`}
            >
              {s === "Upcoming" ? "Upcoming" : "Past events"}
            </button>
          ))}
        </div>
        <FilterBar
          filters={[
            { key: "category", label: "Category", options: EVENT_CATEGORIES.map((c) => ({ value: c, label: c })) },
            { key: "programme", label: "Programme", options: PROGRAMME_CATEGORIES.map((c) => ({ value: c.slug, label: c.name })) },
            { key: "state", label: "Location", options: uniqueOptions(EVENTS.map((e) => e.location.state)) },
            { key: "year", label: "Year", options: uniqueOptions(EVENTS.map((e) => e.startDate.slice(0, 4))).reverse() },
          ]}
          values={values}
          onChange={set}
          onReset={reset}
          count={list.length}
        />
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-10 text-center text-ink-600 ring-1 ring-ink-200">
            {status === "Upcoming" && !hasUpcoming ? (
              <>
                No upcoming events right now — please check back soon.{" "}
                <button type="button" onClick={() => tab.set("status", "Completed")} className="font-semibold text-maroon-700 underline">
                  See past events
                </button>
              </>
            ) : (
              "No events match these filters."
            )}
          </p>
        )}
      </Section>
    </>
  );
}

export function EventDetail() {
  const { slug = "" } = useParams();
  const event = getEvent(slug);
  if (!event) return <Navigate to="/events/" replace />;
  const programme = getCategory(event.programme);
  const story = event.relatedStory ? getStory(event.relatedStory) : undefined;
  const crumbs = [ROOT, EVENTS_CRUMB, { name: event.title, path: `/events/${event.slug}/` }];
  const where = `${event.location.village}, ${event.location.district}, ${event.location.state}`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate ?? event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.objective,
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: event.location.village,
      address: { "@type": "PostalAddress", addressLocality: event.location.village, addressRegion: event.location.state, addressCountry: "IN" },
    },
    organizer: { "@type": "NGO", name: SITE.legalName, url: SITE.url },
  };

  return (
    <>
      <Seo title={event.title} description={`${event.objective} ${formatDate(event.startDate)}, ${where}.`} jsonLd={[eventSchema, breadcrumbSchema(crumbs)]} />
      <PageHeader title={event.title} crumbs={crumbs} image={event.image}>
        <span className="flex items-center gap-2 text-maroon-100">
          <CalendarDays size={18} aria-hidden /> {formatDate(event.startDate)}
          {event.endDate && ` – ${formatDate(event.endDate)}`}
        </span>
        <span className="flex items-center gap-2 text-maroon-100">
          <MapPin size={18} aria-hidden /> {where}
        </span>
      </PageHeader>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag>{event.category}</Tag>
              {programme && (
                <Link to={`/programmes/${programme.slug}/`}>
                  <Tag>{programme.name}</Tag>
                </Link>
              )}
              <Tag>{event.status}</Tag>
            </div>
            <ImageFrame src={event.image} alt={`Photo from ${event.title}`} aspect="aspect-[16/9]" className="mt-6 rounded-xl" eager />

            <h2 className="mt-10 flex items-center gap-2 font-heading text-2xl font-semibold text-maroon-700">
              <Target size={22} aria-hidden /> Objective
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed">{event.objective}</p>

            <h2 className="mt-8 flex items-center gap-2 font-heading text-2xl font-semibold text-maroon-700">
              <Users size={22} aria-hidden /> Who benefited
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed">{event.whoBenefited}</p>

            <h2 className="mt-8 font-heading text-2xl font-semibold text-maroon-700">Key activities</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {event.keyActivities.map((a) => (
                <li key={a} className="flex gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden /> {a}
                </li>
              ))}
            </ul>

            {event.partners && (
              <>
                <h2 className="mt-8 font-heading text-2xl font-semibold text-maroon-700">Partner organisations</h2>
                <p className="mt-3">{event.partners.join(", ")}</p>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg bg-maroon-700 p-6 text-white">
              <h2 className="font-heading text-xl font-semibold">Impact</h2>
              <dl className="mt-4 space-y-4">
                {event.impact.map((m) => (
                  <div key={m.label}>
                    <dt className="text-sm text-maroon-100">{m.label}</dt>
                    <dd className="font-heading text-4xl font-bold text-gold-500">{formatNumber(m.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-lg bg-white p-6 ring-1 ring-ink-200">
              <h2 className="text-lg font-semibold text-maroon-700">Want to help at events like this?</h2>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink to="/get-involved/volunteer/">Volunteer</ButtonLink>
                <ButtonLink to="/csr-partnerships/" variant="secondary">
                  Sponsor a camp
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>

        {story && (
          <div className="mt-14">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon-700">Related story</h2>
            <div className="max-w-md">
              <StoryCard story={story} />
            </div>
          </div>
        )}

        <Link to="/events/" className="mt-12 inline-flex items-center gap-1 font-semibold text-maroon-700 hover:text-maroon-600">
          <ArrowLeft size={16} aria-hidden /> All events
        </Link>
      </Section>
    </>
  );
}
