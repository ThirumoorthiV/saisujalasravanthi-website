import { Award, FileCheck2, Globe2, Landmark, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { DONATION } from "@/data/site";
import { REPORTS } from "@/data/organisation";
import { POLICIES } from "@/data/policies";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { MediaCard } from "@/components/ui/Cards";
import { PendingBadge, Section, SectionHeading } from "@/components/ui/Primitives";
import { ReportList } from "@/components/ui/ReportList";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const TRANSPARENCY = { name: "Transparency", path: "/transparency/" };

const fcraDocs = REPORTS.filter((r) => r.title.startsWith("FCRA"));
const others = REPORTS.filter((r) => !r.title.startsWith("FCRA"));

const SECTIONS = [
  { title: "FCRA", text: "Registration, bank details and FCRA returns for foreign contributions.", to: "/transparency/fcra/", image: "/images/free/donation-make-a-change.webp" },
  { title: "Annual Reports", text: "Annual, impact and CSR reports.", to: "/transparency/annual-reports/", image: "/images/site/pediatric-heart-screening-infographic.webp" },
  { title: "Financial Reports", text: "Audited financial statements, year by year.", to: "/transparency/financial-reports/", image: "/images/free/helping-hands.webp" },
  { title: "Policies", text: "Privacy Policy, Terms and Conditions and Refund Policy.", to: "/transparency/policies/", image: "/images/free/helping-hand-reach.webp" },
];

export function TransparencyOverview() {
  return (
    <>
      <Seo
        title="Transparency & Accountability"
        description="Registration details, FCRA information, annual reports, audited financial statements, governance and policies of Sai Sujala Sravanthi."
        jsonLd={breadcrumbSchema([ROOT, TRANSPARENCY])}
      />
      <PageHeader
        title="Transparency & Accountability"
        intro="For CSR partners, institutional donors and international supporters — everything you need to trust how we work."
        crumbs={[ROOT, TRANSPARENCY]}
        image="/images/free/helping-hands.webp"
      >
        <ButtonLink to="/transparency/annual-reports/" variant="light">
          View Annual Reports
        </ButtonLink>
        <ButtonLink to="/transparency/financial-reports/" variant="outline-light">
          View Financial Reports
        </ButtonLink>
      </PageHeader>

      <Section tone="cream">
        <SectionHeading eyebrow="Registration & governance" title="Who we are, on record" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Landmark, title: "Registration details", rows: ["Sri Sathya Sai Sujala Sravanthi Trust", "Established: 2012, Hyderabad", "Registration no.: —", "PAN: —"] },
            { icon: Award, title: "Tax exemptions", rows: ["12A registration: —", "80G registration: —", "CSR-1 registration: —"] },
            { icon: Scale, title: "Governance", rows: ["Board of Trustees", "Annual statutory audit", `FCRA Reg. No. ${DONATION.fcra.registrationNo}`] },
          ].map(({ icon: I, title, rows }) => (
            <div key={title} className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                <I aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-xl font-semibold text-maroon-700">{title}</h2>
              <ul className="mt-3 space-y-1 text-ink-900">
                {rows.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-600">
          Fields marked “—” <PendingBadge>awaiting details from the Trust</PendingBadge>
        </p>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Documents" title="Explore our disclosures" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <MediaCard key={s.title} image={s.image} title={s.title} text={s.text} cta="Open" to={s.to} />
          ))}
        </div>
      </Section>
    </>
  );
}

export function FcraPage() {
  const crumb = { name: "FCRA", path: "/transparency/fcra/" };
  const f = DONATION.fcra;
  return (
    <>
      <Seo title="FCRA Details" description="FCRA registration, SBI FCRA account details and FCRA returns of Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, TRANSPARENCY, crumb])} />
      <PageHeader
        title="FCRA Details"
        intro="Foreign contributions are received only in our designated SBI FCRA account and reported as required by the FCRA Act, 2010."
        crumbs={[ROOT, TRANSPARENCY, crumb]}
        image="/images/free/donation-make-a-change.webp"
      />
      <Section tone="cream">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl bg-maroon-900 p-6 text-white md:p-8">
            <div className="flex items-center gap-3">
              <Globe2 className="text-gold-500" size={32} aria-hidden />
              <h2 className="font-heading text-2xl font-semibold">Registration & bank account</h2>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["FCRA registration no.", f.registrationNo],
                ["Registration date", f.registrationDate],
                ["Account name", f.trustName],
                ["Account number", f.accountNo],
                ["IFSC", f.ifsc],
                ["SWIFT code", f.swift],
                ["Bank & branch", `${f.bank}, ${f.branch}`],
                ["Bank address", f.bankAddress],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-maroon-700/60 p-4">
                  <dt className="text-sm text-maroon-100">{label}</dt>
                  <dd className="mt-1 break-words font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink to="/donate/" variant="light" className="mt-6">
              Donate as an NRI / foreign donor
            </ButtonLink>
          </div>
          <div>
            <SectionHeading eyebrow="Downloads" title="FCRA documents" />
            <ReportList items={fcraDocs} />
          </div>
        </div>
      </Section>
    </>
  );
}

function DocumentPage({ slug, title, intro, items }: { slug: string; title: string; intro: string; items: typeof REPORTS }) {
  const crumb = { name: title, path: `/transparency/${slug}/` };
  return (
    <>
      <Seo title={title} description={intro} jsonLd={breadcrumbSchema([ROOT, TRANSPARENCY, crumb])} />
      <PageHeader title={title} intro={intro} crumbs={[ROOT, TRANSPARENCY, crumb]} image="/images/free/helping-hands.webp" />
      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          <ReportList items={items} />
          <div className="mt-8 flex gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
            <FileCheck2 className="shrink-0 text-maroon-700" size={28} aria-hidden />
            <p className="text-ink-600">
              Need a document not listed here? Write to us via the{" "}
              <Link to="/contact-us/" className="font-semibold text-maroon-700 underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

export const AnnualReportsPage = () => (
  <DocumentPage
    slug="annual-reports"
    title="Annual Reports"
    intro="Annual, impact and CSR reports of Sri Sathya Sai Sujala Sravanthi Trust."
    items={others.filter((r) => ["Annual Report", "Impact Report", "CSR Report"].includes(r.type))}
  />
);

export const FinancialReportsPage = () => (
  <DocumentPage slug="financial-reports" title="Financial Reports" intro="Audited financial statements, year by year." items={others.filter((r) => r.type === "Financial Report")} />
);

export function PoliciesPage() {
  const crumb = { name: "Policies", path: "/transparency/policies/" };
  return (
    <>
      <Seo title="Policies" description="Privacy Policy, Terms and Conditions and Refund Policy of Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, TRANSPARENCY, crumb])} />
      <PageHeader title="Policies" intro="How we handle your information, the terms of using this website, and our refund policy." crumbs={[ROOT, TRANSPARENCY, crumb]} image="/images/free/helping-hands.webp" />
      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {POLICIES.map((p) => (
            <Link
              key={p.slug}
              to={`/${p.slug}/`}
              className="group flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                <FileCheck2 aria-hidden />
              </span>
              <h2 className="mt-4 font-heading text-xl font-semibold text-maroon-700">{p.title}</h2>
              <p className="mt-2 flex-1 text-ink-600">{p.summary}</p>
              <span className="mt-5 font-semibold text-maroon-700">Read policy →</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
