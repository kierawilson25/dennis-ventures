# Feature: Port the Solutions Page (F3)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types and components. Import from the right files.

> **Read `PRD.md` §14 (R1), §16, §17 (D1/D8), `.agents/plans/port-about-page.md`, and `.agents/plans/port-home-page.md` before starting.** F1 established the section-composition patterns and F2 established the data-driven certification list + contained-image pattern. This feature mirrors both.
> **`AGENTS.md` mandates reading `node_modules/next/dist/docs/` before writing Next.js code. This is Next.js 16.2.10.**
> **This is the "forked system" page (PRD R1 / D1).** The export was generated against a *different* design system than the other three (Inter font, grey palette, Material token names, `rounded-3xl` radii). The single most important thing this port does beyond a structural translation is **re-skin it to System A** (Manrope + aqua + rounded-lg) so it is visually indistinguishable in system from Home/About. That is the whole reason F3 exists as its own feature.

## Feature Description

Port `HTML files/solution-code.html` (289 lines) into the App Router as `/solutions`, reusing the F0 foundation and F1/F2 patterns, **re-skinned from the forked System B to canonical System A**. Four content sections between the shared `TopNav` and `Footer`:

1. **Hero** — centered, on a lavender→transparent gradient band. Badge "SDVOSB & WOSB CERTIFIED" (with a shield icon), h1 "Tailored *Coaching Solutions* for Modern Leaders", lede, two buttons (solid "Start Your Journey" + outline "Learn More").
2. **Coaching Offerings ("How We Help")** — centered heading + accent rule, then three glass-card offerings (Health & Life Coaching, Career & Executive Coaching, A Blended Approach). **Unlike Home/About cards, each offering carries a "Learn more" action button** — see Task 1 (Card extension).
3. **Strategic Transitions** — 2-column (`lg`): left = heading + rule + lede + a 2-up grid of two certification cards (SDVOSB, WOSB); right = a framed ocean image with a decorative blur glow.
4. **Closing "What Do You Do?"** — **reuses the F1 `CtaBanner`** (the export's closing block is a lavender dotted CTA identical in structure).

This is the page that answers *"what do you actually offer, and are you certified for set-asides"* — US-2 (executive skimming the offer) and US-3 (government partner verifying status) in `PRD.md` §5 both land here.

## User Story

As a **time-poor executive or government partner evaluating the offer**,
I want to **see the three coaching service lines and the firm's certifications at a glance**,
So that **I can judge relevance and eligibility in under thirty seconds without emailing to ask.**

## Problem Statement

The Solutions design exists only as a standalone Stitch export that **cannot ship and is systemically off-brand**. Beyond the cross-cutting export defects shared by every page (CDN Tailwind, render-blocking Material Symbols font link, an **expiring** `lh3.googleusercontent.com` ocean image, duplicated nav/footer, `href="#"` throughout, `© 2024`), this file has problems unique to it:

- **It is a design-system fork** (PRD R1): Inter not Manrope, grey `primary`/`secondary` Material tokens, `rounded-3xl`/`rounded-2xl` radii. Ported literally it would render in a different typeface and shape language than the rest of the site.
- **`.glass-card` is used but never defined** in the file (no `<style>` block at all) — already fixed globally in `globals.css`.
- **`bg-flow-2` is an undefined class** (`solution-code.html:116`) — the offerings section has no background in the export.
- **An empty `.glass-card` overlay** sits over the ocean image (`solution-code.html:199–203`) with no content — dead markup.
- **Malformed `</script</script>`** closing tag (`solution-code.html:281`) — irrelevant once we don't port the scripts.

## Solution Statement

Compose `/solutions` from F0 primitives and the F1 `CtaBanner` as a **statically-rendered Server Component**, translating every forked System-B class to its System-A token equivalent (mapping table below). All copy moves to a new `src/content/solutions.ts` as typed fields. The three offerings become the shared `Card` primitive — extended once with an optional `action` button so the "Learn more" treatment lives in one place. The two certification cards read from `site.ts`'s existing `certificationList` (extended with a per-cert `icon` field). The ocean image becomes a `next/image` with `fill` inside a sized, cropped frame. Zero client JavaScript is added; the export's scroll/IntersectionObserver scripts are **not** ported (the fade-in observer would make the page invisible without JS — PRD §6).

## Feature Metadata

**Feature Type**: New Capability (port + re-skin)
**Estimated Complexity**: Medium — same fidelity bar as F1/F2, plus a systematic re-skin (System B → A) and one shared-primitive extension (`Card` action)
**Primary Systems Affected**: `src/app/solutions/page.tsx` (new), `src/content/solutions.ts` (new), `src/components/ui/Card.tsx` (extend, non-breaking), `src/content/site.ts` (add `icon` to `certificationList`)
**Dependencies**: All installed. **No new packages.**

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

- `HTML files/solution-code.html` — **the source of truth for this port.** Read it whole; it carries the forked config (lines 1–93) you are translating *away from*.
  - lines 112–114 — **Hero**: gradient band via inline `style` (112), badge with `verified_user` icon + "SDVOSB & WOSB CERTIFIED" (113), h1 with one accent span on "Coaching Solutions" and a `<br>` before "for Modern Leaders" (113), lede (113), two buttons — solid "Start Your Journey" + outline "Learn More" (113).
  - lines 116–164 — **Offerings ("How We Help")**: section on `bg-flow-2` (**undefined — drop it**, 116); centered h2 + accent rule (118–121); 3 glass-cards (123–161) each with an icon well, title, body, and an outline **"Learn more"** button pinned to the bottom via a `flex-grow` paragraph. Icon/well/border alternation: card1 `spa`+lavender+lavender-border, card2 `trending_up`+aqua+accent-border, card3 `balance`+lavender/40+lavender-border — **identical to Home's service alternation.**
  - lines 166–209 — **Strategic Transitions**: radial-glow inline background (166); `flex-col lg:flex-row gap-16` (168); left column heading "Strategic Transitions" + rule + lede + a `grid sm:grid-cols-2 gap-6` of two glass-card certs (SDVOSB `shield_person` 178–184, WOSB `workspace_premium` 185–191); right column the framed ocean `<img>` (194–206) with a decorative blur-glow div (196) and an **empty** glass-card overlay (199–203 — **drop it**).
  - lines 210–226 — **Closing "What Do You Do?"**: `bg-primary-container` (lavender) rounded box with a dotted radial overlay (213), h2, body, "Book a Consultation" button. **Do not re-port — this is the `CtaBanner`.**
  - lines 254–281 — `<script>`: scroll-shrink + IntersectionObserver fade-in. **Do NOT port** (PRD §6 — the observer blanket-applies `opacity-0`, making the page invisible without JS).
- `src/app/page.tsx` — **the primary pattern to mirror.** Metadata export, section composition, `Card` mapping with `iconWell`/`accent` alternation, one-off inline gradient band with a justifying comment, no `<main>` wrapper. The offerings section is nearly identical to Home's services grid.
- `src/app/about/page.tsx` — mirror for: the certification row driven from `certificationList`, the 2-column section layout, and the `SectionHeading` usages.
- `src/components/sections/CtaBanner.tsx` — reuse verbatim. Props `{ heading, body, action: { href, label } }`. The closing section maps onto this exactly (lavender bg, `.cta-dots` overlay, xl heading, lg button).
- `src/components/sections/Hero.tsx` — reference for the `next/image` full-bleed `fill` pattern **and** the static-import path (`../../../public/images/...`). The Solutions ocean image is *contained-but-cropped*, so it uses `fill` inside a **sized** relative wrapper (not full-bleed like Home, not dimension-inferred like About — see Task 6).
- `src/components/ui/Card.tsx` — **read it; Task 1 extends it.** Current props: `icon`, `iconWell` (`lavender`|`aqua`|`lavender-soft`), `accent` (`lavender`|`accent`), `title`, `children`, `className`. It renders `glass-card flex h-full flex-col rounded-lg p-10`, an icon well, an h3, and a body div. It has **no action/button slot** — the offerings need one.
- `src/components/ui/SectionHeading.tsx` — exports `SectionHeading` and `AccentRule`. "How We Help" = `SectionHeading` centered, **no lede** (the export has none). "Strategic Transitions" = `SectionHeading` left, with lede. Both `size="lg"` (export uses `text-headline-lg` h2s).
- `src/components/ui/Badge.tsx` — the hero pill. It already does `inline-flex items-center gap-2`, so pass `<><Icon name="verified_user" size={20} className="text-accent" /> SDVOSB & WOSB CERTIFIED</>` as children. (Home/About badges have no icon; this one does — children compose fine.)
- `src/components/ui/Button.tsx` — solid/outline, sizes sm/md/lg. Hero buttons = `size="md"`; offering "Learn more" = `variant="outline" size="sm"` (export px-8 py-2.5 ≈ sm's px-6 py-2.5; `w-fit` is automatic since Button is `inline-flex`).
- `src/components/ui/icons.tsx` — **all needed glyphs already mapped**: `spa`→Flower2, `trending_up`→TrendingUp, `balance`→Scale, `shield_person`→ShieldCheck, `workspace_premium`→Award, `verified_user`→ShieldCheck. No icon-map change needed. `Icon` renders SVG at an explicit `size` (default 32).
- `src/components/ui/Container.tsx` — the `max-w-site` + responsive-margin wrapper every section uses.
- `src/content/site.ts` — holds `certificationList` (`{ abbr, full, verified }[]`). **Task 2 adds an `icon` field.** Also holds `bookingCta` (`/contact`, "Book a Consultation") — reuse for the closing CTA action.
- `src/content/home.ts` — the exact shape `solutions.ts` should mirror (typed consts, `as const`, split-headline `{ lead, accent }`, `Service`-typed array with `IconName`, `satisfies readonly Service[]`).
- `src/app/globals.css` — token names and the `@theme` block. This is your re-skin target vocabulary; do not introduce any name not defined here. `.glass-card`, `.hero-gradient`, `.cta-dots` are all defined here already.

### New Files to Create

- `src/content/solutions.ts` — all Solutions copy as typed fields (mirrors `home.ts`).
- `src/app/solutions/page.tsx` — the route (Server Component).

### Files to Modify

- `src/components/ui/Card.tsx` — add optional `action?: { href: string; label: string }` (non-breaking; Home/About omit it).
- `src/content/site.ts` — add `icon: IconName` to each `certificationList` entry (non-breaking; About's cert row uses a uniform `verified` icon and can ignore it).

### Relevant Documentation — READ BEFORE IMPLEMENTING

- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — *Local images* (static import) **and** the `fill` prop (requires a `position: relative` sized parent + `object-cover`). The ocean image is cropped-to-fill, so it uses `fill`, unlike About's dimension-inferred contained image. Verify the exact doc path exists before relying on it (AGENTS.md mandate).
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` — per-page `metadata`; export `title` only, root layout supplies the template + `metadataBase`.
- [Tailwind v4 Theme](https://tailwindcss.com/docs/theme) — tokens live in `@theme`; there is no `tailwind.config.js`. Confirms every re-skin target class resolves to a real token.

### Patterns to Follow

**Everything from F1/F2 applies unchanged** — copy-in-content-modules, no `"use client"`, no hex literals, no `<main>` in the page, `next/image` for all imagery, `CtaBanner` reuse, split-headline pattern, `SectionHeading`/`AccentRule` for section headers, `Card` alternation. See the two prior plans' "Patterns to Follow" and re-apply verbatim.

**⭐ The re-skin mapping (System B → System A) — this is the defining work of F3.** Translate every forked class in `solution-code.html` to its token equivalent. Nothing from the export's `font-*`/color/radius vocabulary survives:

| Export (System B / Material) | Port (System A token) | Notes |
|---|---|---|
| `font-headline-*`, `font-body-*`, `font-label-*` | *(drop entirely)* | Manrope is the default `font-sans`; these `fontFamily` classes don't exist in v4 `@theme`. Keep the `text-headline-*`/`text-body-*`/`text-label-*` **size** classes. |
| `text-secondary`, `bg-secondary` | `text-accent`, `bg-accent` | The aqua `#00a8cc`. |
| `text-on-secondary` | `text-accent-ink` | |
| `bg-primary-container`, `text-on-primary-container` | `bg-lavender`, `text-lavender-ink` | Badge well + closing CTA bg. |
| `bg-primary-container/40` | `bg-lavender/40` (well `lavender-soft`) | Card 3 icon well. |
| `bg-tertiary-container` | `bg-aqua-soft` | Card 2 icon well. |
| `text-on-surface` | `text-ink` | |
| `text-on-surface-variant` | `text-ink-muted` | |
| `border-outline-variant/30`, `border-outline` | `border-outline-soft`, `border-outline` | |
| `bg-surface-container-low`, `bg-surface-container` | `bg-surface-sunken`, `bg-surface-raised` | Only if referenced; offerings section `bg-flow-2` is undefined → use plain `bg-surface`. |
| `rounded-3xl` (1.5rem), `rounded-2xl` | `rounded-lg` / `rounded-xl` (System A caps at `rounded-xl`=1rem) | **Cards → `rounded-lg`** (the `Card` primitive already does this); the ocean frame → `rounded-xl`. This is the visible "shape language" half of the re-skin. |
| `border-b-primary-container`, `border-b-secondary` | Card `accent="lavender"` / `accent="accent"` | Handled by the `Card` primitive's `accent` prop. |
| `#5c5d6e` grey `primary` | *(unused in markup — ignore)* | The forked grey primary appears only in the config, not the visible classes. |

**Card alternation for the offerings** (identical to Home's `services`): index 0 → `iconWell:"lavender", accent:"lavender"`; index 1 → `iconWell:"aqua", accent:"accent"`; index 2 → `iconWell:"lavender-soft", accent:"lavender"`.

**One-off inline gradients** (mirror Home's Mission-band rationale — a comment justifying why it's inline, not a token): the hero band `linear-gradient(rgba(230,230,250,0.8) 0%, rgba(230,230,250,0) 100%)` and the Strategic-Transitions glow `radial-gradient(circle, rgba(0,168,204,0.08) 0%, rgba(247,249,251,0) 70%)`. Keep both as inline `style` on their sections (single-use, one caller each).

**Anti-patterns** — same as F1/F2, plus:
- ❌ Porting any `font-headline-*`/`font-body-*`/`font-label-*` class (they don't exist in v4 — silent no-op that also signals an incomplete re-skin).
- ❌ Leaving any `text-secondary`/`bg-primary-container`/`text-on-surface`/`rounded-3xl` in the output (grep gate catches these).
- ❌ Porting `bg-flow-2` (undefined) — use `bg-surface`.
- ❌ Porting the empty glass-card overlay on the ocean image (dead markup).
- ❌ Porting the `<script>` blocks (scroll + IntersectionObserver — PRD §6).
- ❌ Re-porting the closing CTA (use `CtaBanner`).
- ❌ Building a bespoke offering card instead of extending the shared `Card` (violates "one source of truth per concept", PRD §2).
- ❌ `fill` without a sized `relative` parent (image collapses); or a raw `<img>` / the expiring `lh3` URL.

---

## KNOWN ISSUES CARRIED INTO THIS PORT

### Issue A — WOSB certification is unverified (D8) — LEAVE AS-IS this pass ⚠️
The export asserts **both SDVOSB and WOSB** (hero badge + a Strategic-Transitions cert card + footer). `designs/founder-content.md` confirms **SDVOSB only**; `site.ts` already marks `WOSB { verified: false }`.

**Decision (user, this session):** **Do NOT strip the WOSB claims.** Render the hero badge, the WOSB cert card, and the footer exactly as the export/current site have them. The founder will verify later. The `verified: false` flag stays as the audit marker so a future removal is a one-line edit in `site.ts` — but no removal happens now. Do not surface this as a blocker in the report beyond a one-line note.

### Issue B — offering "Learn more" buttons navigate nowhere
`solution-code.html` renders three "Learn more" buttons as `<button>` → `#` (no destination; there are no per-offering detail pages, and none are in scope).

**Default:** point each at `/contact` — the same conversion seam used for the booking CTA and About's "Meet the Founder" (Issue C precedent). Fidelity keeps the buttons (PRD §2 principle 1); the destination is the only decision. **Flag as a minor open decision** in the report: alternatives are dropping the buttons (they're somewhat redundant with the hero + closing CTAs) or anchoring to the closing CTA. Recommend `/contact`.

### Issue C — hero "Learn More" (secondary CTA) destination
The hero's outline "Learn More" also goes to `#` in the export. Since the visitor is already *on* Solutions, the natural low-friction target is an **in-page anchor to the offerings section** (`#offerings`).

**Default:** give the offerings `<section>` `id="offerings"` and point "Learn More" at `#offerings`. **Flag as a minor decision**; alternative is `/about`. Recommend `#offerings`.

### Issue D — ocean image is usable (no resolution problem, unlike About)
`public/images/solutions-ocean.png` is **1200×896** and confirmed usable (PRD D3 / R2). No 512px caveat here. The only work is converting the export's `<img>` (fixed `h-[500px] w-full object-cover`, cropped) to `next/image` `fill` in a sized frame. **Alt text:** the export's alt ("A serene and minimalist photo of calm ocean water with gentle ripples.") is truthful and matches the asset — but the image is decorative (the heading + lede carry all meaning). Prefer `alt=""`; if you judge it meaningful, the export's description is acceptable. Never invent a different subject.

### Issue E — the empty glass-card overlay
`solution-code.html:199–203` places an empty `.glass-card` over the bottom of the ocean image — no text, no children. It was presumably a caption slot Stitch left blank. **Drop it.** Note as a deviation in the report (nothing lost — it renders nothing in the export either).

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation
Extend the shared `Card` with an optional `action` (so offerings have one card, not a fork); add `icon` to `certificationList`; author `solutions.ts` from the export's (real, non-placeholder) copy.

### Phase 2: Core Implementation
Build the four sections in `solutions/page.tsx`, applying the re-skin mapping throughout. Hero (centered, gradient band), Offerings (`Card` grid with actions), Strategic Transitions (2-col + cert cards + `next/image` ocean), and the reused `CtaBanner`.

### Phase 3: Integration
Compose the page; add metadata; verify the F0 `TopNav` already lights "Solutions" active via `usePathname` (no code change — just confirm).

### Phase 4: Validation
Same gate set as F1/F2, **plus a re-skin-specific grep** ensuring zero System-B classes survive.

---

## STEP-BY-STEP TASKS

Execute in order. Each task is atomic and independently validated.

### Task 1 — UPDATE `src/components/ui/Card.tsx` (add optional action)

- **IMPLEMENT**: add an optional `action?: { href: string; label: string }` prop. When present, render an outline Button below the body and let the body grow so the button pins to the card bottom (matching the export's `flex-grow` paragraph). When absent, render nothing new — Home/About are unchanged.
  ```tsx
  import { Button } from "@/components/ui/Button";
  // add to props type:
  action?: { href: string; label: string };
  // ...body div gets a conditional grow, then the optional button:
  <div className={cn("text-body-md leading-relaxed text-ink-muted", action && "flex-1")}>
    {children}
  </div>
  {action ? (
    <Button href={action.href} variant="outline" size="sm" className="mt-8 w-fit">
      {action.label}
    </Button>
  ) : null}
  ```
- **PATTERN**: `Card.tsx` is already `flex h-full flex-col`, so `flex-1` on the body + the button after it pins the button to the bottom across a row of unequal-length cards.
- **IMPORTS**: `Button` from `@/components/ui/Button` (Card currently imports only `cn` and `ReactNode` — add it).
- **GOTCHA**: keep the change strictly additive. Do not alter existing prop defaults, the icon well, or the base classes. Verify Home (`/`) and About (`/about`) still render identically after this (no `action` passed → no visual change).
- **GOTCHA**: `Card` is a Server Component and stays one — `Button` with `href` renders a `<Link>`, which is fine in RSC.
- **VALIDATE**: `npx tsc --noEmit && npm run build` — Home/About must still build `○ (Static)`.

### Task 2 — UPDATE `src/content/site.ts` (add per-cert icon)

- **IMPLEMENT**: add an `icon` field to each `certificationList` entry, typed as `IconName`, matching the export's Strategic-Transitions glyphs:
  ```ts
  import type { IconName } from "@/components/ui/icons";
  // SDVOSB → icon: "shield_person"; WOSB → icon: "workspace_premium"
  ```
- **WHY**: the Solutions cert cards show a distinct icon per certification; driving them from the shared list keeps one source of truth (About's row uses a uniform `verified` icon and simply ignores this field).
- **GOTCHA**: keep `verified: false` on WOSB (Issue A — audit marker, not stripped). Keep the existing `certifications` string and `verified` flags untouched. Adding a field is non-breaking, but re-run About's build to confirm.
- **VALIDATE**: `npx tsc --noEmit`

### Task 3 — CREATE `src/content/solutions.ts`

- **IMPLEMENT**: mirror `src/content/home.ts` shape exactly. Sections: `hero`, `offerings`, `transitions`, `cta`. **All copy in this export is real, not placeholder** — transcribe verbatim from `solution-code.html`.
- **IMPORTS**: `import type { IconName } from "@/components/ui/icons";`
- **`hero`**:
  - `badge: "SDVOSB & WOSB Certified"` (the icon is added in the component, not the string).
  - Split headline: `{ lead: "Tailored", accent: "Coaching Solutions", tail: "for Modern Leaders" }` (one accent span + a tail; the export forces a `<br>` before the tail — see Task 4 for how to render it).
  - `lede`: "Bridging the gap between government rigorous standards and empathetic executive coaching. We provide a steady hand for veterans, executives, and organizations in a sea of change." (line 113, verbatim).
  - `primaryCta: { href: "/contact", label: "Start Your Journey" }`.
  - `secondaryCta: { href: "#offerings", label: "Learn More" }` (Issue C).
- **`offerings`**: `{ heading: "How We Help", items: Offering[] }` where `Offering = { icon: IconName; iconWell; accent; title; body; action: { href, label } }`. Three items, copy verbatim from lines 128–160:
  - `spa` / lavender / lavender — "Health & Life Coaching" — "Holistic strategies designed to restore balance and mental clarity. We focus on the human behind the high-performer, ensuring sustainable well-being through life's complex transitions."
  - `trending_up` / aqua / accent — "Career & Executive Coaching" — "Empowering executive transitions from public service to corporate leadership. Our framework guides you through high-stakes career shifts with strategic precision and professional confidence."
  - `balance` / lavender-soft / lavender — "A Blended Approach" — "For those who refuse to compromise. We combine professional trajectory with personal wellness, creating a unified strategy for leaders who want to excel without burning out."
  - Each `action: { href: "/contact", label: "Learn more" }` (Issue B).
- **`transitions`**: `{ heading: "Strategic Transitions", lede: <line 173–175 verbatim>, imageAlt: "" }`. The lede: "Life doesn't move in a straight line. When things change or take a turn, we help you find your footing and align your next steps with your deepest values. Whether it's a planned career shift or an unexpected life event, we guide you to make the most of every transition." (The two cert cards render from `certificationList` in `site.ts`, not from here.)
- **`cta`**: `{ heading: "What Do You Do?", body: <line 216–218 verbatim>, action: { href: "/contact", label: "Book a Consultation" } }`. Body: "Whether you're navigating the transition out of active service, stepping into a C-suite role, or seeking to integrate wellness into a high-pressure career, we provide the framework to help you lead with clarity and purpose. Let's define your next chapter together." Type the `offerings.items` array with `satisfies readonly Offering[]` (mirror `home.ts`).
- **GOTCHA**: `"What Do You Do?"` reads oddly as a banner heading but it is the export's verbatim copy — keep it (PRD §2 principle 1). Note it in the report as verbatim-but-awkward if you like; do not silently rewrite.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4 — CREATE `src/app/solutions/page.tsx` — Hero section

- **IMPLEMENT**: Server Component. Start with the `metadata` export (`title: "Solutions"` → renders "Dennis Ventures | Solutions") then the Hero.
- **PATTERN** — centered hero on a one-off gradient band (`solution-code.html:112–114`):
  ```tsx
  <section
    className="py-section"
    // One-off lavender→transparent band (single caller); inline like Home's Mission gradient.
    style={{ background: "linear-gradient(rgba(230,230,250,0.8) 0%, rgba(230,230,250,0) 100%)" }}
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
          {" "}{hero.headline.tail}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-ink-muted">{hero.lede}</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href={hero.primaryCta.href} size="md">{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="outline" size="md">{hero.secondaryCta.label}</Button>
        </div>
      </div>
    </Container>
  </section>
  ```
- **GOTCHA (headline `<br>`)**: the export forces "for Modern Leaders" onto a second line. Rendering it inline (as above) lets it wrap naturally, which is safer across breakpoints. If you want to match the desktop line break exactly, insert `<br className="hidden md:block" />` before the tail instead of the space — but do not hard-break on mobile. Either is acceptable; note the choice.
- **GOTCHA**: no `<main>` (layout owns it); no `"use client"`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 5 — ADD the Offerings section (into `solutions/page.tsx`)

- **IMPLEMENT**: `solution-code.html:116–164`, **re-skinned**. Give the section `id="offerings"` (Issue C anchor target) and a plain `bg-surface` (the export's `bg-flow-2` is undefined — dropped).
  ```tsx
  <section id="offerings" className="bg-surface py-section">
    <Container>
      <SectionHeading title={offerings.heading} align="center" size="lg" />
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {offerings.items.map((o) => (
          <Card key={o.title} title={o.title} icon={<Icon name={o.icon} />} iconWell={o.iconWell} accent={o.accent} action={o.action}>
            {o.body}
          </Card>
        ))}
      </div>
    </Container>
  </section>
  ```
- **PATTERN**: this is Home's services grid + the new `action` prop. The alternation lives in `solutions.ts` data, not JSX.
- **GOTCHA**: `SectionHeading` here has **no lede** (the export's "How We Help" has none). The centered accent rule is `SectionHeading`'s default `rule`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 6 — ADD the Strategic Transitions section (into `solutions/page.tsx`)

- **IMPLEMENT**: `solution-code.html:166–209`, re-skinned. `flex flex-col gap-16 lg:flex-row lg:items-center`, on a one-off radial-glow band (inline `style`, commented). Left column (`flex-1`): `SectionHeading` (title "Strategic Transitions", `lede`, `size="lg"`, left-aligned) + a `grid gap-6 sm:grid-cols-2` of two cert cards from `certificationList`. Right column (`flex-1`): the framed ocean image.
  ```tsx
  import oceanImage from "../../../public/images/solutions-ocean.png";
  // cert card (mapped over certificationList):
  <div key={cert.abbr} className="glass-card flex gap-4 rounded-xl p-6">
    <Icon name={cert.icon} size={32} className="shrink-0 text-accent" />
    <div>
      <h3 className="text-headline-md font-bold text-ink">{cert.abbr}</h3>
      <p className="mt-1 text-body-md text-ink-muted">{cert.full}</p>
    </div>
  </div>
  // framed ocean image (cropped-to-fill in a sized wrapper):
  <div className="relative">
    <div aria-hidden className="absolute -inset-2 rounded-xl bg-gradient-to-r from-accent/20 to-lavender/40 opacity-30 blur-xl" />
    <div className="relative overflow-hidden rounded-xl border border-outline-soft/30 shadow-2xl">
      <div className="relative h-[500px] w-full">
        <Image src={oceanImage} alt={transitions.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" className="object-cover" />
      </div>
    </div>
  </div>
  ```
- **GOTCHA (Issue A)**: render **both** SDVOSB and WOSB cert cards from `certificationList` — do not filter on `verified`. WOSB stays this pass.
- **GOTCHA (Issue D — `fill`)**: `fill` needs a `position: relative`, sized parent — hence the inner `relative h-[500px] w-full`. This differs from About (dimension-inferred contained) and Home (full-bleed section). Do not drop the sized wrapper or the image collapses to 0 height.
- **GOTCHA (Issue E)**: do **not** port the empty glass-card overlay (lines 199–203).
- **GOTCHA (static import path)**: `../../../public/images/...` — `solutions/page.tsx` sits at the same depth under `src/app/` as `about/page.tsx`; verify against `about/page.tsx`'s working import (three `../`).
- **GOTCHA (breakpoint)**: the export splits at `lg`, not `md` (it stays single-column longer than the other pages' 2-col sections). Use `lg:flex-row`.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 7 — ADD the closing CTA + finalize composition

- **IMPLEMENT**: append `<CtaBanner {...cta} />`. Confirm final order: Hero → Offerings → Strategic Transitions → CtaBanner.
- **GOTCHA**: import from `@/components/sections/CtaBanner` — do not re-implement the lavender/dotted block.
- **VALIDATE**: `npx tsc --noEmit && npm run build` — `/solutions` must appear as `○ (Static)`.

### Task 8 — VERIFY gates (mirror F1/F2)

- **Static render**: `npm run build 2>&1 | grep -E "/solutions"` → `○ (Static)`.
- **Re-skin grep (F3-specific — must be clean)**: no System-B class survives in the new files:
  ```bash
  ! grep -rE "font-headline-|font-body-|font-label-|text-secondary|bg-secondary|text-on-secondary|bg-primary-container|text-on-primary-container|bg-tertiary-container|text-on-surface|bg-flow-2|rounded-3xl|max-w-container-max" src/app/solutions src/content/solutions.ts && echo "re-skin clean"
  ```
- **Stale-ref grep (whole tree — mirror F2)**:
  ```bash
  ! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss" src/ && echo "no stale refs"
  ```
- **JS-disabled / static content present** (run `npm run start` or `dev` first): `curl -s localhost:3000/solutions | grep -c "How We Help"` ≥ 1; same for "Strategic Transitions", each offering title, and both cert abbreviations.
- **No `<script>` fade-in ported**: the page must render fully without JS (the export's observer is intentionally not ported).

### Task 9 — VALIDATE fidelity, responsiveness, accessibility

- **Manual**: `open "HTML files/solution-code.html"` beside `localhost:3000/solutions` at 375 / 768 / 1440.
  1. Section order; offering card border alternation (lavender/accent/lavender); icon wells (lavender/aqua/lavender-soft) — **and confirm the whole page reads in Manrope + aqua + rounded-lg, not Inter/grey/3xl** (the re-skin acceptance).
  2. **375px**: hero buttons stack; offerings 1-col; Strategic Transitions stacks (cert cards 1-col, image below); no horizontal scroll.
  3. **768px**: offerings 3-col; cert cards 2-col; Strategic Transitions may still be single-column (splits at `lg`).
  4. **1024px+**: Strategic Transitions 2-col (text left, image right).
  5. Nav active state: "Solutions" is accent-underlined (F0 `usePathname` — verify, no code).
  6. Keyboard: skip link → nav → hero buttons → offering "Learn more" ×3 → cert region → footer; focus visible throughout; "Learn More" hero anchor jumps to `#offerings`.
  7. axe: zero critical; check contrast of `text-accent` icons on `glass-card`, `text-ink` on the lavender hero band, and the offering "Learn more" outline button.
  8. Lighthouse ≥ 90 ×4; the ocean image is the likely LCP on desktop — confirm `next/image` is serving AVIF/WebP and the `sizes` is right.
- **Automated**: `npx eslint src/ && npx tsc --noEmit && npm run build`.

---

## TESTING STRATEGY

**No test framework exists** (only `dev`/`build`/`start`/`lint`). As with F1/F2, do not install one. The real gates for a static content page are static analysis + visual diff + accessibility + the re-skin grep.

### Static analysis
`tsc --noEmit`, `eslint src/`, `next build` — all clean; `/solutions` prerendered `○ (Static)`.

### Visual regression (primary gate)
Side-by-side against `solution-code.html` at three breakpoints — **with the explicit re-skin check** that the page matches System A (Manrope/aqua/rounded), not the export's forked System B. The export itself renders in Inter/grey; the port intentionally deviates *toward the rest of the site*. This is the one page where "matches the export's typeface/colour" is the wrong test — match the export's *layout and copy*, match the *site's* system.

### Accessibility
axe zero critical; full keyboard traversal; in-page anchor works; images decorative (`alt=""`) or truthfully described; contrast verified on accent-on-glass and ink-on-lavender.

### Edge cases
- **JS disabled** → full render (no ported observer).
- **375px** → hero buttons + all grids stack; no horizontal scroll.
- **Long offering copy** → `Card` `flex-1` body keeps "Learn more" buttons bottom-aligned across the row.
- **D8 later resolves to "no WOSB"** → removing the WOSB line from `certificationList` drops it from both the hero badge wording (manual) and the cert grid with no layout break. (Not done this pass — Issue A.)
- **`prefers-reduced-motion`** → no motion introduced (hover transitions only, which are fine).

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style
```bash
npx tsc --noEmit
npx eslint src/
```

### Level 2: Build & static render
```bash
npm run build            # /solutions must be ○ (Static)
```

### Level 3: Re-skin & stale-ref greps
```bash
! grep -rE "font-headline-|font-body-|font-label-|text-secondary|bg-secondary|bg-primary-container|text-on-surface|bg-flow-2|rounded-3xl" src/app/solutions src/content/solutions.ts && echo "re-skin clean"
! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss" src/ && echo "no stale refs"
```

### Level 4: Manual validation
```bash
npm run start            # then load http://localhost:3000/solutions
open "HTML files/solution-code.html"   # side-by-side at 375 / 768 / 1440
```
Then run the Task 9 checklist (fidelity, keyboard, axe, Lighthouse).

---

## ACCEPTANCE CRITERIA

- [ ] `/solutions` renders Hero → Offerings → Strategic Transitions → CtaBanner in the export's order
- [ ] **Re-skinned to System A**: Manrope, aqua accent, `rounded-lg`/`-xl` — zero System-B classes in output (grep clean)
- [ ] Matches `solution-code.html` **layout and copy** at 375 / 768 / 1440 (typeface/colour intentionally match the *site*, not the export)
- [ ] Three offerings render as the shared `Card` with the new `action` "Learn more" button; alternation lavender/accent/lavender
- [ ] `Card` extension is additive — Home and About render unchanged
- [ ] Cert cards (SDVOSB + WOSB) driven from `site.ts` `certificationList` (now with `icon`); **WOSB kept, not stripped** (Issue A)
- [ ] Ocean image uses `next/image` `fill` in a sized frame (Issue D); empty overlay dropped (Issue E)
- [ ] Hero "Learn More" → `#offerings`; offering "Learn more" ×3 → `/contact` (Issues B/C, flagged)
- [ ] `CtaBanner` reused, not re-ported; scripts not ported (renders with JS disabled)
- [ ] Copy in `src/content/solutions.ts`; no inline strings in JSX
- [ ] Zero `"use client"`; zero hex literals; no `<main>` in the page
- [ ] `/solutions` prerendered `○ (Static)`
- [ ] axe zero critical; keyboard traversal + in-page anchor; Lighthouse ≥ 90 ×4
- [ ] `tsc`, `eslint`, `build` clean

---

## COMPLETION CHECKLIST

- [ ] All 9 tasks completed in order, each validated
- [ ] Re-skin grep + stale-ref grep clean
- [ ] Visual diff at all three breakpoints (against layout, re-skinned to System A)
- [ ] Home/About regression-checked after the `Card` change
- [ ] No lint/type errors
- [ ] **Deviations + open items reported** (Issues A–E, the two CTA-destination decisions)
- [ ] `PRD.md` §16 F3 status → Built; note D1 (Solutions re-skinned to System A — R1 closed) and D8 (WOSB left in per user, still unverified)

---

## NOTES

### Open items to surface in the execution report
1. **Issue A — WOSB (D8)**: left in place per user instruction this session. Still unverified; `verified: false` flag remains for a trivial future removal.
2. **Issue B — offering "Learn more" → `/contact`** (default). Confirm or drop/redirect.
3. **Issue C — hero "Learn More" → `#offerings`** (default). Confirm or point at `/about`.
4. **Issue E — empty overlay dropped**; **`bg-flow-2` dropped** (undefined in export) → plain `bg-surface`.
5. **"What Do You Do?"** CTA heading kept verbatim (odd but faithful).

### Design decisions
- **`Card` extended, not forked** — the offerings' "Learn more" is one optional prop on the shared card, honoring "one source of truth per concept" (PRD §2). Contrast the temptation to build a bespoke Solutions card; three callers of a button treatment don't justify a second card.
- **Certifications data-driven with a per-cert `icon`** — Solutions needs distinct glyphs; the field lives on the shared list so About and Solutions read one source (About ignores it).
- **Ocean image uses `fill` in a sized frame** — cropped-to-fill, unlike About's dimension-inferred contained square or Home's full-bleed section. Calling it out because it's the most likely place to wrongly copy either sibling.
- **The re-skin is the point** — F3's defining acceptance test is "indistinguishable in system from Home/About," which is the *opposite* of "matches the export's pixels." The export's Inter/grey/3xl look is the bug being fixed (PRD R1/D1).

### Known follow-ups (do NOT fix in F3)
- WOSB verification (D8), footer legal pages (D6), any per-offering detail pages (out of scope), the contact form/page (F4/F5).

### Confidence
**8.5 / 10** for one-pass success. Every primitive exists and is proven; the copy is all real (no placeholder invention, unlike F2); the layout closely mirrors Home + About. The residual risk is (a) the systematic re-skin — missing a stray System-B class (mitigated by the dedicated grep gate), (b) the `Card` extension inadvertently shifting Home/About (mitigated by a regression build), and (c) the `fill`-in-sized-frame ocean image needing the right wrapper. All three are caught by the validation gates.
