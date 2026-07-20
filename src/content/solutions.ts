import type { IconName } from "@/components/ui/icons";

/**
 * Solutions page copy. Every string lives here as a typed field — components
 * never inline copy. Transcribed verbatim from HTML files/solution-code.html
 * (all of this export's copy is real, not placeholder). The page re-skins the
 * export's forked design system to System A; the words are unchanged.
 */

export const hero = {
  // The badge icon is added in the component (Icon name="verified_user").
  badge: "SDVOSB & WOSB Certified",
  // The export accents "Coaching Solutions" and breaks before the tail; the
  // component owns that markup, this owns the words.
  headline: {
    lead: "Tailored",
    accent: "Coaching Solutions",
    tail: "for Modern Leaders",
  },
  lede:
    "Bridging the gap between government rigorous standards and empathetic executive coaching. We provide a steady hand for veterans, executives, and organizations in a sea of change.",
  primaryCta: { href: "/contact", label: "Start Your Journey" },
  // "Learn More" scrolls to the offerings on this same page (see plan Issue C).
  secondaryCta: { href: "#offerings", label: "Learn More" },
} as const;

type Offering = {
  icon: IconName;
  iconWell: "lavender" | "aqua" | "lavender-soft";
  accent: "lavender" | "accent";
  title: string;
  body: string;
};

export const offerings = {
  heading: "How We Help",
  items: [
    {
      icon: "spa",
      iconWell: "lavender",
      accent: "lavender",
      title: "Health & Life Coaching",
      body: "Holistic strategies designed to restore balance and mental clarity. We focus on the human behind the high-performer, ensuring sustainable well-being through life's complex transitions.",
    },
    {
      icon: "trending_up",
      iconWell: "aqua",
      accent: "accent",
      title: "Career & Executive Coaching",
      body: "Empowering executive transitions from public service to corporate leadership. Our framework guides you through high-stakes career shifts with strategic precision and professional confidence.",
    },
    {
      icon: "balance",
      iconWell: "lavender-soft",
      accent: "lavender",
      title: "A Blended Approach",
      body: "For those who refuse to compromise. We combine professional trajectory with personal wellness, creating a unified strategy for leaders who want to excel without burning out.",
    },
  ] satisfies readonly Offering[],
} as const;

export const transitions = {
  heading: "Strategic Transitions",
  lede: "Life doesn't move in a straight line. When things change or take a turn, we help you find your footing and align your next steps with your deepest values. Whether it's a planned career shift or an unexpected life event, we guide you to make the most of every transition.",
  // Decorative ocean mood image; the heading + lede carry all meaning.
  imageAlt: "",
} as const;

export const cta = {
  // Verbatim from the export's closing block (reads oddly, kept for fidelity).
  heading: "What Do You Do?",
  body: "Whether you're navigating the transition out of active service, stepping into a C-suite role, or seeking to integrate wellness into a high-pressure career, we provide the framework to help you lead with clarity and purpose. Let's define your next chapter together.",
  action: { href: "/contact", label: "Book a Consultation" },
} as const;
