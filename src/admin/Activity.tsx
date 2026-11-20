// Who changed what in the CMS, and when (the `activity` collection): the admin-only
// Recent activity page, and the Dashboard panel (everyone's changes for admins, your own for editors).
import type { QueryDocumentSnapshot } from "firebase/firestore";
import {
  ArrowRight,
  Download,
  EyeOff,
  FilePlus2,
  FileText,
  History,
  Pencil,
  Search,
  Send,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "@/components/ui/Dropdown";
import { useStaff } from "./AdminApp";
import { listActivity, listMyActivity, listStaff, type ActivityAction, type ActivityEntry } from "./api";
import { COLLECTIONS, COLLECTION_LIST, type CollectionName } from "./collections";
import { Avatar, Button, Card, errorMessage, inputClass, Notice, PageTitle, Spinner, timeAgo } from "./ui";

const PAGE_SIZE = 100;
const PANEL_SIZE = 6;

const ACTIONS: Record<ActivityAction, { label: string; badge: string }> = {
  created: { label: "Published new", badge: "bg-green-100 text-success" },
  published: { label: "Published", badge: "bg-green-100 text-success" },
  updated: { label: "Updated", badge: "bg-maroon-50 text-maroon-700" },
  draft: { label: "Saved draft", badge: "bg-ink-200 text-ink-600" },
  unpublished: { label: "Unpublished", badge: "bg-gold-100 text-ink-900" },
  deleted: { label: "Deleted", badge: "bg-red-100 text-error" },
  imported: { label: "Imported", badge: "bg-gold-100 text-ink-900" },
  staff_added: { label: "Added staff", badge: "bg-maroon-50 text-maroon-700" },
  staff_role: { label: "Changed role", badge: "bg-maroon-50 text-maroon-700" },
  staff_removed: { label: "Removed access", badge: "bg-red-100 text-error" },
};

const sectionLabel = (s: ActivityEntry["section"]) => (s === "staff" ? "Staff access" : (COLLECTIONS[s as CollectionName]?.label ?? s));

/** Where the row links to: the item's editor (unless it was deleted), or the staff page. */
const linkFor = (e: ActivityEntry) =>
  e.section === "staff" ? "/staff" : e.action === "deleted" || e.action === "imported" ? `/${e.section}` : `/${e.section}/edit/${e.itemId}`;

const fullDate = (d?: Date) =>
  d?.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) ?? "";

function dayLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/** Profile photos, so each row shows the person's avatar (admins only can list staff). */
function useStaffPhotos(enabled = true) {
  const [photos, setPhotos] = useState<Record<string, string | undefined>>({});
  useEffect(() => {
    if (!enabled) return;
    listStaff()
      .then((list) => setPhotos(Object.fromEntries(list.map((s) => [s.uid, s.photo]))))
      .catch(() => {});
  }, [enabled]);
  return photos;
}

function ActionBadge({ action }: { action: ActivityAction }) {
  const a = ACTIONS[action] ?? { label: action, badge: "bg-ink-200 text-ink-600" };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}>{a.label}</span>;
}

function ActivityRow({ entry, photo, onView }: { entry: ActivityEntry; photo?: string; onView: () => void }) {
  const when = entry.at?.toDate();
  const changes = entry.changes ?? [];
  return (
    <li className="flex gap-3 px-4 py-3.5">
      <Avatar name={entry.name} photo={photo} className="mt-0.5 h-9 w-9 text-sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <strong className="text-[15px] text-ink-900">{entry.name}</strong>
          <ActionBadge action={entry.action} />
          <span className="text-sm text-ink-600">{sectionLabel(entry.section)}</span>
        </div>
        <Link to={linkFor(entry)} className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-maroon-700 hover:underline">
          {entry.title}
        </Link>
        {changes.length > 0 && (
          <p className="mt-1 text-sm text-ink-600">
            <span>Changed: {changes.map((c) => c.field).join(", ")} · </span>
            <button type="button" onClick={onView} className="font-semibold text-maroon-700 hover:underline">
              View {changes.length === 1 ? "change" : `${changes.length} changes`}
            </button>
          </p>
        )}
      </div>
      <time dateTime={when?.toISOString()} title={fullDate(when)} className="shrink-0 whitespace-nowrap pt-0.5 text-[13px] text-ink-600">
        {when ? when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "just now"}
      </time>
    </li>
  );
}

/** Pop-up with each changed field: old value in red, new value in green. */
function ChangesDialog({ entry, onClose }: { entry: ActivityEntry | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (entry && !dialog.current?.open) dialog.current?.showModal();
    if (!entry && dialog.current?.open) dialog.current.close();
  }, [entry]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      aria-labelledby="changes-title"
      className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl p-0 shadow-2xl backdrop:bg-ink-900/50"
    >
      {entry && (
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-4 bg-maroon-700 px-6 py-4 text-white">
            <div className="min-w-0">
              <p className="text-sm text-white/80">
                {sectionLabel(entry.section)} · {ACTIONS[entry.action]?.label ?? entry.action}
              </p>
              <h2 id="changes-title" className="mt-0.5 break-words font-heading text-xl font-bold">
                {entry.title}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                by {entry.name} · {fullDate(entry.at?.toDate())}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-maroon-600"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto px-6 py-5">
            {(entry.changes ?? []).map((c, i) => (
              <div key={i}>
                <p className="mb-1.5 text-sm font-semibold text-ink-900">{c.field}</p>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-error">Before</p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink-900">{c.before || <em className="text-ink-600">(empty)</em>}</p>
                  </div>
                  <ArrowRight size={18} className="hidden self-center text-ink-600 sm:block" aria-hidden />
                  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-success">After</p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink-900">{c.after || <em className="text-ink-600">(empty)</em>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-ink-200 bg-cream px-4 py-3 sm:flex sm:justify-end sm:px-6">
            <Link to={linkFor(entry)} className="inline-flex items-center justify-center rounded-md border border-maroon-700 px-4 py-2 text-sm font-semibold text-maroon-700 hover:bg-maroon-50 sm:border-transparent">
              Open {entry.section === "staff" ? "Staff access" : "item"}
            </Link>
            <Button onClick={() => dialog.current?.close()}>Close</Button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function ActivityPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>();
  const [cursor, setCursor] = useState<QueryDocumentSnapshot>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [person, setPerson] = useState("");
  const [section, setSection] = useState("");
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<ActivityEntry | null>(null);
  const photos = useStaffPhotos();

  const load = async (more = false) => {
    setLoadingMore(more);
    try {
      const page = await listActivity(PAGE_SIZE, more ? cursor : undefined);
      setEntries((list) => (more ? [...(list ?? []), ...page.entries] : page.entries));
      setCursor(page.cursor);
    } catch (err) {
      setError(
        (err as { code?: string }).code === "permission-denied"
          ? "The activity log can't be read yet. Publish the latest firestore.rules (Firebase console → Firestore Database → Rules → Publish), then refresh this page."
          : errorMessage(err),
      );
      setEntries((list) => list ?? []);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    load();
  }, []);

  const people = useMemo(() => {
    const map = new Map((entries ?? []).map((e) => [e.uid, e.name]));
    return [...map].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ value, label }));
  }, [entries]);

  const q = search.trim().toLowerCase();
  const shown = (entries ?? []).filter(
    (e) =>
      (!person || e.uid === person) &&
      (!section || e.section === section) &&
      (!action || e.action === action || (action === "published" && e.action === "created")) &&
      (!q || `${e.title} ${e.name} ${(e.changes ?? []).map((c) => `${c.field} ${c.before} ${c.after}`).join(" ")}`.toLowerCase().includes(q)),
  );

  // Group by day, newest first.
  const days: { label: string; items: ActivityEntry[] }[] = [];
  for (const e of shown) {
    const label = dayLabel(e.at?.toDate() ?? new Date());
    if (days[days.length - 1]?.label !== label) days.push({ label, items: [] });
    days[days.length - 1].items.push(e);
  }

  const filtered = Boolean(person || section || action || q);

  return (
    <>
      <PageTitle>Recent activity</PageTitle>
      <p className="-mt-3 mb-5 max-w-3xl text-[15px] text-ink-600">
        Every change made in the CMS: who made it, when, and what changed. Only admins can see this page, and entries can't be edited or
        deleted.
      </p>
      {error && <Notice tone="error">{error}</Notice>}

      <div className="mb-5 grid grid-cols-2 items-center gap-3 lg:flex">
        <div className="relative col-span-2 lg:w-72">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600" aria-hidden />
          <input
            type="search"
            placeholder="Search titles and changes…"
            aria-label="Search activity"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} min-h-[44px] rounded-lg pl-9`}
          />
        </div>
        <Dropdown ariaLabel="Person" value={person} onChange={setPerson} options={[{ value: "", label: "Everyone" }, ...people]} className="min-w-0 lg:w-48" />
        <Dropdown
          ariaLabel="Section"
          value={section}
          onChange={setSection}
          options={[
            { value: "", label: "All sections" },
            ...COLLECTION_LIST.map((d) => ({ value: d.name, label: d.label })),
            { value: "staff", label: "Staff access" },
          ]}
          className="min-w-0 lg:w-48"
        />
        <Dropdown
          ariaLabel="Action"
          value={action}
          onChange={setAction}
          options={[
            { value: "", label: "All actions" },
            { value: "published", label: "Published" },
            { value: "updated", label: "Updated" },
            { value: "draft", label: "Saved draft" },
            { value: "unpublished", label: "Unpublished" },
            { value: "deleted", label: "Deleted" },
            { value: "staff_added", label: "Added staff" },
            { value: "staff_role", label: "Changed role" },
            { value: "staff_removed", label: "Removed access" },
          ]}
          className="col-span-2 min-w-0 sm:col-span-1 lg:w-48"
        />
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setPerson("");
              setSection("");
              setAction("");
              setSearch("");
            }}
            className="text-sm font-semibold text-maroon-700 hover:underline lg:ml-auto lg:whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {!entries ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <Card className="py-10 text-center">
          <History size={32} className="mx-auto text-ink-600/60" aria-hidden />
          <p className="mt-3 text-ink-600">
            {entries.length ? "Nothing matches these filters." : "No activity yet. Changes made in the CMS from now on will appear here."}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {days.map((day) => (
            <section key={day.label}>
              <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-maroon-900">{day.label}</h2>
              <ul className="divide-y divide-ink-200 overflow-hidden rounded-lg border border-ink-200 bg-white">
                {day.items.map((e) => (
                  <ActivityRow key={e.id} entry={e} photo={photos[e.uid]} onView={() => setViewing(e)} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {entries && cursor && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={() => load(true)} disabled={loadingMore} className="w-full sm:w-auto">
            {loadingMore ? "Loading…" : "Load older activity"}
          </Button>
          {filtered && <p className="mt-2 text-[13px] text-ink-600">Filters apply to the activity loaded so far.</p>}
        </div>
      )}

      <ChangesDialog entry={viewing} onClose={() => setViewing(null)} />
    </>
  );
}


/**
 * The Dashboard's side panel: admins see the latest changes by everyone ("Recent activity");
 * editors see only their own ("My recent changes"), so they can jump back to their work.
 */
export function ActivityPanel({ mine }: { mine: boolean }) {
  const staff = useStaff();
  const [groups, setGroups] = useState<PanelGroup[]>();
  const [failed, setFailed] = useState(false);
  const [viewing, setViewing] = useState<ActivityEntry | null>(null);
  const photos = useStaffPhotos(!mine);

  useEffect(() => {
    // Fetch a few more than we show: repeated saves of the same item collapse into one line.
    (mine ? listMyActivity(staff.uid, PANEL_FETCH) : listActivity(PANEL_FETCH).then((page) => page.entries))
      .then((list) => setGroups(groupEntries(list).slice(0, PANEL_SIZE)))
      .catch(() => {
        setFailed(true);
        setGroups([]);
      });
  }, [mine, staff.uid]);

  // Split into "Today", "Yesterday", …
  const days: { label: string; items: PanelGroup[] }[] = [];
  for (const g of groups ?? []) {
    const label = dayLabel(g.entry.at?.toDate() ?? new Date());
    if (days[days.length - 1]?.label === label) days[days.length - 1].items.push(g);
    else days.push({ label, items: [g] });
  }

  return (
    <section aria-labelledby="activity-panel-title" className="rounded-xl border border-ink-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-ink-200 px-5 py-3.5">
        <div>
          <h2 id="activity-panel-title" className="font-heading text-lg font-bold text-maroon-900">
            {mine ? "My recent changes" : "Recent activity"}
          </h2>
          <p className="text-sm text-ink-600">{mine ? "Your latest changes." : "Latest changes in the CMS."}</p>
        </div>
        {!mine && (
          <Link to="/activity" className="-mr-2 inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-sm font-semibold text-maroon-700 hover:bg-maroon-50">
            View all <ArrowRight size={14} aria-hidden />
          </Link>
        )}
      </div>
      <div className="px-5 pb-5">
        {!groups ? (
          <div className="mt-4 space-y-4" aria-label="Loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse gap-3">
                <span className="h-8 w-8 shrink-0 rounded-full bg-ink-200/70" />
                <span className="flex-1 space-y-2 pt-1">
                  <span className="block h-3 w-1/2 rounded bg-ink-200/70" />
                  <span className="block h-3 w-4/5 rounded bg-ink-200/70" />
                </span>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <p className="mt-3 rounded-lg bg-cream px-4 py-5 text-center text-sm text-ink-600">
            {failed
              ? "Couldn't load recent changes. If this continues, ask an admin to publish the latest Firestore rules."
              : mine
                ? "Nothing yet. Changes you make in the CMS will show here, so you can jump back to them."
                : "No activity yet. Changes made in the CMS will show here."}
          </p>
        ) : (
          days.map((day) => (
            <div key={day.label} className="mt-4">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-600">{day.label}</h3>
              <ol>
                {day.items.map((g, i) => (
                  <PanelItem
                    key={g.entry.id}
                    group={g}
                    photo={photos[g.entry.uid]}
                    mine={mine}
                    last={i === day.items.length - 1}
                    onView={() => setViewing(g.entry)}
                  />
                ))}
              </ol>
            </div>
          ))
        )}
      </div>
      <ChangesDialog entry={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}

const PANEL_FETCH = 30;

/** How each action reads in the panel ("Thiru updated …"), with an icon and colour. */
const PANEL_ACTIONS: Record<ActivityAction, { verb: string; icon: LucideIcon; tone: string }> = {
  created: { verb: "published new", icon: FilePlus2, tone: "bg-green-100 text-success" },
  published: { verb: "published", icon: Send, tone: "bg-green-100 text-success" },
  updated: { verb: "updated", icon: Pencil, tone: "bg-maroon-50 text-maroon-700" },
  draft: { verb: "saved a draft of", icon: FileText, tone: "bg-ink-200 text-ink-600" },
  unpublished: { verb: "unpublished", icon: EyeOff, tone: "bg-gold-100 text-ink-900" },
  deleted: { verb: "deleted", icon: Trash2, tone: "bg-red-100 text-error" },
  imported: { verb: "imported", icon: Download, tone: "bg-gold-100 text-ink-900" },
  staff_added: { verb: "gave CMS access to", icon: UserPlus, tone: "bg-maroon-50 text-maroon-700" },
  staff_role: { verb: "changed the role of", icon: UserCog, tone: "bg-maroon-50 text-maroon-700" },
  staff_removed: { verb: "removed access for", icon: UserMinus, tone: "bg-red-100 text-error" },
};

interface PanelGroup {
  entry: ActivityEntry;
  /** How many saves this line stands for (the same person editing the same item in a row). */
  count: number;
}

/**
 * Collapse back-to-back saves of the same item by the same person on the same day into one line
 * ("updated · 4 edits"), combining their changes: each field's first "before" and last "after".
 */
function groupEntries(list: ActivityEntry[]): PanelGroup[] {
  const out: PanelGroup[] = [];
  const day = (e: ActivityEntry) => (e.at?.toDate() ?? new Date()).toDateString();
  for (const e of list) {
    const prev = out[out.length - 1];
    const same =
      prev &&
      (e.action === "updated" || e.action === "draft") &&
      prev.entry.action === e.action &&
      prev.entry.uid === e.uid &&
      prev.entry.section === e.section &&
      prev.entry.itemId === e.itemId &&
      day(prev.entry) === day(e);
    if (!same) {
      out.push({ entry: e, count: 1 });
      continue;
    }
    // `e` is the older save: its "before" values are the starting point.
    const changes = [...(prev.entry.changes ?? [])];
    for (const c of e.changes ?? []) {
      const i = changes.findIndex((x) => x.field === c.field);
      if (i >= 0) changes[i] = { ...changes[i], before: c.before };
      else changes.push(c);
    }
    prev.entry = { ...prev.entry, changes: changes.filter((c) => c.before !== c.after) };
    prev.count++;
  }
  return out;
}

function PanelItem({ group, photo, mine, last, onView }: { group: PanelGroup; photo?: string; mine: boolean; last: boolean; onView: () => void }) {
  const { entry, count } = group;
  const when = entry.at?.toDate();
  const a = PANEL_ACTIONS[entry.action] ?? { verb: entry.action, icon: Pencil, tone: "bg-ink-200 text-ink-600" };
  const Icon = a.icon;
  const changes = entry.changes ?? [];
  return (
    <li className={`relative flex gap-3 ${last ? "" : "pb-4"}`}>
      {/* The timeline line joining one change to the next. */}
      {!last && <span className="absolute bottom-0 left-4 top-10 w-px -translate-x-1/2 bg-ink-200" aria-hidden />}
      <div className="relative h-8 w-8 shrink-0">
        {mine ? (
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${a.tone}`}>
            <Icon size={15} aria-hidden />
          </span>
        ) : (
          <>
            <Avatar name={entry.name} photo={photo} className="h-8 w-8 text-xs" />
            <span className={`absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-2 ring-white ${a.tone}`}>
              <Icon size={10} strokeWidth={2.5} aria-hidden />
            </span>
          </>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-5 text-ink-600">
          <strong className="font-semibold text-ink-900">{mine ? "You" : entry.name}</strong> {a.verb}
          {count > 1 && <span className="ml-1.5 whitespace-nowrap rounded bg-ink-200/60 px-1.5 py-px text-[11px] font-semibold text-ink-600">{count} edits</span>}
        </p>
        <Link to={linkFor(entry)} title={entry.title} className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink-900 hover:text-maroon-700 hover:underline">
          {entry.title}
        </Link>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-600">
          <span className="rounded bg-ink-200/50 px-1.5 py-px font-medium text-ink-900">{sectionLabel(entry.section)}</span>
          <time dateTime={when?.toISOString()} title={fullDate(when)}>
            {when ? timeAgo(when) : "just now"}
          </time>
          {changes.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <button type="button" onClick={onView} className="font-semibold text-maroon-700 hover:underline">
                What changed?
              </button>
            </>
          )}
        </p>
      </div>
    </li>
  );
}
