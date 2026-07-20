import type { IconName } from "@/components/ui/icons";

/**
 * About page copy. Hero lede and section ledes are transcribed verbatim from
 * HTML files/aboutcode.html (they were real copy, not placeholders). The pillar
 * and value bodies WERE [PLACEHOLDER] in the export — drafted here from
 * designs/founder-content.md, the canonical founder-provided source. No facts
 * are invented. Closes most of D2.
 */

export const hero = {
  badge: "Our Story",
  // h1 has two accent spans: "A Journey of <Purpose> and <Service>."
  headline: {
    lead: "A Journey of",
    accent1: "Purpose",
    mid: "and",
    accent2: "Service",
  },
  lede: "Dennis Ventures was founded on the principle that the skills forged in service—resilience, strategic vision, and calm under pressure—are the ultimate tools for executive transformation.",
  // "Meet the Founder" has no dedicated destination yet (a founder page is
  // future scope, PRD.md §13). Routed to /contact as a soft seam. See plan Issue C.
  founderCta: { href: "/contact", label: "Meet the Founder" },
} as const;

type Pillar = {
  icon: IconName;
  iconWell: "lavender" | "aqua" | "lavender-soft";
  accent: "lavender" | "accent";
  title: string;
  body: string;
};

export const pillars = {
  heading: "What Sets Us Apart",
  lede: "Our unique methodology bridges the gap between high-stakes leadership and long-term vitality.",
  items: [
    {
      icon: "military_tech",
      iconWell: "lavender",
      accent: "lavender",
      title: "Veteran Roots",
      // From founder bio + capability summary: SDVOSB, former federal executive, 23 yrs public service.
      body: "A Service-Disabled Veteran-Owned Small Business led by a former federal executive with 23 years in public service—our foundation is disciplined leadership under pressure.",
    },
    {
      icon: "spa",
      iconWell: "aqua",
      accent: "accent",
      title: "Health-First Pivot",
      // From founder bio: certified Health and Life Coach; health, nutrition, mindset.
      body: "Founded by a certified Health and Life Coach, we put health, nutrition, and mindset first—because sustainable performance starts with well-being.",
    },
    {
      icon: "public",
      iconWell: "lavender-soft",
      accent: "lavender",
      title: "Social Mandate",
      // From capability summary: federal, military, corporate; workforce resilience; accountability-based.
      body: "We support federal, military, and corporate populations, strengthening workforce resilience and health behaviors through accountability-based coaching.",
    },
  ] satisfies readonly Pillar[],
} as const;

type Value = { title: string; body: string };

export const values = {
  heading: "Our Values",
  lede: "The pillars that define every consultation, every strategy, and every success story.",
  // ⚠️ DRAFT — the export's three named values (Expertise / Calmness /
  // Professionalism) are not directly described in designs/founder-content.md.
  // These are inferred from the founder bio's themes. CONFIRM WITH FOUNDER
  // before treating as final. See plan Task 2 gotcha + D2.
  items: [
    {
      title: "Expertise",
      // DRAFT — confirm with founder
      body: "Evidence-based coaching across health, nutrition, mindset, accountability, and personal growth, informed by a career spent leading people through complex challenges.",
    },
    {
      title: "Calmness",
      // DRAFT — confirm with founder
      body: "A steady, focused presence under pressure—so you can find your footing and make clear decisions through any transition.",
    },
    {
      title: "Professionalism",
      // DRAFT — confirm with founder
      body: "The rigor and standards of a federal executive career, brought to every engagement with discretion and care.",
    },
  ] satisfies readonly Value[],
} as const;

export const cta = {
  heading: "Ready for your next chapter?",
  body: "Join the ranks of leaders who have found clarity and purpose through Dennis Ventures.",
  action: { href: "/contact", label: "Start Your Journey" },
} as const;
