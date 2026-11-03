import { Briefcase, HandHeart, Stethoscope } from "lucide-react";
import { IMPACT_METRICS } from "@/data/impact";
import { ButtonLink } from "@/components/ui/Button";
import { MediaCard, StatBlock } from "@/components/ui/Cards";
import { Section, SectionHeading } from "@/components/ui/Primitives";

type Tone = "cream" | "white" | "tint";

export function ImpactAtAGlance({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="Impact at a glance"
        title="Numbers that represent real lives"
        intro="Every figure shows its period and the date it was last updated."
        action={{ label: "See impact dashboard", to: "/impact/dashboard/" }}
      />
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {IMPACT_METRICS.slice(0, 4).map((m, i) => (
          <StatBlock key={m.id} metric={m} dark={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

export function CsrBand() {
  return (
    <section className="relative overflow-hidden bg-maroon-700 text-white">
      <div className="absolute -left-20 top-0 h-full w-1/2 skew-x-12 bg-maroon-600/40" aria-hidden />
      <div className="relative mx-auto flex max-w-content flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">CSR Partnerships</p>
          <h2 className="mt-2 font-heading text-[26px] font-semibold leading-tight md:text-4xl">
            Partner with us to create measurable social impact.
          </h2>
          <p className="mt-3 text-maroon-100">
            Established rural network, healthcare expertise and transparent reporting for every rupee invested.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/csr-partnerships/" variant="light">
            <Briefcase size={18} aria-hidden /> Partner With Us
          </ButtonLink>
          <ButtonLink to="/csr-partnerships/csr-enquiry/" variant="outline-light">
            Request a CSR Discussion
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export const INVOLVE_ACTIONS = [
  { title: "Volunteer", text: "Join our service activities at camps, events and programmes.", to: "/get-involved/volunteer/", cta: "Volunteer", image: "/images/free/volunteer.webp" },
  { title: "CSR Partnership", text: "Fund measurable projects in healthcare, water and education.", to: "/csr-partnerships/", cta: "Partner With Us", image: "/images/free/csr-handshake.webp" },
  { title: "Support Our Work", text: "Donate to free healthcare, education or rural development.", to: "/donate/", cta: "Donate", image: "/images/free/helping-hands.webp" },
  { title: "Contact Us", text: "Questions, media or healthcare enquiries — we'll route you.", to: "/contact-us/", cta: "Contact Us", image: "/images/free/helping-hand-reach.webp" },
];

export function GetInvolvedCards({ tone = "tint" }: { tone?: Tone }) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow="Get involved" title="Every helping hand counts" align="center" intro="Choose how you'd like to make a difference." />
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INVOLVE_ACTIONS.map((a) => (
          <MediaCard key={a.title} image={a.image} title={a.title} text={a.text} cta={a.cta} to={a.to} />
        ))}
      </div>
    </Section>
  );
}

export function MedicalVolunteerBanner() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl bg-gold-100 p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <Stethoscope className="shrink-0 text-maroon-700" size={32} aria-hidden />
        <div>
          <h3 className="text-xl font-semibold text-maroon-700">Are you a doctor or healthcare professional?</h3>
          <p className="text-ink-600">Give a few hours a month at our camps and centres.</p>
        </div>
      </div>
      <ButtonLink to="/get-involved/medical-volunteer/">
        <HandHeart size={18} aria-hidden /> Become a Medical Volunteer
      </ButtonLink>
    </div>
  );
}
