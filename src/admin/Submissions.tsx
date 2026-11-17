// Admin-only: website form submissions as a table, with a details popup.
import { Eye, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { deleteSubmission, listSubmissions, type Submission } from "./api";
import { useConfirm } from "./confirm";
import { Button, Card, errorMessage, Notice, PageTitle, Spinner } from "./ui";

// Fields shown first, in this order; anything else follows alphabetically.
const FIELD_ORDER = [
  "name",
  "contact",
  "company",
  "designation",
  "email",
  "phone",
  "type",
  "interest",
  "programme",
  "area",
  "expertise",
  "specialisation",
  "registration",
  "city",
  "location",
  "nationality",
  "availability",
  "budget",
  "message",
];
const LABELS: Record<string, string> = { type: "Enquiry type", contact: "Contact person", registration: "Registration no." };

const label = (key: string) => LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const orderedKeys = (keys: string[]) =>
  [...new Set(keys)].sort((a, b) => {
    const ia = FIELD_ORDER.indexOf(a);
    const ib = FIELD_ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b);
  });
const text = (v: unknown) => (v === undefined || v === null || String(v).trim() === "" ? "" : String(v).trim());
const show = (v: unknown) => text(v) || "-";
const personName = (s: Submission) => text(s.data?.name) || text(s.data?.contact) || text(s.data?.company);
const formatWhen = (s: Submission) =>
  s.createdAt?.toDate().toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) ?? "-";
const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const iconButton = "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2";

export function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>();
  const [error, setError] = useState("");
  const [form, setForm] = useState("all");
  const [viewing, setViewing] = useState<Submission | null>(null);
  const confirm = useConfirm();

  useEffect(() => {
    listSubmissions()
      .then(setItems)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const forms = [...new Set((items ?? []).map((s) => s.form))].sort();
  const shown = (items ?? []).filter((s) => form === "all" || s.form === form);

  const download = () => {
    const keys = orderedKeys(shown.flatMap((s) => Object.keys(s.data ?? {})));
    const rows = [
      ["Date", "Form", ...keys.map(label), "Page"],
      ...shown.map((s) => [formatWhen(s), s.form, ...keys.map((k) => text(s.data?.[k])), s.page]),
    ];
    const blob = new Blob(["﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const remove = async (s: Submission) => {
    const ok = await confirm({
      title: "Delete this submission?",
      message: `The ${s.form.toLowerCase()} from ${personName(s) || "this person"} (${formatWhen(s)}) will be deleted permanently. This can't be undone.`,
    });
    if (!ok) return;
    try {
      await deleteSubmission(s.id);
      setItems((list) => list?.filter((i) => i.id !== s.id));
      setViewing(null);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <PageTitle
        actions={
          shown.length > 0 && (
            <Button variant="secondary" onClick={download}>
              Download CSV (Excel)
            </Button>
          )
        }
      >
        Form submissions
      </PageTitle>
      {error && <Notice tone="error">{error}</Notice>}
      {!items && !error ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Dropdown
              ariaLabel="Form"
              value={form}
              onChange={setForm}
              options={[{ value: "all", label: `All forms (${items?.length ?? 0})` }, ...forms.map((f) => ({ value: f, label: f }))]}
              className="w-full max-w-xs"
            />
            <p className="text-sm text-ink-600">
              Showing {shown.length} submission{shown.length === 1 ? "" : "s"}
            </p>
          </div>

          {shown.length === 0 ? (
            <Card>
              <p className="text-ink-600">No submissions yet.</p>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-ink-200 bg-white">
              <table className="w-full min-w-[760px] text-left text-[15px]">
                <thead className="border-b border-ink-200 bg-maroon-50 text-[13px] uppercase tracking-wide text-maroon-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Form</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Phone</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {shown.map((s) => (
                    <tr key={s.id} className="hover:bg-cream">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-600">{formatWhen(s)}</td>
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap rounded-full bg-maroon-50 px-2.5 py-0.5 text-[13px] font-semibold text-maroon-700">{s.form}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink-900">{show(personName(s))}</td>
                      <td className="max-w-[240px] truncate px-4 py-3">{show(s.data?.email)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{show(s.data?.phone)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setViewing(s)}
                          className={`${iconButton} text-maroon-700 hover:bg-maroon-50 focus-visible:ring-maroon-100`}
                          aria-label={`View submission from ${personName(s) || "unknown"}`}
                          title="View details"
                        >
                          <Eye size={18} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(s)}
                          className={`${iconButton} ml-1 text-error hover:bg-red-50 focus-visible:ring-red-100`}
                          aria-label={`Delete submission from ${personName(s) || "unknown"}`}
                          title="Delete"
                        >
                          <Trash2 size={18} aria-hidden />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {viewing && <SubmissionDialog submission={viewing} onClose={() => setViewing(null)} onDelete={() => remove(viewing)} />}
    </>
  );
}

function SubmissionDialog({ submission: s, onClose, onDelete }: { submission: Submission; onClose: () => void; onDelete: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const keys = orderedKeys(Object.keys(s.data ?? {}));
  const email = text(s.data?.email);
  const phone = text(s.data?.phone);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()} // click outside closes
      aria-labelledby="submission-title"
      className="w-[calc(100%-2rem)] max-w-2xl rounded-xl p-0 shadow-2xl backdrop:bg-ink-900/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink-200 bg-maroon-700 px-6 py-4 text-white">
        <div>
          <h2 id="submission-title" className="font-heading text-xl font-bold">
            {s.form}
          </h2>
          <p className="text-sm text-white/80">{formatWhen(s)}</p>
        </div>
        <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className={`${iconButton} text-white hover:bg-maroon-600`}>
          <X size={20} aria-hidden />
        </button>
      </div>

      <dl className="max-h-[60vh] divide-y divide-ink-200 overflow-y-auto px-6">
        {keys.map((k) => (
          <div key={k} className="grid gap-1 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-ink-600">{label(k)}</dt>
            <dd className="whitespace-pre-wrap break-words text-[15px] text-ink-900">
              {k === "email" && email ? (
                <a href={`mailto:${email}`} className="text-maroon-700 underline">
                  {email}
                </a>
              ) : k === "phone" && phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-maroon-700 underline">
                  {phone}
                </a>
              ) : (
                show(s.data?.[k])
              )}
            </dd>
          </div>
        ))}
        <div className="grid gap-1 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
          <dt className="text-sm font-semibold text-ink-600">Sent from page</dt>
          <dd className="break-all text-sm text-ink-600">{show(s.page)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap justify-between gap-2 border-t border-ink-200 bg-cream px-6 py-4">
        <Button variant="danger" onClick={onDelete}>
          <Trash2 size={16} aria-hidden /> Delete
        </Button>
        <div className="flex gap-2">
          {email && (
            <a href={`mailto:${email}?subject=${encodeURIComponent(`Re: your ${s.form.toLowerCase()}`)}`} className="inline-flex items-center rounded-md bg-maroon-700 px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-600">
              Reply by email
            </a>
          )}
          <Button variant="secondary" onClick={() => ref.current?.close()}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
