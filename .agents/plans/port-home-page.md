# Feature: Port the Home Page (F1)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types and components. Import from the right files.

> **Read `PRD.md` §16 (Feature Lineup) and §17 (Open Decisions) before starting.**
> **`AGENTS.md` mandates reading `node_modules/next/dist/docs/` before writing Next.js code. This is Next.js 16.2.10 — do not assume training-data APIs.**

## Feature Description

Port `HTML files/home-code.html` (288 lines, a standalone Stitch export) into the Next.js App Router as `/`, reusing the F0 foundation. The page is the primary landing surface for all three personas in `PRD.md` §3 and carries the site's core proposition: *"Empowering Transitions with Calm & Clarity."*

Five sections, top to bottom: **Hero** (full-bleed sunrise image, badge, h1, lede, two CTAs) → **Mission** (lavender gradient band, placeholder copy) → **Introduction** (5/7 asymmetric grid + three-card service bento) → **CTA banner** → Footer (F0).

This is a **port, not a design task**. The visual language is settled. The work is translating one static document into composed Server Components without losing fidelity — while fixing four defects that exist in the source itself.

## User Story

As a **transitioning service member or executive** arriving from a LinkedIn link or peer referral,
I want to **understand within seconds that this is a veteran-owned coaching practice and what it offers**,
So that **I can decide whether to keep reading — on whatever device I happen to be holding.**

## Problem Statement

The Home design exists only as a standalone HTML file that cannot ship:

1. It loads Tailwind from `cdn.tailwindcss.com` (explicitly not for production) and Manrope + Material Symbols from render-blocking `<link>` tags.
2. Its hero image is an **expiring** `lh3.googleusercontent.com/aida-*` URL, applied as a CSS `background-image` — which bypasses `next/image` entirely and would ship a 1.1MB PNG unoptimized to every visitor, blowing the LCP < 2.5s target (`PRD.md` R2b).
3. Its hero lede is **structurally malformed**: the body copy sits *outside* its `<p>`, so it renders with none of its intended styling.
4. Its nav and footer are duplicated markup, and every link is `href="#"`.
5. Its mission copy is `[PLACEHOLDER]`.

## Solution Statement

Compose the page from F0 primitives as a **statically-rendered Server Component**. Copy moves into `src/content/home.ts` as typed fields — so the placeholder becomes a *named, visible* gap rather than a string hiding in JSX. The hero CSS background becomes `<Image fill priority>` with the gradient as an overlay div, preserving the look while gaining AVIF/WebP and a responsive srcset. The malformed lede becomes the styled paragraph its classes clearly intended.

Zero client JavaScript is added: every section is static. `TopNav` (F0) remains the page's only client component.

## Feature Metadata

**Feature Type**: New Capability (port)
**Estimated Complexity**: Medium — low logic, high fidelity bar, four source defects to fix
**Primary Systems Affected**: `src/app/page.tsx`, `src/content/`, `src/components/sections/`, `src/components/ui/Badge.tsx` (radius fix)
**Dependencies**: All already installed — `next@16.2.10`, `react@19.2.4`, `tailwindcss@4`, `lucide-react@1.24.0`. **No new packages.**

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

- `HTML files/home-code.html` — **the source of truth for this port.** Read it whole.
  - lines 11–101 — the v3 `tailwind.config`; already ported to `@theme`. Reference only, do not copy.
  - lines 103–131 — `<style>` block: `.glass-card`, `.hero-gradient`, `.ocean-blur`. First two already in `globals.css`. **`.ocean-blur` (123–130) is DEAD — defined, never referenced. Do not port it.**
  - lines 152–171 — Hero
  - line 161 — **the malformed lede.** See Defect 1.
  - lines 172–183 — Mission
  - lines 185–228 — Introduction + bento
  - lines 230–248 — CTA banner
- `src/app/globals.css` — the `@theme` token block. **Every class you write must resolve to a token here.** No hex literals in components.
- `src/components/ui/Button.tsx` — `variant: "solid" | "outline"`, `size: "sm" | "md" | "lg"`. Passing `href` renders a `<Link>`; omitting it renders a `<button>`. Base already includes `rounded-lg font-bold`.
- `src/components/ui/Card.tsx` — props: `icon?: ReactNode`, `iconWell?: "lavender" | "aqua" | "lavender-soft"`, `accent?: "lavender" | "accent"`, `title: string`, `children`.
- `src/components/ui/Badge.tsx` — the uppercase lavender pill. **Contains a radius bug — see Task 1.**
- `src/components/ui/SectionHeading.tsx` — exports **both** `SectionHeading` and `AccentRule`. `size: "lg" | "xl"`, `align: "left" | "center"`, `rule: boolean`.
- `src/components/ui/Container.tsx` — the `max-w-site mx-auto px-margin-mobile md:px-margin-desktop` wrapper. Accepts `as` for the element type.
- `src/components/ui/icons.tsx` — `Icon` + the Material→Lucide map, keyed by the export's own glyph names.
- `src/content/site.ts` — the established content-module pattern. Mirror its shape.
- `src/app/layout.tsx` — already renders `TopNav`, `<main id="main">`, `Footer`. **`page.tsx` must NOT render nav/footer/main.**
- `src/lib/cn.ts` — `cn()` class joiner.

### New Files to Create

- `src/content/home.ts` — all Home copy as typed fields
- `src/components/sections/CtaBanner.tsx` — **shared**; F2 and F3 will reuse it verbatim
- `src/components/sections/Hero.tsx` — Home-specific
- `src/app/page.tsx` — **UPDATE** (currently the create-next-app starter; replace entirely)

### Relevant Documentation — READ BEFORE IMPLEMENTING

Local docs are authoritative over anything remembered. `AGENTS.md` requires this.

- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
  - Sections: *Local images*, *`fill`*
  - Why: static imports auto-provide `width`/`height`/`blurDataURL`; `fill` requires a positioned parent.
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
  - Why: per-page `metadata` export. Root `layout.tsx` sets a `template`, so this page exports `title` only.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - Why: confirm no `"use client"` creeps in.
- [Tailwind v4 — Theme variables](https://tailwindcss.com/docs/theme)
  - Why: v4 is CSS-first. There is **no `tailwind.config.js`** in this project. Tokens live in `@theme`.

### Patterns to Follow

**Content modules** — mirror `src/content/site.ts`: named `const` exports, `as const`, comments recording *why* a value is what it is.

```ts
export const site = { name: "Dennis Ventures", /* … */ } as const;
```

**Token renames** — the export's Material names are dead. Translate every one:

| Export class | Use instead | Note |
|---|---|---|
| `bg-primary-container` | `bg-lavender` | |
| `text-on-primary-container` | `text-lavender-ink` | |
| `bg-secondary` / `text-secondary` | `bg-accent` / `text-accent` | |
| `text-on-secondary` | `text-accent-ink` | |
| `text-on-surface` | `text-ink` | |
| `text-on-surface-variant` | `text-ink-muted` | |
| `bg-surface-container-low` | `bg-surface-sunken` | |
| `bg-tertiary-container` | `bg-aqua-soft` | |
| `border-outline-variant` | `border-outline-soft` | |
| `max-w-container-max` | `max-w-site` | prefer `<Container>` |
| `py-section-padding` | `py-section` | |
| `text-headline-xl-mobile md:text-headline-xl` | `text-headline-xl-tight md:text-headline-xl` | |
| `font-headline-*`, `font-body-*`, `font-label-*` | **drop entirely** | every family was Manrope; `font-sans` on `<body>` covers it |

**Radius** — ⚠️ the export's bare `rounded` = `0.5rem`, but Tailwind v4's bare `rounded` = `0.25rem`. Our `--radius-md` = `0.5rem`. **Export `rounded` → our `rounded-md`.** `rounded-lg` (0.75rem) and `rounded-xl` (1rem) match 1:1 and need no translation.

**Composition** — sections are components; `page.tsx` is a thin composition. Copy comes from `src/content/home.ts`, never inline.

**Anti-patterns to avoid**
- ❌ `"use client"` anywhere in this feature
- ❌ hex literals in components (`bg-[#00a8cc]`) — use `bg-accent`
- ❌ rendering `<main>`, `<nav>`, or `<footer>` in `page.tsx` — `layout.tsx` owns them
- ❌ `<button>` for anything that navigates — `Button` with `href` renders a `<Link>`
- ❌ inline `style="margin-top: 70px"` spacing hacks — use spacing tokens
- ❌ copying `.ocean-blur` — dead CSS

---

## THE FOUR SOURCE DEFECTS

Each is a bug **in the export**, not in the translation. Fix all four.

### Defect 1 — the malformed hero lede (line 161) ⚠️ VISUAL CHANGE

The export emits:

```html
<p class="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto pt-5" style="margin-top: 70px;"></p>
<div><br/></div><div><br/></div>
A steady hand in your sea of change. We coach across health, life, career transitions, and executive growth, whatever comes next.
<p></p>
```

An **empty** styled `<p>`, two `<br>` spacer divs, raw text inheriting nothing, then another empty `<p>`. The text renders at `body-md`, full-width, unstyled — the styling was clearly meant to wrap it.

**Fix:** one real paragraph — `text-body-lg text-ink-muted max-w-xl mx-auto`, spacing from tokens, `<br>` divs and the `margin-top: 70px` hacks deleted.

> **This changes rendered output**: the lede becomes larger (18px vs 16px) and narrower (`max-w-xl`). That is the export's evident intent, and it is logged as a deviation in `PRD.md`. **Flag it in the execution report so the human can confirm against the Stitch preview.**

### Defect 2 — hero image is a CSS background (line 152)

`background-image: linear-gradient(…), url('https://lh3.googleusercontent.com/aida/…')` — expiring URL, and CSS backgrounds bypass `next/image`.

**Fix:** `<Image fill priority>` from the local asset, gradient as a sibling overlay div. See Task 4 for exact structure.

### Defect 3 — `.hero-gradient` is vestigial on the hero (line 152)

The section carries `class="… hero-gradient …"`, but its inline `background-image` **overrides** the class's radial gradient. The class does nothing here.

**Fix:** do not put `hero-gradient` on the Home hero. Keep the class in `globals.css` — F4 (Contact) uses it on `<main>`, where it is *not* overridden.

### Defect 4 — mission copy is `[PLACEHOLDER]` (line 179)

`[PLACEHOLDER: Insert mission statement here - 1 to 2 sentences describing the firm's dedication to bridging executive excellence and service-driven resilience.]`

**Fix:** a typed field in `src/content/home.ts`. **Do NOT invent the copy** — it needs the founder's voice (`PRD.md` D2). Keep the placeholder text as the value and make it structurally obvious.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation
Fix the `Badge` radius bug, then establish the content module so no component ever inlines a string.

### Phase 2: Core Implementation
Build `Hero` and the shared `CtaBanner`. Hero is the only section with real structural complexity (layered image + gradient + content).

### Phase 3: Integration
Compose `page.tsx` from the sections, add page metadata, delete the starter content.

### Phase 4: Validation
Typecheck, lint, build, then **visual diff against the export at 375 / 768 / 1440**, plus a JS-disabled check and an axe pass.

---

## STEP-BY-STEP TASKS

Execute in order. Each task is atomic and independently validated.

### Task 1 — UPDATE `src/components/ui/Badge.tsx`

- **IMPLEMENT**: change `rounded-md` → `rounded-lg`.
- **WHY**: `home-code.html:155` and `aboutcode.html:144` both use `rounded-lg` (0.75rem) on the badge. F0 shipped `rounded-md` (0.5rem). This is an F0 fidelity bug found during F1 planning — fix at the source so F2/F3/F4 inherit it.
- **GOTCHA**: `Badge` is shared. This is intentionally a global correction, not a Home-local override. Do not pass a `className` override to patch it per-page.
- **VALIDATE**: `grep -n "rounded-lg" src/components/ui/Badge.tsx`

### Task 2 — CREATE `src/content/home.ts`

- **IMPLEMENT**: every Home string as typed fields, grouped by section: `hero` (badge, headline parts, lede, two CTAs), `mission` (heading + `statement`), `intro` (heading, two paragraphs), `services` (array of 3: `icon` keyed to `IconName`, `title`, `body`, `iconWell`, `accent`), `cta` (heading, body, button).
- **PATTERN**: mirror `src/content/site.ts` — named exports, `as const`.
- **IMPORTS**: `import type { IconName } from "@/components/ui/icons";`
- **IMPLEMENT (headline split)**: the h1 is `Empowering Transitions with <span class="text-secondary">Calm & Clarity</span>`. Model as `{ lead: "Empowering Transitions with", accent: "Calm & Clarity" }` so the component owns markup and the content module owns words.
- **GOTCHA**: `mission.statement` is D2-blocked. Keep the `[PLACEHOLDER: …]` text as the value and mark it with a comment. **Do not write mission copy yourself.**
- **GOTCHA**: exact service copy from `home-code.html:209–224` — "Optimizing vitality for leaders who cannot afford to burn out." / "Navigating high-stakes environments with precision and authority." / "Guiding you through the transition as one phase of life ends and the next begins with clarity and purpose." Transcribe, don't paraphrase.
- **IMPLEMENT (icons + accents)**: card 1 `clinical_notes`, well `lavender`, accent `lavender` · card 2 `schema`, well `aqua`, accent `accent` · card 3 `sync`, well `lavender-soft`, accent `lavender`. (From `home-code.html:205–225`.)
- **VALIDATE**: `npx tsc --noEmit`

### Task 3 — CREATE `src/components/sections/CtaBanner.tsx`

- **IMPLEMENT**: Server Component. Props `{ heading: string; body: string; action: { href: string; label: string } }`.
- **PATTERN**: from `home-code.html:230–248`. Outer `<section className="py-section">` → `<Container>` → `<div className="relative overflow-hidden rounded-xl bg-lavender p-12 text-center md:p-24">` → dots overlay `<div aria-hidden className="cta-dots absolute inset-0 opacity-10" />` → `<div className="relative z-10 mx-auto max-w-2xl">` with `h2` (`text-headline-xl-tight md:text-headline-xl text-ink`), body (`text-body-lg text-ink-muted`), and `<Button href size="lg">`.
- **IMPORTS**: `Container`, `Button`.
- **GOTCHA**: the `.cta-dots` utility already exists in `globals.css` — do **not** re-inline `bg-[radial-gradient(#00a8cc_1px,transparent_1px)]`.
- **GOTCHA**: **this component is shared.** `aboutcode.html:271–282` and `solution-code.html:211–226` use the same banner. Keep it prop-driven and page-agnostic — no Home-specific defaults.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4 — CREATE `src/components/sections/Hero.tsx`

- **IMPLEMENT**: Server Component rendering the layered hero.
- **PATTERN** — layering (this exact order matters):

```tsx
<section className="relative flex min-h-screen items-center overflow-hidden pt-20">
  <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-center" placeholder="blur" />
  <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(rgba(244,250,253,0.1) 0%, rgba(244,250,253,0.4) 50%, rgba(244,250,253,1) 100%)" }} />
  <Container className="relative z-10 flex flex-col items-center text-center">
    {/* badge, h1, lede, buttons */}
  </Container>
</section>
```

- **IMPORTS**: `import Image from "next/image";` · `import heroImage from "../../../public/images/home-hero.png";` (static import → automatic width/height/`blurDataURL`) · `Container`, `Badge`, `Button`, `home` content.
- **GOTCHA**: `fill` **requires** a positioned ancestor. The `relative` on `<section>` is load-bearing — do not remove it.
- **GOTCHA**: **no negative z-index.** `Image` and the gradient are both `absolute`; the gradient paints above the image purely by DOM order. Content wins via `relative z-10`. Negative z-index would escape the stacking context and hide behind the section.
- **GOTCHA**: `alt=""` is **correct and deliberate** — the image is a decorative pastel sunrise over open water; the `<h1>` carries all meaning. An empty alt is the right accessible choice for decorative imagery. Do not invent descriptive alt text.
- **GOTCHA**: `priority` is **required** — this is the LCP element. Without it Next lazy-loads it and LCP regresses past the 2.5s gate.
- **IMPLEMENT (Defect 1)**: the lede is ONE `<p className="mx-auto mt-6 max-w-xl text-body-lg text-ink-muted">`. No `<br>` divs. No inline `margin-top`.
- **IMPLEMENT (Defect 3)**: **do not** add `hero-gradient` to this section.
- **GOTCHA**: the export's inner div has `-mt-32` (`home-code.html:154`) offsetting the `min-h-screen` centering, plus `pt-20` clearing the fixed nav. Reproduce the optical result, but verify at 375px that the badge is not hidden behind `TopNav`. If it collides, prefer adjusting the offset over reintroducing `margin-top: 70px`.
- **IMPLEMENT (buttons)**: `flex flex-wrap justify-center gap-4`, spaced with a token (`mt-10`), not `margin-top: 70px`. "Start Your Journey" → `variant="solid"`; "View Solutions" → `variant="outline" href="/solutions"`.
- **GOTCHA**: contrast — the image is very pale and the gradient fades to opaque `#f4fafd` at the bottom, so `text-ink` (`#191c1e`) should pass AA comfortably. **Verify with axe at Task 9 rather than assuming.**
- **VALIDATE**: `npx tsc --noEmit`

### Task 5 — UPDATE `src/app/page.tsx` (Mission + Introduction inline, then compose)

- **IMPLEMENT**: delete the create-next-app starter entirely. Compose: `<Hero />` → Mission → Introduction → `<CtaBanner {...home.cta} />`.
- **IMPLEMENT (Mission)**: `home-code.html:172–183`. Section with the multi-stop band — this one gradient has no token and is genuinely one-off, so an inline `style` is acceptable here (unlike the spacing hacks): `linear-gradient(to bottom, transparent 0%, #e6e6fa 20%, #e6e6fa 80%, #f4fafd 100%)`. Add a comment explaining why it is inline. Inner: `py-24 md:py-32`, `<Container className="text-center">`, `max-w-3xl mx-auto`, h2 `text-headline-xl-tight md:text-headline-xl`, then `mission.statement`.
- **IMPLEMENT (Introduction)**: `home-code.html:185–228`. `<section className="bg-surface pb-24">` → `<Container>` → `grid items-center gap-gutter md:grid-cols-12`; left `md:col-span-5` = h2 (`text-headline-lg-tight md:text-headline-lg`) + `<AccentRule />`; right `md:col-span-7` = two `text-body-lg text-ink-muted` paragraphs. Then the bento: `mt-20 grid grid-cols-1 gap-8 md:grid-cols-3`, mapping `home.services` → `<Card>` with `<Icon name={s.icon} />`.
- **PATTERN**: `SectionHeading` fits the Introduction's left column (title + rule, no lede). Use it if it fits cleanly; if the 5/7 split fights it, compose `AccentRule` directly — do not contort the primitive.
- **GOTCHA**: `AccentRule` is exported from `SectionHeading.tsx`, not its own file.
- **GOTCHA**: no `<main>` wrapper — `layout.tsx:44` already provides `<main id="main">`.
- **IMPLEMENT (metadata)**: `export const metadata = { title: "Empowering Transitions with Calm & Clarity" }`. Root layout's template renders it as `Dennis Ventures | …`. **Do not** set `metadataBase` or `openGraph` here; the root owns them.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 6 — VERIFY static rendering

- **IMPLEMENT**: confirm `/` is prerendered as static.
- **VALIDATE**: `npm run build 2>&1 | grep -E "^[┌├└└].*/"` — `/` must show `○ (Static)`. If it shows `ƒ (Dynamic)`, something pulled in a client/dynamic API — find and remove it.

### Task 7 — VERIFY no stale references remain

- **VALIDATE**:
```bash
! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss|font-headline-|font-body-|font-label-|bg-primary-container|text-on-surface|max-w-container-max" src/ && echo "clean"
```
- **GOTCHA**: must exit clean. Any hit means a token rename was missed.

### Task 8 — VERIFY it works with JavaScript disabled

- **IMPLEMENT**: the whole page must render server-side.
- **VALIDATE**:
```bash
curl -s localhost:3000/ | grep -c "Empowering Transitions"   # >= 1
curl -s localhost:3000/ | grep -c "Health Coaching"          # >= 1
```
- **WHY**: `PRD.md` §11 makes this a launch gate. `solution-code.html`'s `IntersectionObserver` blanket-applies `opacity-0` and would make the page invisible without JS — Home must not inherit that pattern in F3.

### Task 9 — VALIDATE fidelity, responsiveness, accessibility

- **IMPLEMENT**: open the export and the port side by side at **375 / 768 / 1440**.
- **VALIDATE (manual)**:
  1. `open "HTML files/home-code.html"` next to `localhost:3000`
  2. Section order, spacing rhythm, card borders (lavender / aqua / lavender), icon wells
  3. **375px**: no horizontal scroll; hero badge clear of `TopNav`; bento stacks to 1 column
  4. **768px**: bento at 3 columns; intro grid still stacked (`md:` = 768, so it engages here — confirm against the export)
  5. Keyboard: Tab through — skip link → nav → hero CTAs → banner CTA → footer; focus always visible
  6. axe DevTools: **zero critical**; specifically confirm hero `text-ink` contrast over the pale image
  7. Lighthouse: all four ≥ 90; **LCP < 2.5s** (the hero image is the LCP element)
- **VALIDATE (automated)**: `npx eslint src/ && npx tsc --noEmit && npm run build`

---

## TESTING STRATEGY

**There is no test framework in this project** — `package.json` has only `dev`/`build`/`start`/`lint`, and no vitest/jest/playwright config exists. Do **not** install one as part of F1; that is a scope decision for the human, not a side effect of a page port.

The template's "80% unit coverage" bar does not meaningfully apply to a static marketing page with no logic. The honest gates for this feature are:

### Static analysis
`npx tsc --noEmit` — zero errors. `npx eslint src/` — zero errors. `npm run build` — succeeds, `/` prerendered `○ (Static)`.

### Visual regression (manual, primary gate)
Side-by-side against `HTML files/home-code.html` at three breakpoints. This is the real test — fidelity is the feature.

### Accessibility
axe DevTools zero critical. Full keyboard traversal. Hero contrast verified, not assumed.

### Edge cases
- **JS disabled** → page fully renders (Task 8)
- **375px narrow** → no horizontal scroll; hero clear of the fixed nav
- **Slow 4G** → `priority` + `placeholder="blur"` mean no blank hero; LCP < 2.5s
- **Long placeholder mission copy** → the `max-w-3xl` band must not overflow when D2 copy lands
- **`prefers-reduced-motion`** → no motion is introduced here; F0's `TopNav` already honors it

---

## ACCEPTANCE CRITERIA

- [ ] `/` renders Hero, Mission, Introduction + bento, CtaBanner in the export's order
- [ ] Visually matches `home-code.html` at 375 / 768 / 1440 (deviations below excepted)
- [ ] **Defect 1 fixed** — lede is one styled `<p>`; no `<br>` spacers; no inline `margin-top`
- [ ] **Defect 2 fixed** — hero uses `<Image fill priority>`; zero CSS `background-image` for the photo
- [ ] **Defect 3 fixed** — no `hero-gradient` on the Home hero
- [ ] **Defect 4 respected** — mission copy is a typed field; placeholder text **not** invented
- [ ] `.ocean-blur` not ported
- [ ] All copy lives in `src/content/home.ts`; no inline strings in JSX
- [ ] `CtaBanner` is prop-driven and reusable by F2/F3 without modification
- [ ] `Badge` radius corrected to `rounded-lg`
- [ ] Zero `"use client"` in this feature
- [ ] Zero hex literals in components
- [ ] `page.tsx` renders no `<main>`/`<nav>`/`<footer>`
- [ ] Task 7's grep exits clean
- [ ] Page renders with JS disabled
- [ ] `/` prerendered `○ (Static)`
- [ ] axe zero critical; full keyboard traversal; Lighthouse ≥ 90 ×4; LCP < 2.5s
- [ ] `tsc`, `eslint`, `build` all clean

---

## COMPLETION CHECKLIST

- [ ] All 9 tasks completed in order
- [ ] Each task's validation passed immediately
- [ ] Visual diff done at all three breakpoints
- [ ] No linting or type errors
- [ ] Acceptance criteria all met
- [ ] **Deviations reported to the human** (see Notes)
- [ ] `PRD.md` §16 F1 status → ✅ Built

---

## NOTES

### Deviations requiring human confirmation

Report these explicitly when done — `PRD.md` §2 principle 1 requires deviations be decisions, not drift.

1. **Hero lede restyled (Defect 1)** — ⚠️ *changes rendered output*. The text becomes 18px and `max-w-xl` instead of 16px full-width. This is the export's clear intent, but the Stitch preview would have shown it unstyled. **Confirm against the preview.**
2. **Hero spacing retokenized** — `margin-top: 70px` × 2 and two `<br>` divs replaced with spacing tokens. Optical rhythm should match; exact pixels may differ by a few.
3. **Badge radius 0.5rem → 0.75rem** — F0 bug fix; affects About/Solutions/Contact too (correctly).

### Design decisions

- **`CtaBanner` extracted in F1, not later.** The banner is identical across three pages. Building it Home-specific then generalizing twice is strictly worse than building it prop-driven now. Cost: a slightly wider F1. Benefit: F2 and F3 each get a section for free.
- **Mission gradient stays inline.** It is a genuinely one-off four-stop band used on exactly one section. A token or utility for a single use is worse than a commented inline style. This is *not* a licence for inline styles generally — the `margin-top: 70px` hacks are still deleted.
- **`alt=""` on the hero is a decision, not an oversight.** Decorative imagery takes an empty alt; a description would be noise to a screen reader already receiving the `<h1>`.
- **Static import over `/images/home-hero.png` string.** Gets `width`/`height`/`blurDataURL` for free, killing CLS.

### Known follow-ups (do NOT fix in F1)

- **D2 (mission copy)** — blocked on the founder. F1 lands the structure.
- **D3 (imagery)** — `home-hero.png` at 1376×768 is adequate: ~1:1 on a 1440 viewport, ~1.9× upscale on retina, largely masked by the gradient. `about-portrait` and `contact-backdrop` are still 512px previews, but they are F2/F4's problem.
- **The nav CTA radius conflict** — `home-code.html:146` uses `rounded-lg`, but `contact-code.html:104` uses `rounded-full` for the *same* nav button. The exports disagree with each other. F0 chose `rounded-lg`. **Leave it. Flag it in F4**, where the conflict actually surfaces.

### Confidence

**8.5 / 10** for one-pass success. The page is static with no logic, every primitive already exists and is verified, and all four defects are diagnosed with fixes specified. The residual risk is fidelity judgement, not correctness: the `-mt-32` hero offset interacting with `min-h-screen` and the fixed nav at small breakpoints is the most likely thing to need a second pass, and Defect 1's restyle needs a human eye against the Stitch preview.
