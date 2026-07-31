import type { Metadata } from "next";
import Image from "next/image";
import backdrop from "../../../public/images/contact-backdrop.jpg";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/sections/ContactForm";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { bookingCta } from "@/content/site";
import { cta, header, imagery } from "@/content/contact";

export const metadata: Metadata = {
  // Root layout wraps this as "Dennis Ventures | Contact".
  title: "Contact",
  description:
    "Start a conversation with Dennis Ventures — veteran-owned executive and health coaching for transitioning service members, executives, and government partners.",
};

export default function ContactPage() {
  return (
    <>
      {/* .hero-gradient is defined in globals.css; layout.tsx owns <main>, so
          this section is the page's top-level element. pt-32 clears the
          fixed TopNav. */}
      <section className="hero-gradient pb-section pt-32">
        <Container>
          <div className="mx-auto mb-16 max-w-3xl space-y-6 text-center">
            <Badge>{header.badge}</Badge>
            <h1 className="text-headline-xl-tight leading-tight text-ink md:text-headline-xl">
              {header.heading}
            </h1>
            <p className="text-body-lg leading-relaxed text-ink-muted">
              {header.lede}
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Imagery column. The export used a CSS background on an expiring
                lh3 URL; converted to next/image fill in a responsive frame so it
                never collapses when stacked (the export's h-full had no row
                height). 512px preview shipped as-is (PRD.md D3) — flagged. */}
            <div className="lg:col-span-5">
              <div className="relative h-72 overflow-hidden rounded-xl shadow-2xl sm:h-96 lg:h-full lg:min-h-[32rem]">
                <Image
                  src={backdrop}
                  alt={imagery.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                {/* Dark gradient overlay (export line 152), painted above the
                    image by DOM order. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-headline-md font-bold">
                    {imagery.overlineTitle}
                  </p>
                  <p className="mt-2 text-body-lg opacity-90">
                    {imagery.overlineSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Compact closing prompt — half-height CtaBanner, no export precedent.
          action reuses site.bookingCta directly: a placeholder href until the
          founder's Google Meet booking link exists (see content/contact.ts). */}
      <CtaBanner
        heading={cta.heading}
        body={cta.body}
        action={bookingCta}
        size="sm"
      />
    </>
  );
}
