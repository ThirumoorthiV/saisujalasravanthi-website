import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStaff } from "./AdminApp";
import { getSiteMeta, importBuiltInContent, isImported, listItems, type SiteMeta } from "./api";
import { COLLECTION_LIST, type CollectionDef, type CollectionName } from "./collections";
import { Button, buttonClass, Card, errorMessage, Notice, PageTitle, Spinner } from "./ui";

type Counts = Partial<Record<CollectionName, { published: number; drafts: number }>>;

const GROUPS: { key: CollectionDef["group"]; title: string; text: string }[] = [
  { key: "updates", title: "Regular updates", text: "Blog posts (including Beneficiary & Volunteer Stories and Media & Press), Events and Gallery photos." },
  { key: "pages", title: "Website pages", text: "Our Programmes, Leadership and Our Network." },
];

export function Dashboard() {
  const staff = useStaff();
  const [meta, setMeta] = useState<SiteMeta | null>();
  const [counts, setCounts] = useState<Counts>();
  const [error, setError] = useState("");
  const [importing, setImporting] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setMeta(await getSiteMeta());
      const entries = await Promise.all(
        COLLECTION_LIST.map(async (def) => {
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
  const lastChange = meta?.updatedAt?.toDate();
  const notImported = COLLECTION_LIST.filter((d) => !isImported(meta, d.name));

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

      {GROUPS.map((group) => (
        <section key={group.key} className="mb-8">
          <h2 className="font-heading text-xl font-bold text-maroon-900">{group.title}</h2>
          <p className="mb-3 text-sm text-ink-600">{group.text}</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {COLLECTION_LIST.filter((d) => d.group === group.key).map((def) => {
              const c = counts?.[def.name];
              return (
                <Card key={def.name} className="flex flex-col">
                  <h3 className="font-heading text-lg font-bold text-maroon-900">{def.label}</h3>
                  <p className="mt-1 text-[15px] text-ink-600">
                    {isImported(meta, def.name) && c
                      ? `${c.published} published · ${c.drafts} draft${c.drafts === 1 ? "" : "s"}`
                      : "Not imported yet"}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Link to={`/${def.name}/new`} className={buttonClass()}>
                      Add {def.singular}
                    </Link>
                    <Link to={`/${def.name}`} className={buttonClass("secondary")}>
                      View all
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      <Card>
        <h2 className="font-heading text-lg font-bold text-maroon-900">How publishing works</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
          <li>
            <strong>Save draft</strong> keeps your work in the CMS only. <strong>Publish</strong> puts it on the website.
          </li>
          <li>Published changes appear on the website within about 30 minutes, after the site is automatically rebuilt.</li>
          <li>Photos are resized automatically, so you can upload them straight from a phone or camera.</li>
        </ul>
        {lastChange && <p className="mt-3 text-sm text-ink-600">Last change in the CMS: {lastChange.toLocaleString("en-IN")}</p>}
      </Card>
    </>
  );
}
