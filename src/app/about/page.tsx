import type { Metadata } from "next";
import Image from "next/image";
import aboutImage from "../../../public/images/about-portrait.jpg";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/icons";
import { certificationList } from "@/content/site";
import { cta, hero, pillars, values } from "@/content/about";

export const metadata: Metadata = {
  // Root layout wraps this as "Dennis Ventures | Our Story".
  title: "Our Story",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero / Our Story — 2-column: text + framed mood image. */}
      <section className="py-section">
        <Container>
          <div className="grid items-center gap-gutter md:grid-cols-2">
            <div>
              <Badge>{hero.badge}</Badge>
              <h1 className="mt-6 text-headline-xl-tight leading-tight text-ink md:text-headline-xl">
                {hero.headline.lead}{" "}
                <span className="text-accent">{hero.headline.accent1}</span>{" "}
                {hero.headline.mid}{" "}
                <span className="text-accent">{hero.headline.accent2}</span>.
              </h1>
              <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-ink-muted">
                {hero.lede}
              </p>
              <Button href={hero.founderCta.href} className="mt-8">
                {hero.founderCta.label}
              </Button>
            </div>

            <div className="glass-card overflow-hidden rounded-xl p-2">
              <Image
                src={aboutImage}
                // Decorative interior mood image; conveys nothing the text
                // doesn't. 512px preview accepted as-is for now (D3).
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What Sets Us Apart — pillars + certification row. The transparent→
          lavender→transparent band is one-off, so the gradient is inline. */}
      <section
        className="relative overflow-hidden py-section"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #e6e6fa 20%, #e6e6fa 80%, transparent 100%)",
        }}
      >
        <Container>
          <SectionHeading
            title={pillars.heading}
            lede={pillars.lede}
            align="center"
            size="xl"
            className="mx-auto max-w-3xl"
          />

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {pillars.items.map((pillar) => (
              <Card
                key={pillar.title}
                title={pillar.title}
                icon={<Icon name={pillar.icon} />}
                iconWell={pillar.iconWell}
                accent={pillar.accent}
              >
                {pillar.body}
              </Card>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
            {certificationList.map((cert) => (
              <div key={cert.abbr} className="flex items-center gap-3">
                <Icon name="verified" size={24} className="text-accent" />
                <span className="text-label-sm font-bold uppercase tracking-wider text-ink-muted">
                  {cert.abbr} Certified
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Values — 1/3 heading + 2/3 numbered list. */}
      <section className="py-section">
        <Container>
          <div className="flex flex-col gap-gutter md:flex-row">
            <SectionHeading
              title={values.heading}
              lede={values.lede}
              size="lg"
              className="md:w-1/3"
            />
            <div className="flex flex-col gap-12 md:w-2/3">
              {values.items.map((value, i) => (
                <div key={value.title} className="flex items-start gap-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-headline-md font-bold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-body-md leading-relaxed text-ink-muted">
                      {value.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner {...cta} />
    </>
  );
}
