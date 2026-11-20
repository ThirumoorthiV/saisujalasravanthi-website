import { useEffect, useState } from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  HeartHandshake,
  Images,
  Lightbulb,
  MapPin,
  Plus,
  Share2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStaff } from "./AdminApp";
import { ActivityPanel } from "./Activity";
import { getSiteMeta, importBuiltInContent, isImported, listItems, type SiteMeta } from "./api";
import { COLLECTION_LIST, type CollectionDef, type CollectionName } from "./collections";
import { Button, buttonClass, Card, errorMessage, Notice, PageTitle, Spinner } from "./ui";

/** Same icons as the sidebar. */
const ICONS: Partial<Record<CollectionName, LucideIcon>> = {
  stories: BookOpen,
  events: CalendarDays,
  gallery: Images,
  programmes: HeartHandshake,
  leadership: UserRound,
  centres: MapPin,
  partners: Building2,
  social: Share2,
  reports: FileText,
};

type Counts = Partial<Record<CollectionName, { published: number; drafts: number }>>;

const GROUPS: { key: CollectionDef["group"]; title: string; text: string }[] = [
  { key: "updates", title: "Regular updates", text: "Blog posts and stories, events and gallery photos." },
  { key: "pages", title: "Website pages", text: "Programmes, leadership, centres, partners, social links and reports." },
];

export function Dashboard() {
  const staff = useStaff();
  // Sections this person can edit (Social media is admin-only).
  const sections = COLLECTION_LIST.filter((d) => !d.adminOnly || staff.role === "admin");
  const [meta, setMeta] = useState<SiteMeta | null>();
  const [counts, setCounts] = useState<Counts>();
  const [error, setError] = useState("");
  const [importing, setImporting] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setMeta(await getSiteMeta());
      const entries = await Promise.all(
        sections.map(async (def) => {
          const items = await listItems(def.name);
          const published = items.filter((i) => i.published).length;
          return [def.name, { published, drafts: items.length - published }] as const;
        }),
      );
      setCounts(Object.fromEntries(entries) as Counts);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runImport = async (names: CollectionName[], label: string) => {
    setImporting(label);
    setError("");
    setNotice("");
    try {
      const added = await importBuiltInContent(names);
      setNotice(`Imported ${added} items. From now on the website shows ${label} from the CMS.`);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
    setImporting(null);
  };

  if (!counts && !error) return <Spinner />;
  const notImported = sections.filter((d) => !isImported(meta, d.name));

  return (
    <>
      <PageTitle>Welcome, {staff.name.split(" ")[0]}</PageTitle>
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      {notImported.length > 0 &&
        (staff.role === "admin" ? (
          <Card className="mb-6 border-gold-500 bg-gold-100">
            <h2 className="font-heading text-lg font-bold text-maroon-900">One-time setup: import the website's current content</h2>
            <p className="mt-2 text-[15px]">
              These sections still show the content built into the website: <strong>{notImported.map((d) => d.label).join(", ")}</strong>.
              Importing copies it into the CMS so you can edit it here. Until a section is imported, changes made to it in the CMS don't
              appear on the website.
            </p>
            <Button
              className="mt-4"
              onClick={() => runImport(notImported.map((d) => d.name), notImported.map((d) => d.label).join(", "))}
              disabled={importing !== null}
            >
              {importing ? "Importing…" : notImported.length === 1 ? `Import ${notImported[0].label}` : "Import all of these"}
            </Button>
          </Card>
        ) : (
          <Notice>
            {notImported.map((d) => d.label).join(", ")} can't be edited from the CMS yet. An admin needs to import them from the Dashboard.
          </Notice>
        ))}

      {/* Desktop: the sections on the left, recent activity and tips on the right.
          Tablet/phone: one column. */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {GROUPS.map((group) => (
            <section key={group.key} aria-labelledby={`group-${group.key}`} className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
              <div className="border-b border-ink-200 px-4 py-3.5 sm:px-5">
                <h2 id={`group-${group.key}`} className="font-heading text-lg font-bold text-maroon-900">
                  {group.title}
                </h2>
                <p className="text-sm text-ink-600">{group.text}</p>
              </div>
              <ul className="divide-y divide-ink-200">
                {sections
                  .filter((d) => d.group === group.key)
                  .map((def) => {
                    const c = counts?.[def.name];
                    const Icon = ICONS[def.name] ?? FileText;
                    return (
                      <li key={def.name} className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-cream sm:flex-row sm:items-center sm:gap-4 sm:px-5 md:flex-col md:items-stretch md:gap-3 lg:flex-row lg:items-center lg:gap-4">
                        <Link to={`/${def.name}`} className="group flex min-w-0 items-center gap-3 sm:flex-1 md:flex-none lg:flex-1">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700">
                            <Icon size={19} aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-ink-900 group-hover:text-maroon-700">{def.label}</span>
                            <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink-600">
                              {isImported(meta, def.name) && c ? (
                                <>
                                  <span>{c.published} published</span>
                                  {c.drafts > 0 && (
                                    <span className="rounded bg-gold-100 px-1.5 text-[12px] font-semibold text-ink-900">
                                      {c.drafts} draft{c.drafts === 1 ? "" : "s"}
                                    </span>
                                  )}
                                </>
                              ) : (
                                "Not imported yet"
                              )}
                            </span>
                          </span>
                        </Link>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 md:grid lg:flex">
                          <Link to={`/${def.name}`} className={`${buttonClass("neutral")} whitespace-nowrap px-3 py-1.5`}>
                            View all
                          </Link>
                          <Link to={`/${def.name}/new`} className={`${buttonClass()} whitespace-nowrap px-3 py-1.5 sm:w-44 md:w-auto lg:w-44`}>
                            <Plus size={15} aria-hidden /> Add {def.singular}
                          </Link>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>

        <aside className="min-w-0 space-y-6">
          <ActivityPanel mine={staff.role !== "admin"} />
          <section aria-labelledby="publishing-help" className="rounded-xl border border-gold-500/40 bg-gold-100/60 px-5 py-4">
            <h2 id="publishing-help" className="flex items-center gap-2 font-heading text-base font-bold text-maroon-900">
              <Lightbulb size={17} aria-hidden /> How publishing works
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-900">
              <li>
                <strong>Save draft</strong> keeps your work in the CMS only. <strong>Publish</strong> puts it on the website.
              </li>
              <li>Published changes appear on the website within a few minutes.</li>
              <li>Photos are resized automatically, so you can upload them straight from a phone.</li>
            </ul>
            {meta?.updatedAt && (
              <p className="mt-3 text-[13px] text-ink-600">Last change: {meta.updatedAt.toDate().toLocaleString("en-IN")}</p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
