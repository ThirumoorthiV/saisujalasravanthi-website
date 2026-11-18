// Admin-only: who changed what in the CMS, and when (the `activity` collection).
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { ArrowRight, History, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "@/components/ui/Dropdown";
import { listActivity, listStaff, type ActivityAction, type ActivityEntry } from "./api";
import { COLLECTIONS, COLLECTION_LIST, type CollectionName } from "./collections";
import { Avatar, Button, Card, errorMessage, inputClass, Notice, PageTitle, Spinner, timeAgo } from "./ui";

const PAGE_SIZE = 100;

const ACTIONS: Record<ActivityAction, { label: string; badge: string }> = {
  created: { label: "Published new", badge: "bg-green-100 text-success" },
  published: { label: "Published", badge: "bg-green-100 text-success" },
  updated: { label: "Updated", badge: "bg-maroon-50 text-maroon-700" },
  draft: { label: "Saved draft", badge: "bg-ink-200 text-ink-600" },
  unpublished: { label: "Moved to drafts", badge: "bg-gold-100 text-ink-900" },
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

/** Profile photos, so each row shows the person's avatar. */
function useStaffPhotos() {
  const [photos, setPhotos] = useState<Record<string, string | undefined>>({});
  useEffect(() => {
    listStaff()
      .then((list) => setPhotos(Object.fromEntries(list.map((s) => [s.uid, s.photo]))))
      .catch(() => {});
  }, []);
  return photos;
}

function ActionBadge({ action }: { action: ActivityAction }) {
  const a = ACTIONS[action] ?? { label: action, badge: "bg-ink-200 text-ink-600" };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}>{a.label}</span>;
}

function ActivityRow({ entry, photo, onView, compact = false }: { entry: ActivityEntry; photo?: string; onView: () => void; compact?: boolean }) {
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
        <Link to={linkFor(entry)} className="mt-0.5 block truncate text-[15px] font-semibold text-maroon-700 hover:underline">
          {entry.title}
        </Link>
        {changes.length > 0 && (
          <p className="mt-1 text-sm text-ink-600">
            {!compact && <span>Changed: {changes.map((c) => c.field).join(", ")} · </span>}
            <button type="button" onClick={onView} className="font-semibold text-maroon-700 hover:underline">
              View {changes.length === 1 ? "change" : `${changes.length} changes`}
            </button>
          </p>
        )}
      </div>
      <time dateTime={when?.toISOString()} title={fullDate(when)} className="shrink-0 whitespace-nowrap pt-0.5 text-[13px] text-ink-600">
        {when ? (compact ? timeAgo(when) : when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })) : "just now"}
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
          <div className="flex justify-end gap-2 border-t border-ink-200 bg-cream px-6 py-3">
            <Link to={linkFor(entry)} className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-maroon-700 hover:bg-maroon-50">
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
            { value: "unpublished", label: "Moved to drafts" },
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
          <Button variant="secondary" onClick={() => load(true)} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load older activity"}
          </Button>
          {filtered && <p className="mt-2 text-[13px] text-ink-600">Filters apply to the activity loaded so far.</p>}
        </div>
      )}

      <ChangesDialog entry={viewing} onClose={() => setViewing(null)} />
    </>
  );
}

/** The last 5 changes, for the admin Dashboard. */
export function RecentActivityCard() {
  const [entries, setEntries] = useState<ActivityEntry[]>();
  const [viewing, setViewing] = useState<ActivityEntry | null>(null);
  const photos = useStaffPhotos();

  useEffect(() => {
    listActivity(5)
      .then((page) => setEntries(page.entries))
      .catch(() => setEntries([]));
  }, []);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-maroon-900">Recent activity</h2>
          <p className="text-sm text-ink-600">The latest changes made in the CMS.</p>
        </div>
        <Link to="/activity" className="whitespace-nowrap text-sm font-semibold text-maroon-700 hover:underline">
          View all →
        </Link>
      </div>
      {!entries ? (
        <Card>
          <p className="text-ink-600">Loading…</p>
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <p className="text-ink-600">No activity yet. Changes made in the CMS from now on will appear here.</p>
        </Card>
      ) : (
        <ul className="divide-y divide-ink-200 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {entries.map((e) => (
            <ActivityRow key={e.id} entry={e} photo={photos[e.uid]} onView={() => setViewing(e)} compact />
          ))}
        </ul>
      )}
      <ChangesDialog entry={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}
