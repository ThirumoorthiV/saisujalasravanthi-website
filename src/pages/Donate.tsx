import { useState } from "react";
import { Check, Copy, ExternalLink, FileCheck2, Globe2, HandHeart, IndianRupee, Mail, QrCode } from "lucide-react";
import { DONATION } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ImageFrame, MediaCard } from "@/components/ui/Cards";
import { Section, SectionHeading } from "@/components/ui/Primitives";
import { breadcrumbSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const CRUMB = { name: "Donate", path: "/donate/" };

// Real outcomes from the existing website — what past support has achieved.
const GIFT_AT_WORK = [
  { image: "/images/site/pediatric-heart-screening-niloufer.webp", stat: "6,000+", label: "children screened for heart conditions, with 150+ free surgeries", to: "/programmes/healthcare/pediatric-heart-screening/" },
  { image: "/images/site/aushadhalayam-distribution-2.webp", stat: "₹65 lakh", label: "of free medicines supplied to 5 free-care centres", to: "/programmes/healthcare/aushadhalayam/" },
  { image: "/images/site/sai-swasthya-centre-3.webp", stat: "18", label: "Sai Swasthya centres offering free primary care", to: "/programmes/healthcare/sai-swasthya/" },
  { image: "/images/site/timmayapalli-underground-drainage.webp", stat: "100+", label: "village homes connected to underground drainage", to: "/programmes/rural-development/water-sanitation/" },
];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — value is still selectable */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-200 py-3 last:border-0">
      <div className="min-w-0">
        <dt className="text-sm text-ink-600">{label}</dt>
        <dd className="break-words font-semibold text-ink-900">{value}</dd>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-maroon-700 hover:bg-maroon-100"
      >
        {copied ? <Check size={18} className="text-success" aria-hidden /> : <Copy size={18} aria-hidden />}
      </button>
    </div>
  );
}

export default function Donate() {
  const f = DONATION.fcra;
  return (
    <>
      <Seo
        title="Donate — Support Free Healthcare & Rural Development"
        description="Donate to Sri Sathya Sai Sujala Sravanthi Trust. Indian donors can give online; NRI and foreign donors give via our SBI FCRA account."
        jsonLd={breadcrumbSchema([ROOT, CRUMB])}
      />
      <PageHeader
        title="Support Our Work"
        intro="Every service we offer is free. Your gift keeps it that way — for a child needing heart surgery, a village needing clean water, a family needing medicines."
        crumbs={[ROOT, CRUMB]}
        image="/images/free/donation-make-a-change.webp"
      >
        <ButtonLink to={DONATION.domesticUrl} variant="light">
          <IndianRupee size={18} aria-hidden /> Donate Online (India)
        </ButtonLink>
        <ButtonLink to="#fcra-donations" variant="outline-light">
          <Globe2 size={18} aria-hidden /> NRI & Foreign Donors
        </ButtonLink>
      </PageHeader>

      <Section tone="cream">
        <SectionHeading eyebrow="Your gift at work" title="What support has already made possible" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GIFT_AT_WORK.map((g) => (
            <MediaCard key={g.stat} image={g.image} title={g.stat} text={g.label} cta="Learn more" to={g.to} />
          ))}
        </div>
      </Section>

      <Section tone="white" id="ways-to-give">
        <SectionHeading eyebrow="How to donate" title="Choose how you'd like to give" align="center" />
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Indian donors */}
          <div id="indian-donations" className="flex flex-col rounded-2xl bg-maroon-50 p-6 ring-1 ring-ink-200 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-700 text-gold-500">
                <IndianRupee aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-maroon-700">Indian Donors</h2>
                <p className="text-sm text-ink-600">Donations to our Indian domestic bank account</p>
              </div>
            </div>
            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-ink-900">Give securely online, or scan the QR code with any UPI app.</p>
                <ButtonLink to={DONATION.domesticUrl} className="mt-5">
                  Donate Now <ExternalLink size={16} aria-hidden />
                </ButtonLink>
                <p className="mt-3 text-xs text-ink-600">You'll be taken to our secure donation page on saiaarogya.hospital.</p>
              </div>
              <figure className="mx-auto rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-ink-200">
                <img src={DONATION.qr} alt="QR code for donating to Sri Sathya Sai Sujala Sravanthi Trust" className="h-44 w-44" loading="lazy" />
                <figcaption className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-maroon-700">
                  <QrCode size={14} aria-hidden /> Scan to donate
                </figcaption>
              </figure>
            </div>
            <div className="mt-auto pt-6">
              <ImageFrame src="/images/site/aushadhalayam-family.webp" alt="A family supported by the Trust's free healthcare" aspect="aspect-[16/9]" className="rounded-xl" />
            </div>
          </div>

          {/* FCRA */}
          <div id="fcra-donations" className="scroll-mt-36 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-200 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-700 text-gold-500">
                <Globe2 aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-maroon-700">NRI & International Donors</h2>
                <p className="text-sm text-ink-600">FCRA bank transfer only</p>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-gold-100 p-3 text-sm text-ink-900">
              In compliance with the FCRA Act, 2010, foreign contributions are received <strong>only</strong> into our official SBI FCRA account
              by direct bank transfer.
            </p>
            <dl className="mt-4">
              <CopyRow label="Account name" value={f.trustName} />
              <CopyRow label="Account number" value={f.accountNo} />
              <CopyRow label="IFSC" value={f.ifsc} />
              <CopyRow label="SWIFT code" value={f.swift} />
              <CopyRow label="Bank & branch" value={`${f.bank}, ${f.branch}`} />
              <CopyRow label="Bank address" value={f.bankAddress} />
              <CopyRow label="FCRA registration no." value={`${f.registrationNo} (registered ${f.registrationDate})`} />
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-maroon-700 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <Mail className="mt-1 shrink-0 text-gold-500" aria-hidden />
            <p>
              After your transfer, email the transaction receipt to{" "}
              <a href={`mailto:${DONATION.receiptEmail}`} className="font-semibold text-gold-100 underline">
                {DONATION.receiptEmail}
              </a>{" "}
              for acknowledgement and an official receipt.
            </p>
          </div>
          <ButtonLink to="/transparency/" variant="outline-light">
            <FileCheck2 size={18} aria-hidden /> View FCRA Reports
          </ButtonLink>
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading eyebrow="Other ways to give" title="More ways to make a difference" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "CSR Partnership", text: "Fund a Sai Swasthya centre, heart surgeries or village sanitation — with 100% transparency in fund utilisation.", to: "/csr-partnerships/", cta: "Explore CSR projects", image: "/images/free/csr-handshake.webp" },
            { title: "Donate Medicines", text: "Pharma companies can give medicines or supply at manufacturing cost through Aushadhalayam.", to: "/programmes/healthcare/aushadhalayam/", cta: "About Aushadhalayam", image: "/images/site/aushadhalayam-pharmacy.webp" },
            { title: "Give Your Time", text: "Volunteer at camps and programmes, or share your medical or professional expertise.", to: "/get-involved/", cta: "Get involved", image: "/images/free/volunteer.webp" },
          ].map(({ title, text, to, cta, image }) => (
            <MediaCard key={title} image={image} title={title} text={text} cta={cta} to={to} />
          ))}
        </div>
        <p className="mt-10 flex items-center justify-center gap-2 text-center text-ink-600">
          <HandHeart className="text-maroon-700" size={20} aria-hidden /> Thank you — every helping hand counts.
        </p>
      </Section>
    </>
  );
}
