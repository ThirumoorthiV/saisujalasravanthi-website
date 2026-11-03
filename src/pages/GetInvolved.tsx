import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import type { ZodType } from "zod";
import { ENQUIRY_INBOXES } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImageFrame, MediaCard } from "@/components/ui/Cards";
import { EnquiryForm, type FieldSpec } from "@/components/ui/Form";
import { Section } from "@/components/ui/Primitives";
import { expertiseFields, expertiseSchema, medicalFields, medicalSchema, volunteerFields, volunteerSchema } from "@/lib/forms";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const INVOLVED = { name: "Get Involved", path: "/get-involved/" };

const OPTIONS = [
  { title: "Volunteer", text: "Join our service activities at camps, events and community programmes.", to: "/get-involved/volunteer/", cta: "Register as a volunteer", image: "/images/free/volunteer.webp" },
  { title: "Become a Medical Volunteer", text: "For doctors and healthcare professionals — give a few hours a month.", to: "/get-involved/medical-volunteer/", cta: "Register as a doctor", image: "/images/site/pediatric-echo-screening.webp" },
  { title: "CSR Partnership", text: "Partner with us on measurable healthcare, water and education projects.", to: "/csr-partnerships/", cta: "Explore CSR", image: "/images/free/csr-handshake.webp" },
  { title: "Support Our Work", text: "Donate to free healthcare, education or rural development.", to: "/donate/", cta: "Donate now", image: "/images/free/helping-hands.webp" },
  { title: "Become a Corporate Partner", text: "Employee volunteering and corporate engagement.", to: "/csr-partnerships/csr-enquiry/", cta: "Send an enquiry", image: "/images/free/corporate-unity.webp" },
  { title: "Share Your Expertise", text: "Skills-based contribution — tech, design, finance, training.", to: "/get-involved/share-expertise/", cta: "Offer your skills", image: "/images/site/reprogramming-lives-session.webp" },
];

export function GetInvolvedOverview() {
  return (
    <>
      <Seo
        title="Get Involved — Volunteer, Partner or Support"
        description="Volunteer, become a medical volunteer, partner through CSR, donate or share your expertise with Sai Sujala Sravanthi."
        jsonLd={breadcrumbSchema([ROOT, INVOLVED])}
      />
      <PageHeader title="Get Involved" intro="Every helping hand counts. Choose the way that suits you best." crumbs={[ROOT, INVOLVED]} image="/images/free/volunteer.webp" />
      <Section tone="cream">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((o) => (
            <MediaCard key={o.title} image={o.image} title={o.title} text={o.text} cta={o.cta} to={o.to} />
          ))}
        </div>
      </Section>
    </>
  );
}

function FormPage<T extends FieldValues>({
  slug,
  title,
  intro,
  image,
  imageAlt,
  points,
  schema,
  fields,
  inbox,
  submitLabel,
  aside,
}: {
  slug: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  points: string[];
  schema: ZodType<T>;
  fields: FieldSpec<T>[];
  inbox: string;
  submitLabel: string;
  aside?: ReactNode;
}) {
  const crumb = { name: title, path: `/get-involved/${slug}/` };
  return (
    <>
      <Seo title={title} description={intro} jsonLd={breadcrumbSchema([ROOT, INVOLVED, crumb])} />
      <PageHeader title={title} intro={intro} crumbs={[ROOT, INVOLVED, crumb]} image={image} />
      <Section tone="cream">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <ImageFrame src={image} alt={imageAlt} className="rounded-xl" />
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-xl font-semibold text-maroon-700">What to expect</h2>
              <ul className="mt-4 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-ink-900">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-maroon-700" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
            </div>
            {aside}
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-8">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon-700">Register your interest</h2>
            <EnquiryForm formName={`${slug}_form`} schema={schema} fields={fields} inbox={inbox} submitLabel={submitLabel} />
          </div>
        </div>
      </Section>
    </>
  );
}

export function VolunteerPage() {
  return (
    <FormPage
      slug="volunteer"
      title="Volunteer"
      intro="Help at medical camps, community programmes, events and communications. No prior experience needed — just commitment."
      image="/images/free/volunteer.webp"
      imageAlt="Volunteer at a community event"
      points={["Serve at monthly outreach camps and events", "Weekend, weekday or occasional roles", "Join a community of Sai Youth and volunteers"]}
      schema={volunteerSchema}
      fields={volunteerFields}
      inbox={ENQUIRY_INBOXES.Volunteering}
      submitLabel="Register as Volunteer"
    />
  );
}

export function MedicalVolunteerPage() {
  return (
    <FormPage
      slug="medical-volunteer"
      title="Become a Medical Volunteer"
      intro="Doctors, nurses and allied health professionals: give a few hours a month at our camps and Sai Swasthya centres."
      image="/images/site/pediatric-echo-screening.webp"
      imageAlt="Doctor screening a child"
      points={["Specialist camps: dental, eye, gynaecology, orthopaedics and more", "In-person or teleconsultation", "Registration details verified before onboarding"]}
      schema={medicalSchema}
      fields={medicalFields}
      inbox={ENQUIRY_INBOXES["Healthcare Enquiries"]}
      submitLabel="Register as Medical Volunteer"
    />
  );
}

export function ExpertisePage() {
  return (
    <FormPage
      slug="share-expertise"
      title="Share Your Expertise"
      intro="Technology, design, finance, legal, training or communications — skills-based volunteering multiplies our impact."
      image="/images/site/reprogramming-lives-session.webp"
      imageAlt="Re-Programming Lives training session"
      points={["Mentor rural youth in Re-Programming Lives", "Support our systems, design and communications", "Flexible, remote-friendly contributions"]}
      schema={expertiseSchema}
      fields={expertiseFields}
      inbox={ENQUIRY_INBOXES.Volunteering}
      submitLabel="Offer My Expertise"
    />
  );
}
