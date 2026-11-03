import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ENQUIRY_INBOXES, SITE } from "@/data/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Logo } from "./Header";

const COLUMNS = [
  {
    title: "About",
    links: [
      { label: "About the Trust", to: "/about-us/" },
      { label: "Vision & Mission", to: "/about-us/vision-mission/" },
      { label: "Our Journey", to: "/about-us/our-journey/" },
      { label: "Leadership", to: "/about-us/leadership/" },
      { label: "Our Network", to: "/about-us/our-network/" },
      { label: "Our Impact", to: "/impact/" },
    ],
  },
  {
    title: "Programmes",
    links: [
      { label: "Healthcare", to: "/programmes/healthcare/" },
      { label: "Rural Development", to: "/programmes/rural-development/" },
      { label: "Education", to: "/programmes/education/" },
      { label: "Community Empowerment", to: "/programmes/community-empowerment/" },
      { label: "Events", to: "/events/" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Volunteer", to: "/get-involved/volunteer/" },
      { label: "Medical Volunteer", to: "/get-involved/medical-volunteer/" },
      { label: "CSR Partnerships", to: "/csr-partnerships/" },
      { label: "Donate", to: "/donate/" },
      { label: "Stories & Updates", to: "/stories/" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { label: "FCRA", to: "/transparency/fcra/" },
      { label: "Annual Reports", to: "/transparency/annual-reports/" },
      { label: "Financial Reports", to: "/transparency/financial-reports/" },
      { label: "Policies", to: "/transparency/policies/" },
      { label: "Gallery", to: "/gallery/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-maroon-900 text-maroon-100">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <div className="inline-block rounded-lg bg-cream px-3 py-2">
              <Logo className="h-14" />
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Free healthcare, rural development, education and community outreach for underserved communities since {SITE.founded}.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-500" aria-hidden />
                <span className="flex flex-col gap-1">
                  {SITE.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="whitespace-nowrap hover:text-white">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-500" aria-hidden />
                <a href={`mailto:${ENQUIRY_INBOXES["General Enquiries"]}`} className="break-all hover:text-white">
                  {ENQUIRY_INBOXES["General Enquiries"]}
                </a>
              </li>
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-heading text-lg font-semibold text-white">{col.title}</h2>
              <div className="mb-4 mt-2 h-0.5 w-10 bg-gold-500" />
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-gold-500/30 pt-6 text-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>{SITE.registrationNote}</p>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-white">Follow us</span>
              <SocialLinks source="footer" tone="dark" />
            </div>
          </div>
          <p className="mt-4 text-xs text-maroon-100/80">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved. ·{" "}
            <Link to="/privacy-policy/" className="hover:text-white">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link to="/terms-and-conditions/" className="hover:text-white">
              Terms and Conditions
            </Link>{" "}
            ·{" "}
            <Link to="/refund-policy/" className="hover:text-white">
              Refund Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
