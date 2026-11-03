import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ENQUIRY_INBOXES, SITE } from "@/data/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiryForm } from "@/components/ui/Form";
import { Section } from "@/components/ui/Primitives";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { contactFields, contactSchema } from "@/lib/forms";
import { breadcrumbSchema, organisationSchema, Seo } from "@/lib/seo";

const ROOT = { name: "Home", path: "/" };
const CRUMB = { name: "Contact Us", path: "/contact-us/" };

// Coordinates of the Trust's own Google Maps listing (8-2-601/P/1, Panchavati
// Colony Rd, Banjara Hills — plus code 7J9WC96M+2V). Geocoding the street address
// instead lands on the wrong road, so the map and directions use these exact points.
const OFFICE = { lat: 17.4101092, lng: 78.3846958 };
const MAP_QUERY = `${OFFICE.lat},${OFFICE.lng}`;
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&z=17&output=embed`;

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Contact Sai Sujala Sravanthi in Hyderabad for CSR partnerships, volunteering, healthcare enquiries or media."
        jsonLd={[organisationSchema, breadcrumbSchema([ROOT, CRUMB])]}
      />
      <PageHeader
        title="Contact Us"
        intro="Choose your enquiry type and we'll route your message to the right team."
        crumbs={[ROOT, CRUMB]}
        image="/images/free/helping-hand-reach.webp"
      />
      <Section tone="cream">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-2xl font-semibold text-maroon-700">Hyderabad office</h2>
              <ul className="mt-5 space-y-4">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-maroon-700" aria-hidden />
                  <span>
                    {SITE.address}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm font-semibold text-maroon-700 hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 shrink-0 text-maroon-700" aria-hidden />
                  <span className="flex flex-col gap-1">
                    {SITE.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:underline">
                        {p}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 shrink-0 text-maroon-700" aria-hidden />
                  <span className="flex flex-col gap-1">
                    {SITE.emails.map((e) => (
                      <a key={e} href={`mailto:${e}`} className="break-all hover:underline">
                        {e}
                      </a>
                    ))}
                  </span>
                </li>
                {SITE.whatsapp && (
                  <li className="flex items-center gap-3">
                    <MessageCircle className="shrink-0 text-maroon-700" aria-hidden />
                    <a href={`https://wa.me/${SITE.whatsapp}`} className="hover:underline">
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70">
              <h2 className="font-heading text-xl font-semibold text-maroon-700">Follow us</h2>
              <p className="mb-4 mt-1 text-sm text-ink-600">News, camp updates and stories from the field.</p>
              <SocialLinks source="contact_page" />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-8">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon-700">Send us a message</h2>
            <EnquiryForm formName="contact" schema={contactSchema} fields={contactFields} inbox={ENQUIRY_INBOXES["General Enquiries"]} submitLabel="Send Message" />
          </div>
        </div>
      </Section>

      {/* Map — same content width as the section above */}
      <Section tone="cream" className="!pt-0">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 px-6 py-4">
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-maroon-700">
              <MapPin size={20} aria-hidden /> Find us
            </h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-maroon-700 hover:underline"
            >
              Get directions →
            </a>
          </div>
          <iframe
            title="Map of Sri Sathya Sai Sujala Sravanthi Trust office, Banjara Hills, Hyderabad"
            src={MAP_EMBED}
            className="block h-[380px] w-full border-0 md:h-[450px]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>
    </>
  );
}
