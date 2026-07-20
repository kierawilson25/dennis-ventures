import type { IconName } from "@/components/ui/icons";

/**
 * Home page copy. Every string the page renders lives here as a typed field —
 * components never inline copy. Transcribed verbatim from HTML files/home-code.html.
 */

export const hero = {
  badge: "Executive & Health Coaching",
  // The export splits the h1 with a <span class="text-secondary"> on the last
  // two words; the component owns that markup, this owns the words.
  headline: {
    lead: "Empowering Transitions with",
    accent: "Calm & Clarity",
  },
  lede:
    "A steady hand in your sea of change. We coach across health, life, career transitions, and executive growth, whatever comes next.",
  primaryCta: { href: "/contact", label: "Start Your Journey" },
  secondaryCta: { href: "/solutions", label: "View Solutions" },
} as const;

export const mission = {
  heading: "Our Mission",
  // Filled 2026-07-19 from founder-provided content (see designs/founder-content.md).
  // Synthesized from Tosha Dennis's stated mission ("reset, refocus, and thrive")
  // and the company capability summary — no facts invented. Closes D2 for Home.
  statement:
    "Our mission is to help people reset, refocus, and thrive. Through structured, accountability-based coaching, we drive sustainable behavior change that strengthens resilience, health, and performance across the federal, military, and corporate communities we serve.",
} as const;

export const intro = {
  heading: "A Veteran-Owned Perspective on Growth.",
  paragraphs: [
    "Dennis Ventures LLC is founded on the principles of disciplined leadership and holistic well-being. We understand that career transitions require more than just strategy; they require mental clarity and emotional resilience.",
    "Our mission is to bridge the gap between rigorous organizational standards and human-centric growth. We serve executives and government partners with the same steady, focused hand that defined our military service.",
  ],
} as const;

type Service = {
  icon: IconName;
  iconWell: "lavender" | "aqua" | "lavender-soft";
  accent: "lavender" | "accent";
  title: string;
  body: string;
};

export const services: readonly Service[] = [
  {
    icon: "clinical_notes",
    iconWell: "lavender",
    accent: "lavender",
    title: "Health Coaching",
    body: "Optimizing vitality for leaders who cannot afford to burn out.",
  },
  {
    icon: "schema",
    iconWell: "aqua",
    accent: "accent",
    title: "Executive Strategy",
    body: "Navigating high-stakes environments with precision and authority.",
  },
  {
    icon: "sync",
    iconWell: "lavender-soft",
    accent: "lavender",
    title: "Strategic Transition",
    body: "Guiding you through the transition as one phase of life ends and the next begins with clarity and purpose.",
  },
] as const;

export const cta = {
  heading: "Ready for Your Next Chapter?",
  body: "Whether you're transitioning out of uniform or scaling your executive presence, we provide the clarity to navigate the path forward.",
  action: { href: "/contact", label: "Start Your Journey" },
} as const;
