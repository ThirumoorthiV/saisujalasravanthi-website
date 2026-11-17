// List and edit screens, shared by every CMS section (the fields come from collections.ts).
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "@/components/ui/Dropdown";
import { deleteItem, getItem, getSiteMeta, isImported, listItems, photoPreviewUrl, saveItem, uploadPhoto, type Item } from "./api";
import { COLLECTIONS, fromForm, slugify, sortItems, toForm, type CollectionDef, type CollectionName, type Field, type FormValues } from "./collections";
import { useConfirm } from "./confirm";
import { Button, buttonClass, Card, errorMessage, inputClass, Notice, PageTitle, Spinner, StatusBadge } from "./ui";

function useCollection(): CollectionDef | null {
  const { collection } = useParams();
  return collection && collection in COLLECTIONS ? COLLECTIONS[collection as CollectionName] : null;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

// --- List ---------------------------------------------------------------------

export function ContentList() {
  const def = useCollection();
  const [items, setItems] = useState<Item[]>();
  const [imported, setImported] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!def) return;
    setItems(undefined);
    setSearch("");
    setStatus("all");
    setFilter("");
    listItems(def.name)
      .then((list) => setItems(sortItems(def, list)))
      .catch((err) => setError(errorMessage(err)));
    getSiteMeta()
      .then((meta) => setImported(isImported(meta, def.name)))
      .catch(() => {});
  }, [def]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items ?? []).filter(
      (i) =>
        (status === "all" || (status === "published") === i.published) &&
        (!filter || !def?.filter || i[def.filter.field] === filter) &&
        (!q || JSON.stringify(i).toLowerCase().includes(q)),
    );
  }, [items, search, status, filter, def]);

  if (!def) return <Navigate to="/" />;

  return (
    <>
      <PageTitle
        actions={
          <Link to={`/${def.name}/new`} className={buttonClass()}>
            + Add {def.singular}
          </Link>
        }
      >
        {def.label}
      </PageTitle>
      <p className="-mt-3 mb-5 max-w-3xl text-[15px] text-ink-600">{def.intro}</p>
      {!imported && (
        <Notice>
          This section still shows the website's built-in content. An admin needs to click <strong>Import</strong> for {def.label} on the
          Dashboard before changes made here appear on the website.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {/* Phones: search on its own row, the two filters side by side below it. Wider screens: one row. */}
      <div className="mb-4 grid grid-cols-2 items-center gap-3 lg:flex">
        <input
          type="search"
          placeholder={`Search ${def.label.toLowerCase()}…`}
          aria-label={`Search ${def.label.toLowerCase()}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} col-span-2 min-h-[44px] rounded-lg lg:w-72`}
        />
        {def.filter && (
          <Dropdown
            ariaLabel={def.filter.label}
            value={filter}
            onChange={setFilter}
            options={[{ value: "", label: `All ${plural(def.filter.label.toLowerCase())}` }, ...def.filter.options]}
            className="min-w-0 lg:w-56"
          />
        )}
        <Dropdown
          ariaLabel="Status"
          value={status}
          onChange={(v) => setStatus(v as typeof status)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Drafts" },
          ]}
          className="min-w-0 lg:w-48"
        />
        {items && (
          <p className="col-span-2 text-sm text-ink-600 lg:ml-auto lg:whitespace-nowrap">
            Showing {shown.length} of {items.length}
          </p>
        )}
      </div>
      {!items && !error ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <Card>
          <p className="text-ink-600">{items?.length ? "Nothing matches these filters." : "Nothing here yet."}</p>
        </Card>
      ) : (
        <ul className="divide-y divide-ink-200 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {shown.map((item) => (
            <li key={item.id}>
              <Link to={`/${def.name}/edit/${item.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-maroon-50">
                {def.imageField && <Thumb path={str(item[def.imageField])} />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink-900">{str(item[def.titleField]) || "(untitled)"}</span>
                  <span className="block truncate text-sm text-ink-600">{def.subtitle(item)}</span>
                </span>
                <StatusBadge published={item.published} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** "category" → "categories", "state" → "states". */
const plural = (word: string) => (/[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ies` : `${word}s`);

function usePreview(path: string) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    if (!path) setUrl("");
    else photoPreviewUrl(path).then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
  }, [path]);
  return url;
}

function Thumb({ path }: { path: string }) {
  const url = usePreview(path);
  return url ? (
    <img src={url} alt="" className="h-14 w-20 shrink-0 rounded object-cover" loading="lazy" />
  ) : (
    <span className="h-14 w-20 shrink-0 rounded bg-maroon-100" />
  );
}

// --- Editor ---------------------------------------------------------------------

export function ContentEditor() {
  const def = useCollection();
  const { id } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [original, setOriginal] = useState<Item | null>();
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!def) return;
    if (!id) {
      setOriginal(null);
      setValues(toForm(def, def.name === "events" ? { status: "Upcoming" } : {}));
      return;
    }
    getItem(def.name, id)
      .then((item) => {
        setOriginal(item);
        if (item) setValues(toForm(def, item));
      })
      .catch((err) => setMessage({ tone: "error", text: errorMessage(err) }));
  }, [def, id]);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!def) return <Navigate to="/" />;
  if (original === undefined && !message) return <Spinner />;
  if (id && original === null) return <Notice tone="error">This {def.singular} no longer exists.</Notice>;

  const set = (key: string, value: string | boolean) => {
    setDirty(true);
    setValues((v) => {
      const next = { ...v, [key]: value };
      // New items: the web address follows the title until it's edited by hand.
      if (key === def.titleField && def.idField && !id && !slugTouched.current) next[def.idField] = slugify(String(value));
      if (key === def.idField) slugTouched.current = true;
      return next;
    });
  };

  const save = async (publish: boolean) => {
    const { item, errors } = fromForm(def, values, publish);
    setErrors(errors);
    if (Object.keys(errors).length) {
      setMessage({ tone: "error", text: "Please fix the highlighted fields." });
      document.getElementById(`f-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const savedId = await saveItem(def, id ?? null, item, publish);
      setDirty(false);
      setOriginal({ ...item, id: savedId, published: publish });
      setMessage({
        tone: "success",
        text: publish ? "Published. It will appear on the website within about 30 minutes." : "Draft saved. It is not on the website.",
      });
      if (!id) navigate(`/${def.name}/edit/${savedId}`, { replace: true });
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
    setBusy(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Back to the list without saving; asks first if something was changed. */
  const cancel = async () => {
    if (
      dirty &&
      !(await confirm({
        title: "Discard your changes?",
        message: "The changes you made on this page haven't been saved and will be lost.",
        confirmLabel: "Yes, discard",
        cancelLabel: "Keep editing",
        danger: false,
      }))
    )
      return;
    setDirty(false);
    navigate(`/${def.name}`);
  };

  const remove = async () => {
    if (!id) return;
    const title = String(values[def.titleField] ?? "").trim();
    const ok = await confirm({
      title: `Delete this ${def.singular}?`,
      message: (
        <>
          {title && <strong className="mb-1 block text-ink-900">“{title}”</strong>}
          It will be removed from the CMS and from the website. This can't be undone.
        </>
      ),
    });
    if (!ok) return;
    setBusy(true);
    try {
      await deleteItem(def.name, id);
      navigate(`/${def.name}`);
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
      setBusy(false);
    }
  };

  const sections = [...new Set(def.fields.map((f) => f.section ?? ""))];
  const published = Boolean(original?.published);

  return (
    <>
      <p className="mb-2 text-sm">
        <Link to={`/${def.name}`} className="text-maroon-700 underline">
          ← All {def.label.toLowerCase()}
        </Link>
      </p>
      <PageTitle actions={original && <StatusBadge published={published} />}>
        {id ? `Edit ${def.singular}` : `New ${def.singular}`}
      </PageTitle>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {published && original && (
        <p className="-mt-2 mb-4 text-sm">
          <a href={def.url(original)} target="_blank" rel="noreferrer" className="text-maroon-700 underline">
            View on website ↗
          </a>{" "}
          <span className="text-ink-600">(shows the last published version once the site has rebuilt)</span>
        </p>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="max-w-3xl space-y-6">
        {sections.map((section) => (
          <Card key={section || "main"}>
            {section && <h2 className="mb-4 font-heading text-lg font-bold text-maroon-900">{section}</h2>}
            <div className="space-y-5">
              {def.fields
                .filter((f) => (f.section ?? "") === section)
                .map((f) => (
                  <FieldInput
                    key={f.key}
                    field={f}
                    value={values[f.key]}
                    error={errors[f.key]}
                    locked={Boolean(id) && f.key === def.idField}
                    onChange={(v) => set(f.key, v)}
                  />
                ))}
            </div>
          </Card>
        ))}

        <div className="sticky bottom-0 z-10 -mx-4 grid grid-cols-2 gap-2 border-t border-ink-200 bg-cream/95 px-4 py-3 backdrop-blur sm:flex sm:flex-wrap md:mx-0 md:rounded-lg md:border">
          <Button onClick={() => save(true)} disabled={busy}>
            {published ? "Update on website" : "Publish"}
          </Button>
          <Button variant="secondary" onClick={() => save(false)} disabled={busy}>
            {published ? "Move to drafts" : "Save draft"}
          </Button>
          <Button variant="neutral" onClick={cancel} disabled={busy}>
            Cancel
          </Button>
          {id && (
            <Button variant="danger" onClick={remove} disabled={busy} className="ml-auto">
              Delete
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

// --- Fields -----------------------------------------------------------------------

interface FieldProps {
  field: Field;
  value: string | boolean | undefined;
  error?: string;
  locked?: boolean;
  onChange: (value: string | boolean) => void;
}

function FieldInput({ field, value, error, locked, onChange }: FieldProps) {
  const id = `f-${field.key}`;
  const describedBy = [field.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": describedBy,
    className: `${inputClass} ${error ? "border-error" : ""}`,
  };
  const text = typeof value === "string" ? value : "";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-2 text-[15px]">
        <input type="checkbox" id={id} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-maroon-700" />
        {field.label}
      </label>
    );
  }

  let input;
  if (field.type === "image") input = <ImageInput id={id} value={text} onChange={onChange} invalid={Boolean(error)} />;
  else if (field.type === "select")
    input = (
      <Dropdown
        id={id}
        labelId={`${id}-label`}
        value={text}
        onChange={onChange}
        placeholder="Choose…"
        invalid={Boolean(error)}
        options={field.options!.map((o) => (typeof o === "string" ? { value: o, label: o } : o))}
        className=""
      />
    );
  else if (field.type === "ref") input = <RefInput id={id} refName={field.ref!} value={text} onChange={onChange} />;
  else if (["textarea", "paragraphs", "lines", "pairs"].includes(field.type))
    input = <textarea {...common} rows={field.type === "paragraphs" ? 12 : field.type === "textarea" ? 3 : 5} value={text} onChange={(e) => onChange(e.target.value)} />;
  else
    input = (
      <input
        {...common}
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        step={field.type === "number" ? "any" : undefined}
        value={text}
        readOnly={locked}
        onChange={(e) => onChange(e.target.value)}
        className={`${common.className} ${locked ? "bg-ink-200/40 text-ink-600" : ""}`}
      />
    );

  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className="mb-1 block text-sm font-semibold">
        {field.label}
        {field.required && <span className="text-error"> *</span>}
      </label>
      {input}
      {field.help && (
        <p id={`${id}-help`} className="mt-1 text-[13px] text-ink-600">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[13px] font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function RefInput({
  id,
  refName,
  value,
  onChange,
}: {
  id: string;
  refName: CollectionName;
  value: string;
  onChange: (v: string) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const def = COLLECTIONS[refName];
  useEffect(() => {
    listItems(refName)
      .then((list) => setItems(sortItems(def, list)))
      .catch(() => setItems([]));
  }, [refName, def]);
  return (
    <Dropdown
      id={id}
      labelId={`${id}-label`}
      value={value}
      onChange={onChange}
      className=""
      options={[
        { value: "", label: "None" },
        ...(value && !items.some((i) => i.id === value) ? [{ value, label: value }] : []),
        ...items.map((i) => ({ value: i.id, label: `${str(i[def.titleField])}${i.published ? "" : " (draft)"}` })),
      ]}
    />
  );
}

function ImageInput({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid: boolean }) {
  const preview = usePreview(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadPhoto(file));
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={`rounded-md border border-dashed p-3 ${invalid ? "border-error" : "border-ink-200"}`}>
      {preview ? (
        <img src={preview} alt="Selected" className="mb-3 max-h-64 rounded object-contain" />
      ) : (
        <p className="mb-3 text-sm text-ink-600">No photo chosen.</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className={`${buttonClass("secondary")} cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>
          {busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
        </label>
        <input
          ref={fileRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          onChange={(e) => pick(e.target.files?.[0])}
        />
        {value && !busy && (
          <Button variant="ghost" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>
      {error && <p className="mt-2 text-[13px] font-semibold text-error">{error}</p>}
    </div>
  );
}
