# Feature: Port the About Page (F2)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types and components. Import from the right files.

> **Read `PRD.md` §16/§16b/§17, `designs/founder-content.md`, and `.agents/plans/port-home-page.md` before starting.** F1 established the patterns this feature mirrors; the founder file is the canonical copy source.
> **`AGENTS.md` mandates reading `node_modules/next/dist/docs/` before writing Next.js code. This is Next.js 16.2.10.**

## Feature Description

Port `HTML files/aboutcode.html` (327 lines) into the App Router as `/about`, reusing the F0 foundation and F1's now-established patterns. Four content sections between the shared `TopNav` and `Footer`:

1. **Hero / Our Story** — 2-column: left = "Our Story" badge, h1 "A Journey of *Purpose* and *Service*", lede, "Meet the Founder" button; right = a framed square image.
2. **What Sets Us Apart** — three pillar cards (Veteran Roots, Health-First Pivot, Social Mandate) + an SDVOSB/WOSB certification row.
3. **Our Values** — 1/3 heading + 2/3 list of three numbered values (Expertise, Calmness, Professionalism).
4. **CTA banner** — "Ready for your next chapter?" — **reuses the F1 `CtaBanner`**.

This is the page that answers *"who is this and why should I trust them"* — load-bearing for all three personas in `PRD.md` §3, and the natural home for the founder's story and the certifications that gate government referrals.

## User Story

As a **prospective client or government partner evaluating credibility**,
I want to **understand the founder's background, the firm's differentiators, and its certifications**,
So that **I can decide whether this practice is the right, verifiable fit before reaching out.**

## Problem Statement

The About design exists only as a standalone Stitch export that cannot ship, and it is **~40% placeholder** — the highest of any page. Its six `[PLACEHOLDER]` blocks (3 pillar descriptions, 3 value descriptions) were the bulk of blocking decision D2. It also carries the same cross-cutting export defects as F1: CDN Tailwind, render-blocking font links, an **expiring** `lh3.googleusercontent.com` image applied as a real `<img>` with **no real `alt`** (it ships `data-alt`), duplicated nav/footer, and `href="#"` links.

## Solution Statement

Compose `/about` from F0 primitives and F1 sections as a **statically-rendered Server Component**. All copy moves to `src/content/about.ts` as typed fields, drafted from `designs/founder-content.md` — closing most of D2. The framed image becomes a static-import `<Image>`. The `CtaBanner` extracted in F1 is reused verbatim. Zero client JavaScript is added.

## Feature Metadata

**Feature Type**: New Capability (port)
**Estimated Complexity**: Medium — same fidelity bar as F1, plus real copywriting from source material and one genuinely-new layout (numbered value list)
**Primary Systems Affected**: `src/app/about/page.tsx` (new), `src/content/about.ts` (new), `src/content/site.ts` (add certifications list), possibly `src/components/sections/`
**Dependencies**: All installed. **No new packages.**

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

- `HTML files/aboutcode.html` — **the source of truth for this port.** Read it whole.
  - lines 141–166 — Hero/Story: grid (142), badge (144), h1 with **two** accent spans (147–149), lede (150–152), "Meet the Founder" button (154–156), framed square image (159–164). **Note line 162 uses `data-alt`, not `alt` — the image has no accessible name in the export.**
  - lines 168–219 — Pillars: 3 cards (178–206) with `[PLACEHOLDER]` bodies (184, 194, 203); certification row (208–217) with SDVOSB + WOSB.
  - lines 221–269 — Values: 1/3 heading (223–229), 2/3 list of three numbered items (231–267), all `[PLACEHOLDER]`.
  - lines 271–282 — CTA banner. **Do not re-port — use `CtaBanner`.**
  - lines 100–118 — `<style>`: `.glass-card` (already global), `.page-gradient-transition` (used on `<body>` line 121 — see Gotcha).
- `designs/founder-content.md` — **canonical copy source.** The bio → pillars; capability summary → Social Mandate + certs. **Values map only loosely — see Task 3 gotcha.**
- `src/app/page.tsx` — **the pattern to mirror.** Metadata export, section composition, no `<main>` wrapper, content from a typed module. Copy this structure.
- `src/components/sections/CtaBanner.tsx` — reuse. Props `{ heading, body, action: { href, label } }`.
- `src/components/sections/Hero.tsx` — reference for the static-image + `next/image` pattern (esp. the static import path `../../../public/images/...` and `placeholder="blur"`). **About's image is NOT full-bleed** — it's a contained square, so use explicit sizing, not `fill`. See Task 4.
- `src/components/ui/Card.tsx` — pillars are `Card`s. Props: `icon`, `iconWell`, `accent`, `title`, `children`. Read the file (above in this session) — same alternation as Home: lavender / aqua / lavender.
- `src/components/ui/SectionHeading.tsx` — exports `SectionHeading` and `AccentRule`. The Values section's left column (heading + lede + rule) is a clean fit for `SectionHeading` with `size="lg"`.
- `src/components/ui/Badge.tsx` — the "Our Story" pill. (Radius already fixed to `rounded-lg` in F1.)
- `src/components/ui/Container.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/icons.tsx` — as F1.
- `src/content/site.ts` — holds `certifications` (a string) and the content-module pattern. **Task 1 adds a structured cert list here.**
- `src/content/home.ts` — the exact shape `about.ts` should mirror (typed consts, `as const`, split-headline pattern, `IconName` import).

### New Files to Create

- `src/content/about.ts` — all About copy as typed fields
- `src/app/about/page.tsx` — the route (Server Component)
- *(optional)* `src/components/sections/ValueList.tsx` — only if the numbered-value layout reads cleanly as a reusable section; otherwise inline in the page. **Default: inline** (it appears on exactly one page).

### Relevant Documentation — READ BEFORE IMPLEMENTING

- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — *Local images* (static import → auto width/height/blur). About's image is contained, so pass the imported object and let Next infer dimensions; do **not** use `fill` here.
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` — per-page `metadata`. Export `title` only; root layout supplies the template and `metadataBase`.
- [Tailwind v4 Theme](https://tailwindcss.com/docs/theme) — tokens live in `@theme`; there is no `tailwind.config.js`.

### Patterns to Follow

**Everything from F1 applies unchanged** — the token-rename table, the radius rule (`rounded` → `rounded-md`; `rounded-lg`/`-xl` are 1:1), the `font-*` family drops, copy-in-content-modules, no `"use client"`, no hex literals, no `<main>` in the page. See `.agents/plans/port-home-page.md` "Patterns to Follow" and re-apply verbatim.

**Split-headline pattern** (from `home.ts` hero) — the h1 has **two** accent spans this time: "A Journey of `<Purpose>` and `<Service>`". Model as `{ lead: "A Journey of", accent1: "Purpose", mid: "and", accent2: "Service" }` (or an array of segments). The component owns the markup.

**Anti-patterns** — same as F1, plus:
- ❌ re-porting the CTA banner (use `CtaBanner`)
- ❌ inventing founder facts not in `designs/founder-content.md`
- ❌ `fill` on the contained hero image (that's for full-bleed only)
- ❌ shipping the image with no `alt` or with the export's fictional `data-alt` describing an executive portrait that isn't what the file contains

---

## KNOWN ISSUES CARRIED INTO THIS PORT

### Issue A — the hero image is a 512px preview (subject is correct)
`public/images/about-portrait.jpg` is a **512px** rendered interior scene — a serene, modern professional space with plants and a city view. **This is the intended subject** (a brand/mood image, not a portrait of a person), confirmed by the client 2026-07-19. The only issue is **resolution**: at 512px it will be soft in the contained square frame, which renders larger than that on desktop/retina.

**Decision (client, 2026-07-19):** **use this preview as-is for F2.** A higher-res export is wanted but currently blocked (can't export correctly yet), so resolution upgrade is a post-F2 follow-up, not an F2 task.

**Do:** wire the slot with `next/image` using the existing asset. The export's `data-alt` ("a professional executive") is **wrong** — the image is an interior, not a person. Since it's a decorative mood image that conveys nothing the surrounding text doesn't, ship **`alt=""`** (or a brief truthful description like "A calm, sunlit modern office interior"). **Never** reuse the export's fictional alt.

### Issue B — WOSB certification is unverified (D8) ⚠️ BLOCKING before launch
The export's certification row (and the footer) assert **both SDVOSB and WOSB**, but `designs/founder-content.md` confirms **SDVOSB only**. Per D8 this must be verified before launch.

**Do:** drive the certification row from a **data list** (Task 1) so that if WOSB turns out to be uncertified, removing it is a one-line edit in `site.ts`, not a hunt through JSX. Build both entries per the export for now; the data-driven shape is the mitigation.

### Issue C — "Meet the Founder" button has no destination
`aboutcode.html:154` renders it as a `<button>` going nowhere. A dedicated founder page is explicit future scope (`PRD.md` §13).

**Default:** render it as a `Button href="/contact"` (the same seam as the booking CTA). **Flag as a minor open decision** — alternatives are an on-page anchor to an expanded founder bio, or dropping it. Do not build a founder page in F2.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation
Add the structured certification list to `site.ts`; author `about.ts` from the founder content (this is where the real copywriting happens).

### Phase 2: Core Implementation
Build the four sections. Only the numbered Values list is new layout; Hero mirrors F1's image pattern (contained, not full-bleed); pillars are `Card`s; CTA is reused.

### Phase 3: Integration
Compose `src/app/about/page.tsx`; add metadata; confirm the nav's active-state already lights "About" (F0 `TopNav` uses `usePathname` — no change needed, just verify).

### Phase 4: Validation
Same gate set as F1: tsc / eslint / build / static-render / stale-ref grep / JS-disabled / visual diff at 375·768·1440 / axe / Lighthouse.

---

## STEP-BY-STEP TASKS

Execute in order. Each task is atomic and independently validated.

### Task 1 — UPDATE `src/content/site.ts` (structured certifications)

- **IMPLEMENT**: add a typed `certificationList` array alongside the existing `certifications` string:
  ```ts
  export const certificationList = [
    { abbr: "SDVOSB", full: "Service-Disabled Veteran-Owned Small Business", verified: true },
    { abbr: "WOSB", full: "Woman-Owned Small Business", verified: false }, // ⚠️ D8 — unverified; see designs/founder-content.md
  ] as const;
  ```
- **WHY**: the About cert row and (later) any audit of WOSB claims read from one list. If D8 resolves to "not certified," delete one line here.
- **GOTCHA**: leave the existing `certifications` string as-is — the footer still uses it. Do not break F0.
- **VALIDATE**: `npx tsc --noEmit`

### Task 2 — CREATE `src/content/about.ts`

- **IMPLEMENT**: mirror `src/content/home.ts` shape. Sections: `hero` (badge, split headline, lede, `founderCta`), `pillars` (array of 3), `values` (heading, lede, array of 3 numbered), `cta`.
- **IMPORTS**: `import type { IconName } from "@/components/ui/icons";`
- **Hero copy** — the export's hero lede is **real copy, not a placeholder** (`aboutcode.html:150–152`): "Dennis Ventures was founded on the principle that the skills forged in service—resilience, strategic vision, and calm under pressure—are the ultimate tools for executive transformation." Transcribe it. Badge = "Our Story". Headline segments from line 147–149.
- **Pillars** — fill the three `[PLACEHOLDER]` bodies from `designs/founder-content.md` (faithful, no invented facts):
  - `military_tech` / Medal, well `lavender`, accent `lavender` — **Veteran Roots**: e.g. "A Service-Disabled Veteran-Owned Small Business led by a former federal executive with 23 years in public service — our foundation is disciplined leadership under pressure."
  - `spa` / Flower2, well `aqua`, accent `accent` — **Health-First Pivot**: e.g. "Founded by a certified Health and Life Coach, we put health, nutrition, and mindset first — because sustainable performance starts with well-being."
  - `public` / Globe, well `lavender-soft`, accent `lavender` — **Social Mandate**: e.g. "We support federal, military, and corporate populations, strengthening workforce resilience and health behaviors through accountability-based coaching."
- **Values** — ⚠️ **the three named values (Expertise / Calmness / Professionalism) do NOT map 1:1 to the founder material.** Draft each from the bio's themes (evidence-based expertise across health/nutrition/mindset/accountability; calm under pressure; former-federal-executive professional standards), but **mark each with a `// DRAFT — confirm with founder` comment.** These are the weakest-grounded copy on the page; the execution report must call them out for sign-off.
- **`founderCta`**: `{ href: "/contact", label: "Meet the Founder" }` (Issue C default).
- **`cta`**: heading "Ready for your next chapter?", body from `aboutcode.html:276`, action `{ href: "/contact", label: "Start Your Journey" }`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 3 — CREATE `src/app/about/page.tsx` — Hero section

- **IMPLEMENT**: Server Component. Start the file with the `metadata` export (`title: "Our Story"` → renders "Dennis Ventures | Our Story") and the Hero section.
- **PATTERN** — 2-column grid from `aboutcode.html:141–166`: `<section className="py-section">` → `<Container>` → `grid items-center gap-gutter md:grid-cols-2`. Left column: `<Badge>`, h1 (`text-headline-xl-tight md:text-headline-xl`) with two `<span className="text-accent">` segments, lede (`text-body-lg text-ink-muted`), `<Button href={founderCta.href} variant="solid">`. Right column: the framed image (Task 4).
- **GOTCHA**: no `<main>` — layout owns it. No `"use client"`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4 — ADD the framed hero image (into `about/page.tsx`)

- **IMPLEMENT**: contained square image in a `glass-card` frame, per `aboutcode.html:159–164`.
  ```tsx
  import aboutImage from "../../../public/images/about-portrait.jpg";
  // …
  <div className="glass-card overflow-hidden rounded-xl p-2">
    <Image src={aboutImage} alt="" className="aspect-square w-full rounded-lg object-cover" sizes="(min-width: 768px) 50vw, 100vw" placeholder="blur" />
  </div>
  ```
- **GOTCHA (Issue A)**: correct subject (an interior mood image), but a 512px preview — soft in this frame, accepted as-is for F2 per client. `alt=""` (decorative) is the right choice — **do not** reuse the export's fictional `data-alt` ("professional executive"), which doesn't match the image.
- **GOTCHA**: static import from `public/` needs the relative `../../../public/...` path (no `@/` alias for public). `about/page.tsx` is one level deeper than `page.tsx`, but both sit under `src/app`, so the depth to `public/` is the same **three** `../` — verify against `Hero.tsx`'s working import.
- **GOTCHA**: `.jpg` extension but PNG bytes — Next's loader reads actual content, so it works; the mismatch is cosmetic. Do not rename in F2 (the user declined a rename earlier).
- **GOTCHA**: **not** `fill` — this image is contained with a known aspect ratio. `fill` would collapse without a sized positioned parent.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 5 — ADD the Pillars section (into `about/page.tsx`)

- **IMPLEMENT**: `aboutcode.html:168–219`. Section with the multi-stop lavender band (same one-off inline-gradient rationale as Home's Mission — comment it). Centered `SectionHeading` (title "What Sets Us Apart", lede from line 172–174, `align="center"`, `size="xl"`). Then `grid gap-8 md:grid-cols-3` mapping `about.pillars` → `<Card>` with `<Icon name={p.icon} />`.
- **THEN** the certification row (line 208–217): `mt-16 flex flex-wrap justify-center gap-12`, mapping `certificationList` → an item with `<Icon name="verified" />` (BadgeCheck) + the `abbr` label. **Issue B**: render from the list; if `verified: false` you may still show it for now, but the data flag exists for D8.
- **PATTERN**: `SectionHeading` centered — see F1 usage.
- **VALIDATE**: `npx tsc --noEmit`

### Task 6 — ADD the Values section (into `about/page.tsx`) — NEW LAYOUT

- **IMPLEMENT**: `aboutcode.html:221–269`. `flex flex-col md:flex-row gap-gutter`. Left (`md:w-1/3`): `SectionHeading` (title "Our Values", lede from line 225–227, `size="lg"`). Right (`md:w-2/3`): a list mapping `about.values` → a row with a numbered circle (`01`/`02`/`03`) and the value title + description.
  ```tsx
  <div className="flex items-start gap-6">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 font-bold text-accent">
      {String(i + 1).padStart(2, "0")}
    </span>
    <div>
      <h4 className="text-headline-md font-bold text-ink">{value.title}</h4>
      <p className="mt-2 text-body-md leading-relaxed text-ink-muted">{value.body}</p>
    </div>
  </div>
  ```
- **GOTCHA**: this numbered layout is unique to About — inline it in the page. Only extract a `ValueList` component if it reads cleanly, which for one caller it does not. Default: inline.
- **GOTCHA**: derive the `01`/`02`/`03` from the map index (`padStart`), do not hardcode in content.
- **VALIDATE**: `npx tsc --noEmit`

### Task 7 — ADD the CTA banner + finalize composition

- **IMPLEMENT**: append `<CtaBanner {...about.cta} />`. Confirm final order: Hero → Pillars → Values → CtaBanner.
- **GOTCHA**: import from `@/components/sections/CtaBanner` — do not re-implement.
- **VALIDATE**: `npx tsc --noEmit && npm run build` — `/about` must appear and be `○ (Static)`.

### Task 8 — VERIFY gates (mirror F1 Tasks 6–8)

- **Static render**: `npm run build 2>&1 | grep -E "/about"` → `○ (Static)`.
- **Stale refs**: the F1 grep, now including `/about` output — must be clean:
  ```bash
  ! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss|font-headline-|font-body-|font-label-|bg-primary-container|text-on-surface|max-w-container-max" src/ && echo clean
  ```
- **No placeholders shipped** (pillars/values now filled): `! curl -s localhost:3000/about | grep -q "PLACEHOLDER" && echo "no placeholders"`.
- **JS-disabled**: `curl -s localhost:3000/about | grep -c "What Sets Us Apart"` ≥ 1; same for "Our Values" and each pillar title.

### Task 9 — VALIDATE fidelity, responsiveness, accessibility

- **Manual**: `open "HTML files/aboutcode.html"` beside `localhost:3000/about` at 375 / 768 / 1440.
  1. Section order; pillar card border alternation (lavender/aqua/lavender); icon wells
  2. **375px**: hero grid stacks (image below text or above — match the export's source order); values list stacks; no horizontal scroll
  3. **768px**: hero 2-col; pillars 3-col; values 1/3 + 2/3
  4. Nav active state: "About" is accent-underlined (F0 `usePathname` — verify, no code)
  5. Keyboard: skip link → nav → hero button → … → footer; focus visible throughout
  6. axe: zero critical; check contrast of the numbered-circle `text-accent` on surface, and `text-ink` over the lavender pillar band
  7. Lighthouse ≥ 90 ×4; the About hero image is the likely LCP — confirm it's reasonable (note: the 512px placeholder will hurt quality but not necessarily the metric)
- **Automated**: `npx eslint src/ && npx tsc --noEmit && npm run build`

---

## TESTING STRATEGY

**No test framework exists** (only `dev`/`build`/`start`/`lint`). As with F1, do not install one — that's a separate scope decision. The real gates for a static content page are static analysis + visual diff + accessibility.

### Static analysis
`tsc --noEmit`, `eslint src/`, `next build` — all clean; `/about` prerendered `○ (Static)`.

### Visual regression (primary gate)
Side-by-side against `aboutcode.html` at three breakpoints.

### Accessibility
axe zero critical; full keyboard traversal; image has a truthful/empty alt (never the fictional one); numbered-circle and lavender-band contrast verified.

### Edge cases
- **JS disabled** → full render
- **375px** → hero + values stack; no horizontal scroll
- **Long value copy** (drafts may run long) → numbered rows don't break alignment
- **D8 resolves to "no WOSB"** → removing the WOSB line from `certificationList` cleanly drops it from the cert row with no layout break
- **`prefers-reduced-motion`** → no motion introduced

---

## ACCEPTANCE CRITERIA

- [ ] `/about` renders Hero → Pillars (+ cert row) → Values → CtaBanner in the export's order
- [ ] Matches `aboutcode.html` at 375 / 768 / 1440 (documented deviations excepted)
- [ ] All 6 placeholders filled from `designs/founder-content.md`; **zero `[PLACEHOLDER]` in output**
- [ ] The 3 values are marked `DRAFT — confirm with founder` in `about.ts` and flagged in the report
- [ ] Certification row is data-driven from `site.ts` `certificationList` (Issue B / D8 mitigation)
- [ ] Hero image uses `next/image` (contained, not `fill`) with a truthful or empty `alt` — never the export's fictional `data-alt` (Issue A)
- [ ] "Meet the Founder" → `/contact` (Issue C default, flagged)
- [ ] `CtaBanner` reused, not re-ported
- [ ] Copy in `src/content/about.ts`; no inline strings in JSX
- [ ] Zero `"use client"`; zero hex literals; no `<main>` in the page
- [ ] `/about` prerendered `○ (Static)`; renders with JS disabled
- [ ] Stale-ref grep clean
- [ ] axe zero critical; keyboard traversal; Lighthouse ≥ 90 ×4
- [ ] `tsc`, `eslint`, `build` clean

---

## COMPLETION CHECKLIST

- [ ] All 9 tasks completed in order, each validated
- [ ] Visual diff at all three breakpoints
- [ ] No lint/type errors
- [ ] **Deviations + open items reported** (Issues A/B/C, DRAFT values)
- [ ] `PRD.md` §16 F2 status → Built; D2 updated (About pillars closed; values pending founder confirm)

---

## NOTES

### Open items to surface in the execution report
1. **Issue A — image**: About hero uses the correct interior mood image, but at 512px it's soft. Accepted as-is for F2; higher-res export is a post-F2 follow-up (currently blocked). Ships `alt=""`.
2. **Issue B — D8**: cert row asserts WOSB; unverified. Data-driven so removal is trivial once confirmed.
3. **Issue C — "Meet the Founder"** defaults to `/contact`. Confirm or redirect.
4. **DRAFT values**: Expertise/Calmness/Professionalism copy is inferred, not founder-authored. Needs sign-off.

### Design decisions
- **Values list inlined, not componentized** — one caller, distinct layout; a component would be premature abstraction. (Contrast `CtaBanner`, which had three callers and was rightly extracted in F1.)
- **Certifications data-driven** — the one structural upgrade over a literal port, justified entirely by D8: it turns a possible legal-claim removal into a one-line edit.
- **Hero image contained, not `fill`** — unlike F1's full-bleed hero. Different tool for a different job; calling this out because it's the most likely place to wrongly copy F1.

### Known follow-ups (do NOT fix in F2)
- Real founder photography (D3), WOSB verification (D8), a dedicated founder page (§13 future) — all out of scope here.

### Confidence
**8 / 10** for one-pass success. Slightly below F1 because F2 involves real copywriting (the values are genuinely under-specified by the source) and one new layout, versus F1's pure structural port. Correctness risk is low — every primitive exists and is proven; the residual risk is copy quality (the DRAFT values) and fidelity of the two-column hero + numbered list at small breakpoints.
