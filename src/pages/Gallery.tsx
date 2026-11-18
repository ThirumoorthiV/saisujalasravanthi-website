import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { GALLERY } from "@/data/organisation";
import { getCategory } from "@/data/programmes";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilterBar, uniqueOptions } from "@/components/ui/Filters";

import { ImageFrame } from "@/components/ui/Cards";
import { Section, Tag } from "@/components/ui/Primitives";
import { useFilters } from "@/hooks/useFilters";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, Seo } from "@/lib/seo";
import type { GalleryItem } from "@/types";

const ROOT = { name: "Home", path: "/" };
const CRUMB = { name: "Gallery", path: "/gallery/" };
const GROUPS = ["Healthcare", "Education", "Rural Development", "CSR", "Events"] as const;

function Lightbox({ items, index, onClose, onMove }: { items: GalleryItem[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  return (
    // Above the sticky site header (z-50), with a near-solid backdrop so the page behind doesn't show through.
    <div role="dialog" aria-modal="true" aria-label={item.caption} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5 sm:top-5"
      >
        <X aria-hidden />
      </button>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} className="max-h-[75vh] w-full rounded-lg bg-black object-contain" />
        <div className="mt-4 text-white">
          <p className="text-lg font-semibold">{item.caption}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-white/70">
            <span>{getCategory(item.programme)?.name}</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} aria-hidden /> {item.location}
            </span>
            <span>{formatDate(item.date)}</span>
            <span>
              {index + 1} / {items.length}
            </span>
          </p>
        </div>
        <button onClick={() => onMove(-1)} aria-label="Previous photo" className="absolute left-2 top-1/3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-maroon-700 hover:bg-white">
          <ChevronLeft aria-hidden />
        </button>
        <button onClick={() => onMove(1)} aria-label="Next photo" className="absolute right-2 top-1/3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-maroon-700 hover:bg-white">
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}

export const GALLERY_PAGES: Record<string, (typeof GROUPS)[number]> = {
  healthcare: "Healthcare",
  education: "Education",
  "rural-development": "Rural Development",
  csr: "CSR",
  events: "Events",
};
const slugFor = (g: string) => Object.keys(GALLERY_PAGES).find((k) => GALLERY_PAGES[k] === g)!;

export default function Gallery() {
  const { group: slug } = useParams();
  const group = slug ? GALLERY_PAGES[slug] : undefined;
  const { values, set, reset } = useFilters(["year", "location"]);
  const [open, setOpen] = useState<number | null>(null);

  const inGroup = GALLERY.filter((g) => !group || g.group === group);
  const list = inGroup
    .filter((g) => (!values.year || g.date.startsWith(values.year)) && (!values.location || g.location === values.location))
    .sort((a, b) => b.date.localeCompare(a.date));

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  if (slug && !group) return <Navigate to="/gallery/" replace />;
  const crumbs = group ? [ROOT, CRUMB, { name: group, path: `/gallery/${slug}/` }] : [ROOT, CRUMB];
  const title = group ? `${group} Gallery` : "Gallery";

  return (
    <>
      <Seo
        title={title}
        description="Photos from our medical camps, wellness centres, rural development projects, education programmes and CSR activities."
        jsonLd={breadcrumbSchema(crumbs)}
      />
      <PageHeader
        title={title}
        intro="Visual proof of work — moments from the field across all our programmes."
        crumbs={crumbs}
        image={inGroup[0]?.src ?? "/images/site/outreach-camp-consultations.webp"}
      />
      <Section tone="cream">
        {!group && (
          // Phones: an even 2-column grid (an odd last one spans both). Larger screens: one row of pills.
          <nav aria-label="Gallery categories" className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {GROUPS.map((g, i) => (
              <Link
                key={g}
                to={`/gallery/${slugFor(g)}/`}
                className={`inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-white px-4 text-sm font-semibold text-maroon-700 ring-1 ring-ink-200 hover:bg-maroon-50 ${
                  GROUPS.length % 2 === 1 && i === GROUPS.length - 1 ? "col-span-2" : ""
                }`}
              >
                {g}
              </Link>
            ))}
          </nav>
        )}
        <FilterBar
          filters={[
            { key: "year", label: "Year", options: uniqueOptions(inGroup.map((g) => g.date.slice(0, 4))).reverse() },
            { key: "location", label: "Location", options: uniqueOptions(inGroup.map((g) => g.location)) },
          ]}
          values={values}
          onChange={set}
          onReset={reset}
          count={list.length}
        />
        {/* Phones: a compact 2-column photo grid (caption + place only); larger screens show the full card. */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {list.map((item, i) => (
            <li key={item.id} className="min-w-0">
              <button
                onClick={() => setOpen(i)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lg"
                aria-label={`Open photo: ${item.caption}`}
              >
                <ImageFrame src={item.src} alt={item.alt} />
                <span className="flex flex-1 flex-col p-3 sm:p-5">
                  <span className="mb-2 hidden sm:block">
                    <Tag>{item.subCategory}</Tag>
                  </span>
                  <span className="font-heading text-[15px] font-semibold leading-snug text-maroon-700 sm:text-lg">{item.caption}</span>
                  <span className="mt-1 flex items-start gap-1 text-xs text-ink-600 sm:items-center sm:text-sm">
                    <MapPin size={14} className="mt-px shrink-0 sm:mt-0" aria-hidden />
                    <span className="min-w-0">
                      {item.location}
                      <span className="hidden sm:inline"> · {formatDate(item.date)}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!list.length && <p className="rounded-xl bg-white p-10 text-center text-ink-600 ring-1 ring-ink-200">No photos match these filters.</p>}
      </Section>
      {open !== null && list[open] && <Lightbox items={list} index={open} onClose={close} onMove={move} />}
    </>
  );
}
