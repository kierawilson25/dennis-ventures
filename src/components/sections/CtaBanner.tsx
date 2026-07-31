import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The lavender CTA banner with the dotted-aqua field. Identical across Home,
 * About, and Solutions in the exports, so it's prop-driven and page-agnostic —
 * F2 and F3 reuse it without modification.
 *
 * `size="sm"` is a compact, roughly-half-height variant (Contact's "prefer to
 * start with a meeting?" prompt): smaller heading, no body paragraph, tighter
 * padding. `body` is optional so the compact variant can omit it; the default
 * `size="lg"` path is byte-for-byte the original markup.
 */
export function CtaBanner({
  heading,
  body,
  action,
  size = "lg",
}: {
  heading: string;
  body?: string;
  action: { href: string; label: string };
  size?: "lg" | "sm";
}) {
  const compact = size === "sm";

  return (
    // Every caller's preceding section already ends in its own bottom padding
    // (py-section or similar), so a full py-section here doubled the gap
    // above the box. Top is cut down; bottom keeps the full rhythm since this
    // is always the last section before the footer.
    <section className="pt-16 pb-section">
      <Container>
        <div
          className={cn(
            "relative overflow-hidden rounded-xl bg-lavender text-center",
            compact ? "p-6 md:p-12" : "p-12 md:p-24",
          )}
        >
          {/* .cta-dots defined once in globals.css */}
          <div aria-hidden className="cta-dots absolute inset-0 opacity-10" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2
              className={cn(
                "text-ink",
                compact
                  ? "text-headline-lg-tight md:text-headline-lg"
                  : "text-headline-xl-tight md:text-headline-xl",
              )}
            >
              {heading}
            </h2>
            {body ? (
              <p className="mt-6 text-body-lg text-ink-muted">{body}</p>
            ) : null}
            <Button
              href={action.href}
              size={compact ? "md" : "lg"}
              className={compact ? "mt-6" : "mt-10"}
            >
              {action.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
