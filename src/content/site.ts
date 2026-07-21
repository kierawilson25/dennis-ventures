import type { IconName } from "@/components/ui/icons";

export const site = {
  name: "Dennis Ventures",
  tagline: "Empowering Transitions with Calm & Clarity",
  description:
    "Veteran-owned executive and health coaching for transitioning service members, executives, and government partners. SDVOSB & WOSB certified.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dennisventures.com",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/solutions", label: "Solutions" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * The nav CTA. Routes to /contact for MVP; a scheduler (Cal.com/Calendly) can
 * replace this href without touching any component. See PRD.md §4.
 */
export const bookingCta = {
  href: "/contact",
  label: "Book a Consultation",
} as const;

export const certifications = "SDVOSB & WOSB Certified";

/**
 * Public inbox for the contact-form error fallback (PRD.md R7 — never fake
 * success; offer a direct route out). Distinct from the server-only
 * CONTACT_TO_EMAIL that F5's Resend delivery will use.
 * ⚠️ PLACEHOLDER pending the real address + domain (PRD.md D4 — domain undecided).
 */
export const contactEmail = "hello@dennisventures.com";

/**
 * Structured certification list — drives the About page's certification row.
 * Data-driven so that resolving D8 (WOSB unverified — the founder's capability
 * summary states SDVOSB only) is a one-line edit here, not a hunt through JSX.
 * See PRD.md D8 and designs/founder-content.md.
 */
export const certificationList = [
  {
    abbr: "SDVOSB",
    full: "Service-Disabled Veteran-Owned Small Business",
    // Per-cert glyph for the Solutions "Strategic Transitions" cards. About's
    // cert row uses a uniform `verified` badge and ignores this field.
    icon: "shield_person",
    verified: true,
  },
  {
    abbr: "WOSB",
    full: "Woman-Owned Small Business",
    icon: "workspace_premium",
    verified: false, // ⚠️ D8 — unverified; confirm with founder before launch.
  },
] as const satisfies readonly {
  abbr: string;
  full: string;
  icon: IconName;
  verified: boolean;
}[];
