// What staff can edit in the CMS: one definition per Firestore collection.
// Field keys match the types in src/types, so published items drop straight
// into the website (see scripts/fetch-content.mjs). Nested keys use dots.
import { EVENT_CATEGORIES, SEED_EVENTS } from "@/data/events";
import { SEED_CENTRES, SEED_GALLERY, SEED_LEADERSHIP, SEED_PARTNERS } from "@/data/organisation";
import { getCategory, PROGRAMME_CATEGORIES, SEED_PROGRAMMES } from "@/data/programmes";
import { SEED_STORIES, STORY_CATEGORIES } from "@/data/stories";
import { PLATFORM_DOMAINS, SEED_SOCIAL, SOCIAL_PLATFORMS } from "@/data/social";
import type { Centre, GalleryItem, IconName, Leader, SocialPlatform } from "@/types";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select"
  | "image"
  | "paragraphs" // string[], one paragraph per blank-line-separated block
  | "lines" // string[], one per line
  | "tags" // string[], comma separated
  | "pairs" // { label, value }[], one "Label: value" per line
  | "checkbox"
  | "ref"; // slug of an item in another collection

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: readonly string[] | { value: string; label: string }[];
  /** For type "ref": the collection to pick from. */
  ref?: CollectionName;
  /** For type "pairs": numbers only (default) or any text, e.g. "₹65 lakh". */
  valueKind?: "number" | "text";
  /** Fields with the same section are grouped under that heading. */
  section?: string;
}

export type CollectionName = "stories" | "events" | "gallery" | "programmes" | "leadership" | "centres" | "partners" | "social";

export interface CollectionDef {
  name: CollectionName;
  label: string;
  singular: string;
  /** Only admins can see and change it (also enforced in firestore.rules). */
  adminOnly?: boolean;
  /** Sidebar group: regular updates, or the fixed website pages. */
  group: "updates" | "pages";
  /** Short explanation shown on the list page. */
  intro: string;
  /** Document ID comes from this field (the page URL); otherwise an automatic ID. */
  idField?: "slug";
  titleField: string;
  imageField?: string;
  /** List order. Dates newest first; "order" fields smallest first. */
  sortField: string;
  sortDir: "asc" | "desc";
  /** Second line in the list, e.g. date or category. */
  subtitle: (item: Record<string, unknown>) => string;
  /** Field the list can be filtered by. */
  filter?: { field: string; label: string; options: { value: string; label: string }[] };
  fields: Field[];
  /** Website URL of a published item, for the "View on website" link. */
  url: (item: Record<string, unknown>) => string;
  /** Final clean-up before saving (defaults, removing empty optional parts). */
  finalise?: (item: Record<string, unknown>) => Record<string, unknown>;
  /** Extra checks before publishing: field key → problem. */
  validate?: (item: Record<string, unknown>) => Record<string, string>;
  /** The content built into the website, for the one-time import: [document ID, data]. */
  seed: () => [string, Record<string, unknown>][];
}

const opts = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));
const programmeOptions = PROGRAMME_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));
const GALLERY_GROUPS: GalleryItem["group"][] = ["Healthcare", "Education", "Rural Development", "CSR", "Events"];
const LEADER_ROLES: Leader["role"][] = ["Founder & Guiding Light", "Board of Trustees", "Advisory Council"];
const CENTRE_TYPES: Centre["type"][] = ["Sai Swasthya Centre", "Hospital", "Screening Centre", "Office"];
const CENTRE_STATES: Centre["state"][] = ["Telangana", "Andhra Pradesh", "Other"];
const ICONS: IconName[] = [
  "HeartPulse",
  "Stethoscope",
  "Hospital",
  "Tent",
  "Baby",
  "Pill",
  "Droplets",
  "GraduationCap",
  "Users",
  "LifeBuoy",
  "Sprout",
  "Handshake",
  "ShieldPlus",
  "Scissors",
];

export const formatDate = (iso: unknown) =>
  typeof iso === "string" && iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "No date";

const orderField: Field = {
  key: "order",
  label: "Position",
  type: "number",
  required: true,
  help: "Order on the page: 1 is shown first. To place something between 2 and 3, use 2.5.",
};
const withOrder = <T extends object>(items: T[], id: (item: T, i: number) => string) =>
  items.map((item, i) => [id(item, i), { ...item, order: i + 1 }] as [string, Record<string, unknown>]);

export const COLLECTIONS: Record<CollectionName, CollectionDef> = {
  stories: {
    name: "stories",
    label: "Blog & Stories",
    singular: "post",
    group: "updates",
    intro:
      "Posts for Stories & Updates. Every post appears on the Blog; the category also places it on Beneficiary Stories, Volunteer Stories or Media & Press.",
    idField: "slug",
    titleField: "title",
    imageField: "cover",
    sortField: "publishDate",
    sortDir: "desc",
    subtitle: (s) => `${formatDate(s.publishDate)} · ${s.category ?? "No category"}`,
    filter: { field: "category", label: "Category", options: opts(STORY_CATEGORIES) },
    url: (s) => `/stories/${s.slug}/`,
    seed: () => SEED_STORIES.map((s) => [s.slug, { ...s }]),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Web address", type: "text", required: true, help: "Part of the page URL: /stories/<this>/. Can't be changed later." },
      { key: "publishDate", label: "Publish date", type: "date", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: STORY_CATEGORIES,
        required: true,
        help: "Every post appears on the Blog. Beneficiary Stories, Volunteer Stories and Media & Press posts also appear on their own pages in the menu.",
      },
      { key: "programme", label: "Programme", type: "select", options: programmeOptions, required: true },
      { key: "author", label: "Author", type: "text", required: true, help: "e.g. Communications Team" },
      { key: "cover", label: "Cover photo", type: "image", required: true },
      { key: "coverAlt", label: "Cover photo description", type: "text", required: true, help: "Describe the photo for blind visitors and Google, e.g. “Doctor examining a child at a village camp”." },
      { key: "excerpt", label: "Short summary", type: "textarea", required: true, help: "One or two sentences, shown on story cards." },
      { key: "body", label: "Story", type: "paragraphs", required: true, help: "Leave an empty line between paragraphs." },
      { key: "tags", label: "Tags", type: "tags", help: "Separate with commas." },
      { key: "relatedEvent", label: "Related event", type: "ref", ref: "events" },
      { key: "metaTitle", label: "Google title", type: "text", section: "Search engines (optional)", help: "Defaults to the title. Best under 60 characters." },
      { key: "metaDescription", label: "Google description", type: "textarea", section: "Search engines (optional)", help: "Defaults to the short summary. Best under 160 characters." },
      { key: "change.challenge", label: "Challenge", type: "textarea", section: "Beneficiary story (optional)" },
      { key: "change.journey", label: "Journey", type: "textarea", section: "Beneficiary story (optional)" },
      { key: "change.intervention", label: "How we helped", type: "textarea", section: "Beneficiary story (optional)" },
      { key: "change.outcome", label: "Outcome", type: "textarea", section: "Beneficiary story (optional)" },
      { key: "change.quote", label: "Quote", type: "textarea", section: "Beneficiary story (optional)" },
      { key: "change.quoteBy", label: "Quote by", type: "text", section: "Beneficiary story (optional)" },
      { key: "change.consentRecorded", label: "Written consent from the beneficiary is recorded", type: "checkbox", section: "Beneficiary story (optional)" },
    ],
    finalise: (s) => {
      const change = s.change as Record<string, unknown> | undefined;
      const hasChange = change && Object.entries(change).some(([k, v]) => k !== "consentRecorded" && v);
      return {
        ...s,
        tags: s.tags ?? [],
        metaTitle: s.metaTitle || s.title,
        metaDescription: s.metaDescription || s.excerpt,
        change: hasChange ? { consentRecorded: false, ...change } : undefined,
      };
    },
  },

  events: {
    name: "events",
    label: "Events",
    singular: "event",
    group: "updates",
    intro: "Upcoming and past events. Upcoming events also appear on the homepage.",
    idField: "slug",
    titleField: "title",
    imageField: "image",
    sortField: "startDate",
    sortDir: "desc",
    subtitle: (e) => `${formatDate(e.startDate)} · ${e.category ?? "No category"} · ${e.status ?? ""}`,
    filter: { field: "category", label: "Category", options: opts(EVENT_CATEGORIES) },
    url: (e) => `/events/${e.slug}/`,
    seed: () => SEED_EVENTS.map((e) => [e.slug, { ...e }]),
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Web address", type: "text", required: true, help: "Part of the page URL: /events/<this>/. Can't be changed later." },
      { key: "status", label: "Status", type: "select", options: ["Upcoming", "Completed"], required: true },
      { key: "startDate", label: "Start date", type: "date", required: true },
      { key: "endDate", label: "End date", type: "date", help: "Only for events longer than one day." },
      { key: "category", label: "Category", type: "select", options: EVENT_CATEGORIES, required: true },
      { key: "programme", label: "Programme", type: "select", options: programmeOptions, required: true },
      { key: "image", label: "Photo", type: "image", required: true },
      { key: "location.village", label: "Village / town", type: "text", required: true, section: "Location" },
      { key: "location.district", label: "District", type: "text", required: true, section: "Location" },
      { key: "location.state", label: "State", type: "text", required: true, section: "Location" },
      { key: "objective", label: "Objective", type: "textarea", required: true, section: "Details" },
      { key: "whoBenefited", label: "Who benefited", type: "textarea", required: true, section: "Details" },
      { key: "keyActivities", label: "Key activities", type: "lines", required: true, section: "Details", help: "One per line." },
      { key: "impact", label: "Impact figures", type: "pairs", section: "Details", help: "One per line, e.g.  Patients treated: 250" },
      { key: "partners", label: "Partners", type: "lines", section: "Details", help: "One per line." },
      { key: "videoUrl", label: "Video link", type: "text", section: "Details", help: "YouTube link (optional)." },
      { key: "relatedStory", label: "Related story", type: "ref", ref: "stories", section: "Details" },
    ],
    finalise: (e) => ({ ...e, impact: e.impact ?? [] }),
  },

  gallery: {
    name: "gallery",
    label: "Gallery",
    singular: "photo",
    group: "updates",
    intro: "Photos for the Gallery. The gallery section decides which Gallery sub-menu page shows the photo.",
    titleField: "caption",
    imageField: "src",
    sortField: "date",
    sortDir: "desc",
    subtitle: (g) => `${formatDate(g.date)} · ${g.group ?? "No section"}`,
    filter: { field: "group", label: "Gallery section", options: opts(GALLERY_GROUPS) },
    url: () => "/gallery/",
    seed: () => SEED_GALLERY.map(({ id, ...g }) => [id, { ...g }]),
    fields: [
      { key: "src", label: "Photo", type: "image", required: true },
      { key: "caption", label: "Caption", type: "text", required: true },
      { key: "alt", label: "Photo description", type: "text", required: true, help: "Describe what is in the photo for blind visitors and Google." },
      { key: "date", label: "Date taken", type: "date", required: true },
      { key: "group", label: "Gallery section", type: "select", options: GALLERY_GROUPS, required: true },
      { key: "subCategory", label: "Sub-category", type: "text", required: true, help: "e.g. Medical Camps, Sanitation, Cardiac Screening" },
      { key: "programme", label: "Programme", type: "select", options: programmeOptions, required: true },
      { key: "location", label: "Location", type: "text", required: true },
    ],
  },

  programmes: {
    name: "programmes",
    label: "Programmes",
    singular: "programme",
    group: "pages",
    intro: "The pages under Our Programmes. Active healthcare programmes are also listed in the website's Our Programmes → Healthcare menu.",
    idField: "slug",
    titleField: "name",
    imageField: "image",
    sortField: "order",
    sortDir: "asc",
    subtitle: (p) => `${getCategory(String(p.category))?.name ?? "No category"}${p.active ? "" : " · Not active (shown under Our Journey)"}`,
    filter: { field: "category", label: "Category", options: programmeOptions },
    url: (p) => (p.active ? `/programmes/${p.category}/${p.slug}/` : "/about-us/our-journey/"),
    seed: () => withOrder(SEED_PROGRAMMES, (p) => p.slug),
    fields: [
      { key: "name", label: "Programme name", type: "text", required: true },
      { key: "shortName", label: "Short name for the menu", type: "text", help: "Optional, e.g. “Sai Swasthya”. Defaults to the programme name." },
      { key: "slug", label: "Web address", type: "text", required: true, help: "Part of the page URL: /programmes/<category>/<this>/. Can't be changed later." },
      { key: "category", label: "Category", type: "select", options: programmeOptions, required: true },
      { key: "active", label: "Current programme (untick for past initiatives, which move to Our Journey)", type: "checkbox" },
      orderField,
      { key: "icon", label: "Icon", type: "select", options: ICONS, required: true },
      { key: "image", label: "Main photo", type: "image", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true, help: "One or two sentences, shown on programme cards." },
      { key: "problem", label: "The challenge", type: "textarea", section: "Page content", help: "Required for current programmes." },
      { key: "solution", label: "Our approach", type: "textarea", section: "Page content", help: "Required for current programmes." },
      { key: "services", label: "Services", type: "lines", section: "Page content", help: "One per line. Required for current programmes." },
      { key: "whoWeServe", label: "Who we serve", type: "lines", section: "Page content", help: "One per line. Required for current programmes." },
      { key: "locations", label: "Locations", type: "lines", required: true, section: "Page content", help: "One per line." },
      {
        key: "impact",
        label: "Impact figures",
        type: "pairs",
        valueKind: "text",
        section: "Page content",
        help: "One per line, e.g.  Children screened: 6,000+",
      },
    ],
    // Past initiatives (not active) only appear as a short entry under Our Journey, so their page text may be empty.
    finalise: (p) => ({
      ...p,
      problem: p.problem ?? "",
      solution: p.solution ?? "",
      services: p.services ?? [],
      whoWeServe: p.whoWeServe ?? [],
      impact: p.impact ?? [],
      active: Boolean(p.active),
    }),
    validate: (p) =>
      p.active
        ? Object.fromEntries(
            ["problem", "solution", "services", "whoWeServe"]
              .filter((k) => !p[k] || (Array.isArray(p[k]) && (p[k] as unknown[]).length === 0))
              .map((k) => [k, "Required for a current programme"]),
          )
        : {},
  },

  leadership: {
    name: "leadership",
    label: "Leadership",
    singular: "person",
    group: "pages",
    intro: "About Us → Leadership: the founder, Board of Trustees and Advisory Council.",
    titleField: "name",
    imageField: "photo",
    sortField: "order",
    sortDir: "asc",
    subtitle: (l) => `${l.role ?? "No group"} · position ${l.order ?? "-"}`,
    filter: { field: "role", label: "Group", options: opts(LEADER_ROLES) },
    url: () => "/about-us/leadership/",
    seed: () => withOrder(SEED_LEADERSHIP, (l) => `leader-${String(l.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`),
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Group", type: "select", options: LEADER_ROLES, required: true },
      orderField,
      { key: "photo", label: "Photo", type: "image", required: true, help: "A portrait photo works best." },
      { key: "bio", label: "Short biography", type: "textarea", required: true },
    ],
  },

  centres: {
    name: "centres",
    label: "Our Network",
    singular: "centre",
    group: "pages",
    intro: "About Us → Our Network: the centres shown on the map and list. Each centre is counted on the map under its state.",
    titleField: "name",
    sortField: "order",
    sortDir: "asc",
    subtitle: (c) => `${c.type ?? "No type"} · ${c.state ?? "No state"}`,
    filter: { field: "state", label: "State", options: opts(CENTRE_STATES) },
    url: () => "/about-us/our-network/",
    seed: () => withOrder(SEED_CENTRES, (_c, i) => `centre-${String(i + 1).padStart(3, "0")}`),
    fields: [
      { key: "name", label: "Centre name", type: "text", required: true, help: "e.g. Sai Swasthya — Jagtial" },
      { key: "type", label: "Type", type: "select", options: CENTRE_TYPES, required: true },
      { key: "state", label: "State", type: "select", options: CENTRE_STATES, required: true },
      { key: "address", label: "Address", type: "textarea", required: true, help: "Used for the “Get directions” link." },
      orderField,
    ],
  },

  partners: {
    name: "partners",
    label: "Our Partners",
    singular: "partner",
    group: "pages",
    intro:
      "CSR Partnerships → Our Partners: the organisations that support the Trust, shown with their logo. Only add a partner once their written permission to show the logo has been received. Admins and editors can change these.",
    titleField: "name",
    imageField: "logo",
    sortField: "order",
    sortDir: "asc",
    subtitle: (p) => `Position ${p.order ?? "-"}${p.website ? ` · ${String(p.website).replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}` : ""}`,
    url: () => "/csr-partnerships/our-partners/",
    seed: () =>
      SEED_PARTNERS.map((p, i) => [
        `partner-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        { ...p, order: i + 1 },
      ]),
    fields: [
      { key: "name", label: "Partner name", type: "text", required: true, help: "e.g. NATCO Pharma. Also used as the logo's description for blind visitors and Google." },
      {
        key: "logo",
        label: "Logo",
        type: "image",
        required: true,
        help: "A clear logo, ideally on a white or transparent background. It's shown on a white card.",
      },
      { key: "website", label: "Website (optional)", type: "text", help: "e.g. https://www.natcopharma.co.in. If added, the logo links to it." },
      {
        key: "permissionGranted",
        label: "Written permission to show this logo has been received",
        type: "checkbox",
        help: "Required before publishing.",
      },
      { ...orderField, help: "Order on the page: 1 is shown first." },
    ],
    finalise: (p) => {
      const out = { ...p };
      if (!out.website) delete out.website;
      return out;
    },
    validate: (p) => {
      const errors: Record<string, string> = {};
      if (p.website) {
        try {
          if (new URL(String(p.website)).protocol !== "https:") throw new Error();
        } catch {
          errors.website = "Paste the full link starting with https://";
        }
      }
      if (!p.permissionGranted) errors.permissionGranted = "Tick this once the partner's written permission has been received. Until then, save it as a draft.";
      return errors;
    },
  },

  social: {
    name: "social",
    label: "Social media",
    singular: "social link",
    group: "pages",
    intro:
      "The “Follow us” icons in the website footer and on Contact Us (Google also uses them to connect the Trust's profiles). Admins and editors can change these.",
    titleField: "platform",
    sortField: "order",
    sortDir: "asc",
    subtitle: (s) => `${s.platform === "Other" ? `${s.label || "Other"} · ` : ""}${String(s.href ?? "").replace(/^https:\/\/(www\.)?/, "")}`,
    filter: { field: "platform", label: "Platform", options: opts(SOCIAL_PLATFORMS) },
    url: () => "/contact-us/",
    seed: () => SEED_SOCIAL.map((s) => [`social-${s.platform.toLowerCase().replace(/[^a-z]+/g, "-")}`, { ...s }]),
    fields: [
      { key: "platform", label: "Platform", type: "select", options: SOCIAL_PLATFORMS, required: true },
      {
        key: "href",
        label: "Link",
        type: "text",
        required: true,
        help: "The full address of the Trust's page, starting with https://, e.g. https://www.instagram.com/saisujalasravanthi",
      },
      { key: "label", label: "Name (only for “Other”)", type: "text", help: "e.g. Our Blog. Shown when someone points at the icon." },
      { ...orderField, help: "Order of the icons: 1 is shown first." },
    ],
    finalise: (s) => {
      const out = { ...s };
      if (out.platform !== "Other") delete out.label;
      return out;
    },
    validate: (s) => {
      const errors: Record<string, string> = {};
      const href = String(s.href ?? "");
      let host = "";
      try {
        const u = new URL(href);
        if (u.protocol !== "https:") throw new Error();
        host = u.hostname.toLowerCase().replace(/^www\./, "");
      } catch {
        errors.href = "Paste the full link starting with https://";
      }
      const domains = PLATFORM_DOMAINS[s.platform as SocialPlatform];
      if (host && domains && !domains.some((d) => host === d || host.endsWith(`.${d}`))) {
        const article = /^[AEIOU]/.test(String(s.platform)) ? "an" : "a";
        errors.href = `This doesn't look like ${article} ${s.platform} link (expected ${domains[0]}). Check the platform or the link.`;
      }
      if (s.platform === "Other" && !String(s.label ?? "").trim()) errors.label = "Give this link a name, e.g. Our Blog.";
      return errors;
    },
  },
};

export const COLLECTION_LIST = Object.values(COLLECTIONS);

/** Sorts items the way the website shows them. */
export function sortItems<T extends Record<string, unknown>>(def: CollectionDef, items: T[]): T[] {
  const dir = def.sortDir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const x = a[def.sortField];
    const y = b[def.sortField];
    if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
    return String(x ?? "").localeCompare(String(y ?? "")) * dir;
  });
}

// ---------------------------------------------------------------------------
// Converting between saved items and the text in the form fields.

export type FormValues = Record<string, string | boolean>;

const getPath = (obj: Record<string, unknown>, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) o = (o[k] ??= {}) as Record<string, unknown>;
  o[keys[keys.length - 1]] = value;
}

export function toForm(def: CollectionDef, item: Record<string, unknown>): FormValues {
  const values: FormValues = {};
  for (const f of def.fields) {
    const v = getPath(item, f.key);
    if (f.type === "checkbox") values[f.key] = Boolean(v);
    else if (f.type === "paragraphs") values[f.key] = ((v as string[]) ?? []).join("\n\n");
    else if (f.type === "lines") values[f.key] = ((v as string[]) ?? []).join("\n");
    else if (f.type === "tags") values[f.key] = ((v as string[]) ?? []).join(", ");
    else if (f.type === "pairs") values[f.key] = ((v as { label: string; value: unknown }[]) ?? []).map((p) => `${p.label}: ${p.value}`).join("\n");
    else values[f.key] = v === undefined || v === null ? "" : String(v);
  }
  return values;
}

/** Returns the item to save, or the list of problems to fix. */
export function fromForm(
  def: CollectionDef,
  values: FormValues,
  publishing: boolean,
): { item: Record<string, unknown>; errors: Record<string, string> } {
  const item: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of def.fields) {
    const raw = values[f.key];
    if (f.type === "checkbox") {
      setPath(item, f.key, Boolean(raw));
      continue;
    }
    const text = String(raw ?? "").trim();
    let value: unknown = text || undefined;
    if (f.type === "number" && text) {
      value = Number(text);
      if (!Number.isFinite(value)) errors[f.key] = "Enter a number, e.g. 3";
    }
    if (f.type === "paragraphs") value = text ? text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()) : undefined;
    if (f.type === "lines") value = text ? text.split("\n").map((l) => l.trim()).filter(Boolean) : undefined;
    if (f.type === "tags") value = text ? text.split(",").map((t) => t.trim()).filter(Boolean) : undefined;
    if (f.type === "pairs" && text) {
      const pairs: { label: string; value: number | string }[] = [];
      for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
        const m = f.valueKind === "text" ? line.match(/^(.+?)\s*:\s*(.+)$/) : line.match(/^(.+?)\s*[:\-–]\s*([\d,]+)$/);
        if (!m) {
          errors[f.key] = f.valueKind === "text" ? `“${line}” should look like “Label: value”.` : `“${line}” should look like “Label: 250”.`;
          break;
        }
        pairs.push({ label: m[1].trim(), value: f.valueKind === "text" ? m[2].trim() : Number(m[2].replace(/,/g, "")) });
      }
      value = pairs;
    }
    if (f.key === "slug" && text && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(text)) {
      errors[f.key] = "Use lowercase letters, numbers and hyphens only, e.g. dental-camp-march-2026.";
    }
    if (f.key === "videoUrl" && text && !/^https:\/\//.test(text)) errors[f.key] = "Paste the full link starting with https://";
    if (value === undefined && f.required && (publishing || f.key === def.idField)) errors[f.key] = "Required";
    if (value !== undefined) setPath(item, f.key, value);
  }
  if (publishing && def.name === "events" && values.endDate && String(values.endDate) < String(values.startDate)) {
    errors.endDate = "End date is before the start date.";
  }
  const final = def.finalise ? def.finalise(item) : item;
  if (publishing && def.validate) Object.assign(errors, { ...def.validate(final), ...errors });
  return { item: final, errors };
}

export interface FieldChange {
  field: string;
  before: string;
  after: string;
}

const MAX_CHANGE_TEXT = 600;
const clip = (s: string) => (s.length > MAX_CHANGE_TEXT ? `${s.slice(0, MAX_CHANGE_TEXT)}…` : s);

/** Field-by-field differences between two versions of an item, labelled as in the editor. */
export function diffItems(def: CollectionDef, before: Record<string, unknown> | null, after: Record<string, unknown> | null): FieldChange[] {
  const a = before ? toForm(def, before) : {};
  const b = after ? toForm(def, after) : {};
  const changes: FieldChange[] = [];
  for (const f of def.fields) {
    const x = a[f.key] ?? (f.type === "checkbox" ? false : "");
    const y = b[f.key] ?? (f.type === "checkbox" ? false : "");
    if (String(x).trim() === String(y).trim()) continue;
    const show = (v: string | boolean) =>
      f.type === "checkbox" ? (v ? "Yes" : "No") : f.type === "image" ? (v ? "Photo" : "") : clip(String(v).trim());
    changes.push({
      field: f.label,
      before: f.type === "image" && x && y ? "Previous photo" : show(x),
      after: f.type === "image" && x && y ? "New photo" : show(y),
    });
  }
  return changes;
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
