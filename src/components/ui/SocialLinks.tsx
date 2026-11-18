import { AtSign, Facebook, Instagram, Link2, Linkedin, MessageCircle, Pin, Send, Youtube, type LucideIcon } from "lucide-react";
import { SITE } from "@/data/site";
import { SOCIAL, socialName } from "@/data/social";
import { withUtm } from "@/lib/format";
import type { SocialPlatform } from "@/types";

/** The X logo (not in the icon library). */
function XLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size - 2} height={size - 2} fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const ICONS: Record<SocialPlatform, LucideIcon | typeof XLogo> = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  LinkedIn: Linkedin,
  "X (Twitter)": XLogo,
  WhatsApp: MessageCircle,
  Telegram: Send,
  Threads: AtSign,
  Pinterest: Pin,
  Other: Link2,
};

/** Round icon buttons for the Trust's social profiles (managed in the CMS → Social media). */
export function SocialLinks({ source, tone = "light" }: { source: string; tone?: "light" | "dark" }) {
  const cls =
    tone === "dark"
      ? "bg-white/10 text-white hover:bg-gold-500 hover:text-maroon-900"
      : "bg-maroon-100 text-maroon-700 hover:bg-maroon-700 hover:text-white";
  if (!SOCIAL.length) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {SOCIAL.map((s) => {
        const Icon = ICONS[s.platform] ?? Link2;
        const name = socialName(s);
        return (
          <li key={`${s.platform}-${s.href}`}>
            <a
              href={withUtm(s.href, source)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} on ${name}`}
              title={name}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${cls}`}
            >
              <Icon size={20} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
