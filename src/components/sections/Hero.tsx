import Image from "next/image";
import heroImage from "../../../public/images/home-hero.png";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/home";

/**
 * Home hero. Layers, painting order matters:
 *   1. <Image fill> — the pale sunrise photo (LCP element; `priority`)
 *   2. gradient overlay div — fades the photo into the surface toward the bottom
 *   3. content, lifted above both with `relative z-10`
 *
 * No negative z-index: the image and gradient are both absolute, and the
 * gradient paints above the image purely by DOM order.
 *
 * The content block is top-anchored at a fixed offset (pt-36) rather than
 * vertically centered in the full-height section. Centering made the gap
 * between the fixed nav and the badge depend on viewport height (and needed
 * a desktop-only negative margin to compensate); a fixed offset keeps that
 * gap consistent across screen sizes and sits higher up on tall viewports.
 * The section stays min-h-screen so the photo still fills the viewport.
 *
 * Two fixes vs HTML files/home-code.html:
 *  - Defect 1: the lede is one styled <p>, not an empty <p> + <br> spacers +
 *    raw text. The export's markup was malformed.
 *  - Defect 3: the export put `hero-gradient` on this section, but its inline
 *    background-image overrode it — so it's omitted here (Contact uses it for real).
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen items-start overflow-hidden pt-36">
      <Image
        src={heroImage}
        // Decorative: a pale sunrise over open water. The <h1> carries all
        // meaning, so an empty alt is the correct accessible choice.
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(244,250,253,0.1) 0%, rgba(244,250,253,0.4) 50%, rgba(244,250,253,1) 100%)",
        }}
      />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl">
          <Badge>{hero.badge}</Badge>
          <h1 className="mt-6 text-headline-xl-tight leading-tight text-ink md:text-headline-xl">
            {hero.headline.lead}{" "}
            <span className="text-accent">{hero.headline.accent}</span>
          </h1>
          <p className="mx-auto mt-[90px] max-w-xl text-body-lg text-ink-muted">
            {hero.lede}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
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
  );
}
