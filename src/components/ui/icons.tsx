import {
  ArrowRight,
  Award,
  BadgeCheck,
  Flower2,
  Globe,
  Medal,
  Network,
  RefreshCw,
  Scale,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Material Symbols → Lucide substitution map.
 *
 * The Stitch exports load Material Symbols from a render-blocking Google Fonts
 * <link>. We swapped to lucide-react: tree-shakeable, no font request, no FOUT.
 * The shapes are close but not identical to Material's.
 *
 * Keys are the exact `data-icon` / glyph names from `HTML files/*.html`, so any
 * substitution can be checked against the source. If a glyph reads wrong next
 * to the design, the exact-fidelity fallback is the `material-symbols` package
 * (self-hosted font) or `@material-symbols/svg-400` (individual SVGs).
 */
export const icons = {
  // home-code.html — service bento
  clinical_notes: Stethoscope, // Health Coaching
  schema: Network, //             Executive Strategy
  sync: RefreshCw, //             Strategic Transition

  // aboutcode.html — pillars
  military_tech: Medal, //        Veteran Roots
  spa: Flower2, //                Health-First Pivot / Health & Life Coaching
  public: Globe, //               Social Mandate
  verified: BadgeCheck, //        SDVOSB / WOSB certification marks

  // solution-code.html — offerings + certifications
  trending_up: TrendingUp, //     Career & Executive Coaching
  balance: Scale, //              A Blended Approach
  shield_person: ShieldCheck, //  SDVOSB
  workspace_premium: Award, //    WOSB
  verified_user: ShieldCheck, //  SDVOSB & WOSB hero badge

  // contact-code.html
  arrow_forward: ArrowRight, //   Send Message
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

/**
 * The exports size icons with `text-3xl` / `text-[32px]` because Material
 * Symbols is a font. Lucide renders SVG, so size is an explicit prop.
 */
export function Icon({
  name,
  size = 32,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Glyph = icons[name];
  return <Glyph size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}
