import type { ReactNode } from "react";
import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-maroon-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-maroon-700">
      {children}
    </span>
  );
}

type Tone = "cream" | "white" | "tint" | "maroon";

const TONES: Record<Tone, string> = {
  cream: "bg-cream",
  white: "bg-white",
  tint: "bg-maroon-50",
  maroon: "bg-maroon-900 text-white",
};

export function Section({
  children,
  tone = "cream",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`${TONES[tone]} py-10 sm:py-14 md:py-20 ${className}`}>
      <div className="mx-auto max-w-content px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
  /** Optional "see all" link, bottom-aligned with the heading on the right. */
  action?: { label: string; to: string };
}) {
  const centered = align === "center" && !action;
  const heading = (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-semibold uppercase tracking-widest ${light ? "text-gold-500" : "text-maroon-400"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading text-2xl font-semibold leading-tight sm:text-[26px] md:text-4xl ${light ? "text-white" : "text-maroon-700"}`}>
        {title}
      </h2>
      <div className={`mt-4 h-0.5 w-16 bg-gold-500 ${centered ? "mx-auto" : ""}`} />
      {intro && <p className={`mt-3 text-base md:mt-4 md:text-lg ${light ? "text-maroon-100" : "text-ink-600"}`}>{intro}</p>}
    </div>
  );
  if (!action) return <div className="mb-8 md:mb-10">{heading}</div>;
  return (
    <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
      {heading}
      <Link
        to={action.to}
        className={`inline-flex shrink-0 items-center gap-1 font-semibold ${light ? "text-gold-100 hover:text-white" : "text-maroon-700 hover:text-maroon-600"}`}
      >
        {action.label} <ArrowRight size={16} aria-hidden />
      </Link>
    </div>
  );
}

export function QuoteBlock({ quote, by }: { quote: string; by: string }) {
  return (
    <figure className="rounded-r-lg border-l-4 border-maroon-700 bg-gold-100 p-5 md:p-6">
      <Quote className="mb-2 text-maroon-400" size={24} aria-hidden />
      <blockquote className="font-heading text-lg italic text-ink-900 md:text-xl">“{quote}”</blockquote>
      <figcaption className="mt-3 text-sm font-semibold text-maroon-700">— {by}</figcaption>
    </figure>
  );
}

/** Lazy-loaded photo that fills its box (object-cover). */
export function Photo({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`block bg-maroon-100 object-cover ${className}`}
    />
  );
}

/** Image placeholder used where no photograph exists yet. */
export function ImagePlaceholder({
  label,
  icon,
  className = "",
}: {
  label: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-700 via-maroon-600 to-maroon-900 text-gold-500 ${className}`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative">{icon}</div>
    </div>
  );
}

export function PendingBadge({ children = "Pending confirmation" }: { children?: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-maroon-900">{children}</span>
  );
}
