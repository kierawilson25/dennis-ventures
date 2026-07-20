import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { AccentRule } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/icons";
import { cta, intro, mission, services } from "@/content/home";

export const metadata: Metadata = {
  // Root layout wraps this as "Dennis Ventures | …" via its title template.
  title: "Empowering Transitions with Calm & Clarity",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Mission — the four-stop lavender band. This gradient is genuinely
          one-off (one section, one use), so an inline style beats minting a
          token or utility for a single caller. */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #e6e6fa 20%, #e6e6fa 80%, #f4fafd 100%)",
        }}
      >
        <Container className="text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-headline-xl-tight text-ink md:text-headline-xl">
              {mission.heading}
            </h2>
            <p className="mt-8 text-body-lg leading-relaxed text-ink-muted">
              {mission.statement}
            </p>
          </div>
        </Container>
      </section>

      {/* Introduction — 5/7 asymmetric grid, then the service bento. */}
      <section className="bg-surface pb-24">
        <Container>
          <div className="grid items-center gap-gutter md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="text-headline-lg-tight text-ink md:text-headline-lg">
                {intro.heading}
              </h2>
              <AccentRule className="mt-6" />
            </div>
            <div className="md:col-span-7">
              {intro.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-body-lg leading-relaxed text-ink-muted [&:not(:first-child)]:mt-6"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                title={service.title}
                icon={<Icon name={service.icon} />}
                iconWell={service.iconWell}
                accent={service.accent}
              >
                {service.body}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner {...cta} />
    </>
  );
}
