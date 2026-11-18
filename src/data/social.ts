// "Follow us" links (footer, Contact page, Google). Managed by admins in the CMS
// (Website pages → Social media); until imported there, the links below are used.
import type { SocialLink, SocialPlatform } from "@/types";
import { CMS } from "./cms";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "Facebook",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "X (Twitter)",
  "WhatsApp",
  "Telegram",
  "Threads",
  "Pinterest",
  "Other",
];

/** Web addresses each platform's links live on (used to catch a link pasted under the wrong platform). */
export const PLATFORM_DOMAINS: Partial<Record<SocialPlatform, string[]>> = {
  Facebook: ["facebook.com", "fb.com", "fb.me"],
  Instagram: ["instagram.com", "instagr.am"],
  YouTube: ["youtube.com", "youtu.be"],
  LinkedIn: ["linkedin.com", "lnkd.in"],
  "X (Twitter)": ["x.com", "twitter.com"],
  WhatsApp: ["whatsapp.com", "wa.me"],
  Telegram: ["t.me", "telegram.me", "telegram.org"],
  Threads: ["threads.net", "threads.com"],
  Pinterest: ["pinterest.com", "pin.it", "pinterest.co.uk", "in.pinterest.com"],
};

export const SEED_SOCIAL: SocialLink[] = [
  { platform: "Facebook", href: "https://www.facebook.com/saisujalasravanthi", order: 1 },
  { platform: "LinkedIn", href: "https://www.linkedin.com/company/saisujalasravanthitrust/", order: 2 },
];

export const SOCIAL: SocialLink[] = [...(CMS.social ?? SEED_SOCIAL)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** The name to show for a link: the platform, or the custom name for "Other". */
export const socialName = (s: SocialLink) => (s.platform === "Other" ? s.label?.trim() || "Website" : s.platform);
