import { Facebook, Linkedin, type LucideIcon } from "lucide-react";
import { SITE } from "@/data/site";
import { withUtm } from "@/lib/format";

const ICONS: Record<string, LucideIcon> = { Facebook, LinkedIn: Linkedin };

/** Round icon buttons for the Trust's social profiles. */
export function SocialLinks({ source, tone = "light" }: { source: string; tone?: "light" | "dark" }) {
  const cls =
    tone === "dark"
      ? "bg-white/10 text-white hover:bg-gold-500 hover:text-maroon-900"
      : "bg-maroon-100 text-maroon-700 hover:bg-maroon-700 hover:text-white";
  return (
    <ul className="flex flex-wrap gap-3">
      {SITE.social.map((s) => {
        const Icon = ICONS[s.label];
        return (
          <li key={s.label}>
            <a
              href={withUtm(s.href, source)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} on ${s.label}`}
              title={s.label}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${cls}`}
            >
              {Icon ? <Icon size={20} aria-hidden /> : s.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
