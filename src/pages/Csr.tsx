import { Clock, Download, FileText, HandHeart, IndianRupee, Mail, MapPin, Network, Phone, ShieldCheck, Stethoscope, Target, TrendingUp, Users } from "lucide-react";
import { CSR_PROJECTS, PARTNERS, REPORTS } from "@/data/organisation";
import { ENQUIRY_INBOXES, SITE } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ImageFrame, MediaCard } from "@/components/ui/Cards";
import { EnquiryForm } from "@/components/ui/Form";
import { Section, SectionHeading, Tag } from "@/components/ui/Primitives";
import { ReportList } from "@/components/ui/ReportList";
import { CsrBand } from "@/components/sections/Shared";
import { csrFields, csrSchema } from "@/lib/forms";
import { Icon } from "@/lib/icons";
import { breadcrumbSchema, Seo } from "@/lib/seo";
import type { IconName } from "@/types";

const ROOT = { name: "Home", path: "/" };
const CSR = { name: "CSR Partnerships", path: "/csr-partnerships/" };

const WHY = [
  { icon: Network, title: "Established implementation network", text: "18 Sai Swasthya centres, Sai Aarogya Hospital and a pharma bank already in operation." },
  { icon: MapPin, title: "Deep rural reach", text: "Villages across Andhra Pradesh and Telangana, from Timmayapalli to Bapatla." },
  { icon: Stethoscope, title: "Healthcare expertise", text: "Paediatric cardiologists, specialist camps and partners such as Niloufer Hospital." },
  { icon: FileText, title: "100% transparency", text: "Full transparency in fund utilisation, with project reports for every partner." },
  { icon: ShieldCheck, title: "Compliant & SDG-aligned", text: "High social impact aligned with the SDGs and compliant with government CSR regulations." },
  { icon: Users, title: "Volunteer-driven", text: "Run entirely by volunteers — so more of every rupee reaches beneficiaries." },
];

const AREAS: { name: string; icon: IconName }[] = [
  { name: "Healthcare", icon: "HeartPulse" },
  { name: "Rural Development", icon: "Sprout" },
  { name: "Education", icon: "GraduationCap" },
  { name: "Nutrition", icon: "Users" },
  { name: "Water & Sanitation", icon: "Droplets" },
  { name: "Preventive Healthcare", icon: "ShieldPlus" },
];

const headerCtas = (
  <>
    <ButtonLink to="/csr-partnerships/csr-enquiry/" variant="light">
      <HandHeart size={18} aria-hidden /> Partner With Us
    </ButtonLink>
    <ButtonLink to="/csr-partnerships/csr-projects/" variant="outline-light">
      <Download size={18} aria-hidden /> View CSR Projects
    </ButtonLink>
  </>
);

/** /csr-partnerships/ — Why Partner With Us */
export function CsrWhy() {
  return (
    <>
      <Seo
        title="CSR Partnerships — Why Partner With Us"
        description="Partner with Sai Sujala Sravanthi on CSR healthcare, water, sanitation and education projects in Telangana with transparent, measurable reporting."
        jsonLd={breadcrumbSchema([ROOT, CSR])}
      />
      <PageHeader
        title="Partner With Us to Create Meaningful Social Impact"
        intro="CSR projects in healthcare, rural development and education — implemented on the ground, reported transparently."
        crumbs={[ROOT, CSR]}
        image="/images/free/corporate-unity.webp"
      >
        {headerCtas}
      </PageHeader>

      <Section tone="cream">
        <SectionHeading eyebrow="Why partner with us" title="An implementation partner you can trust" align="center" />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(({ icon: I, title, text }) => (
            <div key={title} className="flex h-full gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
                <I aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-maroon-700">{title}</h3>
                <p className="mt-1 text-sm text-ink-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="maroon">
        <SectionHeading eyebrow="CSR areas" title="Where your CSR can make a difference" align="center" light />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {AREAS.map((a) => (
            <li key={a.name} className="flex h-full flex-col items-center justify-center rounded-xl bg-maroon-700 p-5 text-center">
              <Icon name={a.icon} className="text-gold-500" size={32} />
              <span className="mt-3 font-semibold">{a.name}</span>
            </li>
          ))}
        </ul>
      </Section>
      <CsrBand />
    </>
  );
}

export function CsrProjects() {
  const crumb = { name: "CSR Projects", path: "/csr-partnerships/csr-projects/" };
  return (
    <>
      <Seo title="CSR Projects" description="Ready-to-fund CSR projects in healthcare, pharma CSR and village water & sanitation." jsonLd={breadcrumbSchema([ROOT, CSR, crumb])} />
      <PageHeader title="CSR Projects" intro="Ready-to-fund projects — budgets shared on request and tailored to your CSR goals." crumbs={[ROOT, CSR, crumb]} image="/images/site/sai-swasthya-centre-1.webp" />
      <Section tone="cream">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {CSR_PROJECTS.map((p) => (
            <MediaCard key={p.name} image={p.image} imageAlt={p.name} meta={<Tag>{p.theme}</Tag>} title={p.name} text={p.objective} cta="Discuss this project" to="/csr-partnerships/csr-enquiry/">
              <dl className="mt-5 grid gap-3 border-t border-ink-200 pt-5 text-sm sm:grid-cols-2">
                {[
                  { icon: MapPin, label: "Location", value: p.location },
                  { icon: Users, label: "Target beneficiaries", value: p.beneficiaries },
                  { icon: Clock, label: "Duration", value: p.duration },
                  { icon: IndianRupee, label: "Estimated budget", value: p.budget },
                  { icon: TrendingUp, label: "Expected impact", value: p.expectedImpact },
                  { icon: Target, label: "Implementation model", value: p.model },
                ].map(({ icon: I, label, value }) => (
                  <div key={label} className="flex gap-2">
                    <I size={16} className="mt-0.5 shrink-0 text-maroon-400" aria-hidden />
                    <div>
                      <dt className="font-semibold text-ink-900">{label}</dt>
                      <dd className="text-ink-600">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </MediaCard>
          ))}
        </div>
      </Section>
    </>
  );
}

export function CsrImpact() {
  const crumb = { name: "CSR Impact", path: "/csr-partnerships/csr-impact/" };
  const csrReports = REPORTS.filter((r) => ["Annual Report", "CSR Report", "Impact Report"].includes(r.type));
  return (
    <>
      <Seo title="CSR Impact" description="CSR impact reports, annual reports and project reports from Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, CSR, crumb])} />
      <PageHeader title="CSR Impact" intro="Transparent reporting on every CSR rupee invested." crumbs={[ROOT, CSR, crumb]} image="/images/site/aushadhalayam-medicine-stock.webp" />
      <Section tone="cream">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Pharma CSR in action" title="₹65 lakh of medicines, 800+ beneficiaries" />
            <ImageFrame src="/images/site/aushadhalayam-pharmacy.webp" alt="Pharmacy stocked through pharma CSR" aspect="aspect-[16/10]" className="rounded-xl" />
            <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-ink-900">
              Through Aushadhalayam, pharma CSR has supplied ₹65 lakh of medicines to 5 free-care centres, benefiting 800+ patients and
              facilitating 30 surgeries through cost savings.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Downloads" title="CSR impact reports" />
            <ReportList items={csrReports} />
          </div>
        </div>
      </Section>
    </>
  );
}

export function CsrPartners() {
  const crumb = { name: "Our Partners", path: "/csr-partnerships/our-partners/" };
  const partners = PARTNERS.filter((p) => p.permissionGranted);
  return (
    <>
      <Seo title="Our CSR Partners" description="Organisations that support the work of Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, CSR, crumb])} />
      <PageHeader title="Our Partners" intro="Organisations that support our work." crumbs={[ROOT, CSR, crumb]} image="/images/free/csr-handshake.webp" />
      <Section tone="cream">
        {partners.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((p) => (
              <li key={p.name} className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-20 w-full items-center justify-center">
                  <img src={p.logo} alt={p.name} loading="lazy" className="max-h-20 w-auto max-w-full object-contain" />
                </div>
                <p className="mt-4 text-center text-sm font-semibold text-ink-900">{p.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-start gap-2 rounded-xl bg-white p-6 text-ink-600 ring-1 ring-ink-200">
            <ShieldCheck className="shrink-0 text-maroon-700" aria-hidden />
            Partner logos appear here once written permission has been received from each partner.
          </p>
        )}
      </Section>
      <CsrBand />
    </>
  );
}

export function CsrEnquiry() {
  const crumb = { name: "CSR Enquiry", path: "/csr-partnerships/csr-enquiry/" };
  return (
    <>
      <Seo title="CSR Enquiry" description="Request a CSR discussion with Sri Sathya Sai Sujala Sravanthi Trust." jsonLd={breadcrumbSchema([ROOT, CSR, crumb])} />
      <PageHeader title="CSR Enquiry" intro="Tell us about your CSR goals and our partnerships team will respond within two working days." crumbs={[ROOT, CSR, crumb]} image="/images/free/corporate-unity.webp" />
      <Section tone="cream">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6">
            <ImageFrame src="/images/site/pediatric-heart-screening-niloufer.webp" alt="Pediatric heart screening supported by CSR" className="rounded-xl" />
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-xl font-semibold text-maroon-700">Prefer to talk directly?</h2>
              <ul className="mt-4 space-y-3 text-ink-900">
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-maroon-700" aria-hidden />
                  <a href={`mailto:${ENQUIRY_INBOXES["CSR Partnerships"]}`} className="hover:underline">
                    {ENQUIRY_INBOXES["CSR Partnerships"]}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden />
                  <span className="flex flex-col gap-1">
                    {SITE.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:underline">
                        {p}
                      </a>
                    ))}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70 sm:p-6 md:p-8">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon-700">Request a CSR discussion</h2>
            <EnquiryForm formName="csr_enquiry" schema={csrSchema} fields={csrFields} inbox={ENQUIRY_INBOXES["CSR Partnerships"]} submitLabel="Send CSR Enquiry" />
          </div>
        </div>
      </Section>
    </>
  );
}
