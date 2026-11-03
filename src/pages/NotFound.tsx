import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Primitives";
import { Seo } from "@/lib/seo";

export default function NotFound() {
  return (
    <Section tone="cream" className="text-center">
      <Seo title="Page not found" description="The page you were looking for could not be found." />
      <p className="font-heading text-7xl font-bold text-maroon-700">404</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold">We couldn't find that page</h1>
      <p className="mt-3 text-ink-600">It may have moved as part of our new website.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Go to homepage</ButtonLink>
        <ButtonLink to="/programmes/" variant="secondary">
          Our Programmes
        </ButtonLink>
      </div>
    </Section>
  );
}
