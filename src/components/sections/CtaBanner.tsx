import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * The lavender CTA banner with the dotted-aqua field. Identical across Home,
 * About, and Solutions in the exports, so it's prop-driven and page-agnostic —
 * F2 and F3 reuse it without modification.
 */
export function CtaBanner({
  heading,
  body,
  action,
}: {
  heading: string;
  body: string;
  action: { href: string; label: string };
}) {
  return (
    <section className="py-section">
      <Container>
        <div className="relative overflow-hidden rounded-xl bg-lavender p-12 text-center md:p-24">
          {/* .cta-dots defined once in globals.css */}
          <div aria-hidden className="cta-dots absolute inset-0 opacity-10" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-headline-xl-tight text-ink md:text-headline-xl">
              {heading}
            </h2>
            <p className="mt-6 text-body-lg text-ink-muted">{body}</p>
            <Button href={action.href} size="lg" className="mt-10">
              {action.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
