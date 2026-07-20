import type { Metadata } from "next";
import Image from "next/image";
import oceanImage from "../../../public/images/solutions-ocean.png";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/icons";
import { certificationList } from "@/content/site";
import { cta, hero, offerings, transitions } from "@/content/solutions";

export const metadata: Metadata = {
  // Root layout wraps this as "Dennis Ventures | Solutions".
  title: "Solutions",
};

export default function SolutionsPage() {
  return (
    <>
      {/* Hero — centered, on a one-off lavender→transparent band. Single caller,
          so the gradient is inline (same rationale as Home's Mission band). */}
      <section
        className="py-section"
        style={{
          background:
            "linear-gradient(rgba(230,230,250,0.8) 0%, rgba(230,230,250,0) 100%)",
        }}
      >
        <Container className="text-center">
          <div className="mx-auto max-w-4xl">
            <Badge>
              <Icon name="verified_user" size={20} className="text-accent" />
              {hero.badge}
            </Badge>
            <h1 className="mt-6 text-headline-xl-tight leading-tight text-ink md:text-headline-xl">
              {hero.headline.lead}{" "}
              <span className="text-accent">{hero.headline.accent}</span>
              <br className="hidden md:block" /> {hero.headline.tail}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-ink-muted">
              {hero.lede}
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href={hero.primaryCta.href} size="md">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="outline" size="md">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Coaching Offerings — "How We Help". The export put this section on an
          undefined utility class; rendered on plain surface instead. */}
      <section id="offerings" className="bg-surface py-section">
        <Container>
          <SectionHeading title={offerings.heading} align="center" size="lg" />
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {offerings.items.map((offering) => (
              <Card
                key={offering.title}
                title={offering.title}
                icon={<Icon name={offering.icon} />}
                iconWell={offering.iconWell}
                accent={offering.accent}
              >
                {offering.body}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Strategic Transitions — 2-column at lg (later than the other pages),
          on a one-off faint aqua radial glow. Left: heading + certs. Right: the
          framed ocean image. */}
      <section
        className="py-section"
        style={{
          background:
            "radial-gradient(circle, rgba(0,168,204,0.08) 0%, rgba(247,249,251,0) 70%)",
        }}
      >
        <Container>
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
            <div className="flex-1">
              <SectionHeading
                title={transitions.heading}
                lede={transitions.lede}
                size="lg"
              />
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {certificationList.map((cert) => (
                  <div
                    key={cert.abbr}
                    className="glass-card flex gap-4 rounded-xl p-6"
                  >
                    <Icon
                      name={cert.icon}
                      size={32}
                      className="shrink-0 text-accent"
                    />
                    <div>
                      <h3 className="text-headline-md font-bold text-ink">
                        {cert.abbr}
                      </h3>
                      <p className="mt-1 text-body-md text-ink-muted">
                        {cert.full}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-2 rounded-xl bg-gradient-to-r from-accent/20 to-lavender/40 opacity-30 blur-xl"
                />
                <div className="relative overflow-hidden rounded-xl border border-outline-soft/30 shadow-2xl">
                  <div className="relative h-[500px] w-full">
                    <Image
                      src={oceanImage}
                      alt={transitions.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      placeholder="blur"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner {...cta} />
    </>
  );
}
