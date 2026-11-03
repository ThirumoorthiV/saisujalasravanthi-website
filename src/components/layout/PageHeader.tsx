import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-maroon-100 sm:text-sm">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} aria-hidden />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-white">
                {c.name}
              </span>
            ) : (
              <Link to={c.path} className="hover:text-white hover:underline">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  intro,
  crumbs,
  image,
  children,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  /** Optional background photo, overlaid with a maroon gradient for text contrast. */
  image?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-maroon-700 text-white">
      {image ? (
        <>
          <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/95 via-maroon-700/85 to-maroon-700/40" aria-hidden />
        </>
      ) : (
        <>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-maroon-600 opacity-60" aria-hidden />
          <div className="absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-maroon-900 opacity-40" aria-hidden />
        </>
      )}
      <div className="relative mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-3 max-w-3xl font-heading text-[28px] font-bold leading-tight sm:mt-4 sm:text-[32px] md:text-5xl">{title}</h1>
        <div className="mt-3 h-0.5 w-16 bg-gold-500 sm:mt-4" />
        {intro && <p className="mt-3 max-w-2xl text-base text-maroon-100 sm:mt-4 sm:text-lg">{intro}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </header>
  );
}
