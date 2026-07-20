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

/**
 * Footer links. These destinations do not exist yet — see PRD.md D6. They are
 * rendered because the design calls for them; the pages are a content
 * dependency, not a build one.
 */
export const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/sdvosb", label: "SDVOSB Status" },
  { href: "/wosb", label: "WOSB Status" },
] as const;

export const certifications = "SDVOSB & WOSB Certified";

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
    verified: true,
  },
  {
    abbr: "WOSB",
    full: "Woman-Owned Small Business",
    verified: false, // ⚠️ D8 — unverified; confirm with founder before launch.
  },
] as const;
