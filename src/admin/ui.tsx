// Small building blocks shared by the CMS screens.
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "neutral";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-maroon-700 text-white hover:bg-maroon-600",
  secondary: "border border-maroon-700 bg-white text-maroon-700 hover:bg-maroon-50",
  danger: "border border-error bg-white text-error hover:bg-red-50",
  neutral: "border border-ink-600/40 bg-white text-ink-900 hover:border-maroon-700 hover:bg-maroon-50 hover:text-maroon-700",
  ghost: "text-maroon-700 hover:bg-maroon-50",
};

export const buttonClass = (variant: Variant = "primary") =>
  `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]}`;

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export function PageTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-heading text-2xl font-bold text-maroon-900 md:text-3xl">{children}</h1>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-ink-200 bg-white p-5 ${className}`}>{children}</div>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const tones = {
    info: "border-gold-500 bg-gold-100 text-ink-900",
    error: "border-error bg-red-50 text-error",
    success: "border-success bg-green-50 text-success",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`mb-4 rounded-md border-l-4 px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-success">Published</span>
  ) : (
    <span className="rounded-full bg-ink-200 px-2.5 py-0.5 text-xs font-semibold text-ink-600">Draft</span>
  );
}

/** A person's profile photo, or the first letter of their name on gold. */
export function Avatar({ name, photo, className = "h-9 w-9 text-base" }: { name: string; photo?: string; className?: string }) {
  return photo ? (
    <img src={photo} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />
  ) : (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-gold-500 font-bold text-maroon-900 ${className}`} aria-hidden>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Loading indicator: a maroon spinning ring with a label, centred.
 * fullScreen: centred in the whole window (while the CMS starts); otherwise in the page area.
 */
export const Spinner = ({ label = "Loading…", fullScreen = false }: { label?: string; fullScreen?: boolean }) => (
  <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? "min-h-screen bg-cream" : "min-h-[50vh]"}`}>
    <span className="relative flex h-12 w-12" aria-hidden>
      <span className="absolute inset-0 rounded-full border-4 border-maroon-100" />
      <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-maroon-700" />
    </span>
    <p className="text-[15px] font-medium text-ink-600">{label}</p>
  </div>
);

export const inputClass =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-[15px] focus:border-maroon-700 focus:outline-none focus:ring-2 focus:ring-maroon-100";

export const errorMessage = (err: unknown) => {
  const e = err as { code?: string; message?: string };
  if (e.code === "permission-denied")
    return "You don't have permission to do this. Ask an admin to check your access. (Admins: if this appears after a CMS update, publish the latest firestore.rules in Firebase console → Firestore Database → Rules.)";
  if (e.code === "unavailable") return "Can't reach the server. Check your internet connection and try again.";
  return e.message || "Something went wrong. Please try again.";
};

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
/** "just now", "5 minutes ago", "yesterday", "3 days ago"; older dates as "12 Nov 2026". */
export function timeAgo(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return RELATIVE.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return RELATIVE.format(Math.round(seconds / 3600), "hour");
  if (abs < 7 * 86_400) return RELATIVE.format(Math.round(seconds / 86_400), "day");
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const formatDate =(iso?: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
