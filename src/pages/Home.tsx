import { ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { EVENTS, sortByDateDesc } from "@/data/events";
import { SITE } from "@/data/site";
import { STORIES } from "@/data/stories";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard, ImageFrame, MediaCard, StoryCard } from "@/components/ui/Cards";
import { Section, SectionHeading, Tag } from "@/components/ui/Primitives";
import { CsrBand, GetInvolvedCards, ImpactAtAGlance } from "@/components/sections/Shared";
import { Icon } from "@/lib/icons";
import { organisationSchema, Seo } from "@/lib/seo";
import type { IconName } from "@/types";

const CORE_AREAS: { title: string; label: string; text: string; icon: IconName; to: string; image: string }[] = [
  { title: "Healthcare", label: "Health", text: "Free primary care, hospital services and specialist screening.", icon: "HeartPulse", to: "/programmes/healthcare/", image: "/images/site/pediatric-echo-screening.webp" },
  { title: "Rural Development", label: "Rural", text: "Underground drainage, toilets, borewells and defluoridation plants.", icon: "Droplets", to: "/programmes/rural-development/", image: "/images/site/drinking-water-tank.webp" },
  { title: "Education", label: "Education", text: "Girl child education and value-based learning.", icon: "GraduationCap", to: "/programmes/education/", image: "/images/free/girls-studying.webp" },
  { title: "Community Outreach", label: "Community", text: "Women & child welfare, skills and de-addiction.", icon: "Users", to: "/programmes/community-empowerment/", image: "/images/site/community-women.webp" },
  { title: "Preventive Healthcare", label: "Prevention", text: "Outreach camps, health cards and awareness programmes.", icon: "Tent", to: "/programmes/healthcare/medical-camps/", image: "/images/site/outreach-camp-consultations.webp" },
  { title: "CSR Partnerships", label: "CSR", text: "Measurable projects with transparent reporting.", icon: "Handshake", to: "/csr-partnerships/", image: "/images/free/csr-handshake.webp" },
];

export default function Home() {
  const stories = [...STORIES].sort((a, b) => b.publishDate.localeCompare(a.publishDate)).slice(0, 3);
  const upcoming = EVENTS.filter((e) => e.status === "Upcoming").sort((a, b) => a.startDate.localeCompare(b.startDate));
  const events = [...upcoming, ...sortByDateDesc(EVENTS.filter((e) => e.status === "Completed"))].slice(0, 3);

  return (
    <>
      <Seo
        title={`${SITE.name} — Free Healthcare & Rural Development in Telangana`}
        description="Free healthcare, rural development, education and community outreach across Telangana and Andhra Pradesh since 2012."
        jsonLd={organisationSchema}
      />

      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-maroon-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-700 via-maroon-900 to-maroon-900" aria-hidden />
        <div className="absolute -right-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border-[40px] border-maroon-600/30" aria-hidden />
        <div className="absolute right-24 top-16 h-40 w-40 rounded-full bg-gold-500/10" aria-hidden />
        <div className="relative mx-auto grid max-w-content items-center gap-8 md:gap-10 px-4 py-12 sm:px-6 sm:py-20 md:py-28 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black sm:px-4 sm:py-1.5 sm:text-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-maroon-700" aria-hidden /> {SITE.motto} · {SITE.submotto}
            </p>
            <h1 className="mt-5 font-heading text-[28px] font-bold leading-[1.15] sm:mt-6 sm:text-[32px] md:text-5xl lg:text-[56px]">
              Serving Communities.
              <br />
              Transforming Lives.
              <br />
              <span className="text-gold-500">Zero Cost.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-maroon-100 sm:mt-6 sm:text-lg">
              Through free healthcare, rural development, education and community outreach, Sai Sujala Sravanthi works to create healthier
              and more empowered communities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <ButtonLink to="/programmes/" variant="light">
                Explore Our Programmes <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink to="/csr-partnerships/" variant="outline-light">
                <Briefcase size={18} aria-hidden /> Partner With Us
              </ButtonLink>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-4 lg:grid">
            <ImageFrame
              src="/images/site/pediatric-heart-screening-niloufer.webp"
              alt="Paediatric cardiologists screening an infant at Niloufer Hospital"
              aspect="aspect-[16/9]"
              className="col-span-2 rounded-2xl ring-4 ring-white/10"
              eager
            />
            <ImageFrame src="/images/site/outreach-medical-camp.webp" alt="Doctors at a monthly outreach medical camp" className="rounded-2xl ring-4 ring-white/10" eager />
            <ImageFrame src="/images/site/girls-classroom.webp" alt="Girl students in a classroom" className="rounded-2xl ring-4 ring-white/10" eager />
          </div>
        </div>
      </section>

      {/* 2. Who we are */}
      <Section tone="cream">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <ImageFrame src="/images/site/sai-swasthya-centre-2.webp" alt="Opening of a Sai Swasthya wellness centre" aspect="aspect-[16/10]" className="col-span-2 rounded-2xl" />
            <ImageFrame src="/images/site/aushadhalayam-distribution-1.webp" alt="Volunteers distributing free medicines" className="rounded-xl" />
            <ImageFrame src="/images/site/outreach-camp-consultations.webp" alt="Consultations at an outreach camp" className="rounded-xl" />
          </div>
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="Sri Sathya Sai Sujala Sravanthi Trust"
              intro="Established in 2012 under the guidance of Sri Madhusudan Sai, the Trust improves the quality of life in rural and underserved communities through drinking water, sanitation, rural infrastructure, education, nutrition and healthcare — every service free of charge."
            />
            <ul className="space-y-3">
              {[
                "Run entirely by volunteers",
                "Free primary and secondary healthcare across Andhra Pradesh and Telangana",
                "100% transparency in fund utilisation",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-ink-900">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-maroon-700" size={20} aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <ButtonLink to="/about-us/" variant="secondary" className="mt-8">
              About the Trust
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* 3. Core areas */}
      <Section tone="tint">
        <SectionHeading eyebrow="What we do" title="Our core areas" align="center" />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_AREAS.map((a) => (
            <MediaCard key={a.title} image={a.image} title={a.title} text={a.text} cta="Explore" to={a.to} meta={<Tag><Icon name={a.icon} size={14} /> {a.label}</Tag>} />
          ))}
        </div>
      </Section>

      {/* 4. Impact */}
      <ImpactAtAGlance />

      {/* 5. Featured stories */}
      <Section tone="cream">
        <SectionHeading eyebrow="Stories & updates" title="Stories of change" action={{ label: "Read Our Stories", to: "/stories/" }} />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </Section>

      {/* 6. Latest events */}
      <Section tone="white">
        <SectionHeading eyebrow="Events" title="Camps, drives & community programmes" action={{ label: "All events", to: "/events/" }} />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </Section>

      {/* 7. CSR */}
      <CsrBand />

      {/* 8. Get involved */}
      <GetInvolvedCards />
    </>
  );
}
