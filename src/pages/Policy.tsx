import { FileText, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { getPolicy, POLICIES } from "@/data/policies";
import { SITE } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Primitives";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const POLICIES_CRUMB = { name: "Policies", path: "/transparency/policies/" };

export function PolicyPage({ slug }: { slug: string }) {
  const policy = getPolicy(slug)!;
  const crumbs = [ROOT, POLICIES_CRUMB, { name: policy.title, path: `/${slug}/` }];
  return (
    <>
      <Seo title={policy.title} description={`${policy.summary} — ${SITE.legalName}.`} jsonLd={breadcrumbSchema(crumbs)} />
      <PageHeader title={policy.title} intro={policy.summary} crumbs={crumbs} />
      <Section tone="cream">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0 rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10">
            <div className="space-y-5 break-words text-base sm:text-[17px] leading-relaxed text-ink-900">
              {policy.blocks.map((b, i) =>
                b.type === "h" ? (
                  <h2 key={i} className="pt-4 font-heading text-2xl font-semibold text-maroon-700">
                    {b.text}
                  </h2>
                ) : b.type === "ul" ? (
                  <ul key={i} className="list-disc space-y-2 pl-6 marker:text-maroon-400">
                    {b.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{b.text}</p>
                ),
              )}
            </div>
          </article>
          <aside className="space-y-6 lg:sticky lg:top-40">
            <nav aria-label="Policies" className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-lg font-semibold text-maroon-700">Our policies</h2>
              <ul className="mt-3 space-y-1">
                {POLICIES.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/${p.slug}/`}
                      aria-current={p.slug === slug ? "page" : undefined}
                      className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 font-medium ${
                        p.slug === slug ? "bg-maroon-700 text-white" : "text-ink-900 hover:bg-maroon-50"
                      }`}
                    >
                      <FileText size={16} aria-hidden /> {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-lg font-semibold text-maroon-700">Contact us</h2>
              <p className="mt-3 flex gap-2 text-sm text-ink-900">
                <MapPin size={16} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden /> {SITE.address}
              </p>
              <div className="mt-3 flex gap-2 text-sm">
                <Mail size={16} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden />
                <span className="flex flex-col">
                  {SITE.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="break-all text-ink-900 hover:underline">
                      {e}
                    </a>
                  ))}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
