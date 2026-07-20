# Dennis Ventures — Marketing Site PRD

**Status:** Draft · **Owner:** Kiera Wilson · **Created:** 2026-07-16
**Repo:** `dennis-ventures` · **Branch:** `main`

---

## 1. Executive Summary

Dennis Ventures LLC is a veteran-owned executive and health coaching practice (SDVOSB + WOSB certified) serving transitioning service members, executives, and government partners. This project delivers its public marketing site: four pages — Home, About, Solutions, Contact — built as a production Next.js application.

The designs already exist. They were produced in Google Stitch and exported as four standalone HTML files (`HTML files/*.html`), each a self-contained page carrying its own CDN Tailwind script, its own inline `tailwind.config` object, and its own duplicated nav and footer markup. This project is therefore **not a design project — it is a port**. The visual language is settled; the work is translating four disconnected static documents into one coherent, componentized, deployable application without losing fidelity along the way.

The value of doing this properly rather than shipping the HTML as-is: the exports duplicate their nav and footer four times over, depend on `cdn.tailwindcss.com` (explicitly not for production), reference images on expiring Google CDN URLs, and contain a design-system fork that would render Solutions in a different typeface than the rest of the site. Each of those is cheap to fix now and expensive to fix after launch.

**MVP goal:** a four-page site at production quality — accurate to the designs, responsive and navigable on mobile, with a working contact form — deployed to Vercel on a custom domain.

---

## 2. Mission

Give a coaching practice whose entire proposition is *"a steady hand in your sea of change"* a web presence that feels exactly that way: calm, credible, and unhurried, with its veteran-owned certifications legible to the government and enterprise buyers who screen for them.

**Core principles**

1. **Fidelity to the designs.** The port reproduces what Stitch generated. Deviations are decisions, made deliberately and recorded here — never drift.
2. **One source of truth per concept.** One nav, one footer, one token set, one card. The exports duplicate all four; the app must not.
3. **Credibility is the product.** SDVOSB and WOSB certifications are load-bearing sales assets for this audience, not badges. They stay prominent.
4. **Accessible by default.** Every visitor gets working navigation and readable contrast — not as a later pass, but as the definition of done.
5. **Boring where it counts.** A marketing site with a contact form does not need novel architecture. Static-render everything possible; ship the smallest thing that is genuinely good.

---

## 3. Target Users

### Primary: The Transitioning Service Member
Leaving active duty and translating military experience into civilian executive work. Often mid-to-senior. Evaluating whether this coach *gets it* — the veteran-owned signal is what earns the first read. High technical comfort; likely arrives on mobile from LinkedIn or a peer referral.

**Needs:** proof of shared background; a clear picture of what coaching actually involves; a low-commitment way to start a conversation.
**Pain:** generic coaching sites that could be selling anything to anyone.

### Primary: The Executive
Scaling into or already in a C-suite role, seeking clarity, sustainable performance, or a considered next move. Short on time and skeptical of fluff. Skims. Desktop, business hours.

**Needs:** to grasp the offer in under thirty seconds; signals of seriousness; a fast path to a conversation.
**Pain:** vague, jargon-heavy positioning that never says what is actually delivered.

### Secondary: The Government / Enterprise Partner
Sourcing coaching services against set-aside requirements. Actively looking for SDVOSB and WOSB status — the site may be filtered out or in on that basis alone.

**Needs:** unambiguous, immediately findable certification status; a professional impression that de-risks the referral.
**Pain:** certifications buried in a footer or absent entirely.

**Shared:** all three arrive on a small site and decide quickly. Slow loads, broken mobile nav, or placeholder text ends the visit.

---

## 4. MVP Scope

### ✅ In Scope

**Core functionality**
- ✅ Four pages routed under the App Router: `/`, `/about`, `/solutions`, `/contact`
- ✅ Shared `TopNav` — single component, active-route aware, sticky, scroll-shrink behavior preserved
- ✅ **Mobile navigation** — does not exist in any export; must be designed and built
- ✅ Shared `Footer` — single component, live copyright year
- ✅ Contact form with client + server validation, loading / success / error states
- ✅ Form submissions delivered by email via Resend
- ✅ Real routing on every link and CTA (all are `href="#"` today)

**Design system**
- ✅ Resolve the Solutions design-system fork (**§16 — blocking**)
- ✅ Port tokens from Stitch's v3 `tailwind.config` object to Tailwind v4 `@theme`
- ✅ Rename misleading Material tokens to semantic ones
- ✅ Define `.glass-card` and `.hero-gradient` once, globally (each is used in a file that never defines it)
- ✅ Reusable primitives: `Button`, `Card`, `SectionHeading`, `Badge`, `Field`

**Content & assets**
- ✅ Replace all expiring Stitch CDN images with owned assets in `/public`
- ✅ Fill 7 copy placeholders (**§16 — blocking**)
- ✅ Real `alt` text on every image (the About portrait currently ships `data-alt`, so it has none)

**Quality**
- ✅ Responsive at 375 / 768 / 1440
- ✅ WCAG 2.1 AA: contrast, focus rings, keyboard reachability, labeled inputs
- ✅ Per-page metadata + Open Graph
- ✅ Lighthouse ≥ 90 across all four categories
- ✅ Deployed to Vercel on a custom domain

### ❌ Out of Scope

- ❌ **Dark mode.** All four configs declare `darkMode: "class"`, but zero dark variants exist in the markup. It is declared, not designed. Building it means designing it — a separate project.
- ❌ **Scheduler integration.** "Book a Consultation" routes to `/contact` for MVP, behind a seam that lets Cal.com or Calendly drop in later.
- ❌ CMS — copy is small and stable; it lives in typed content files
- ❌ Blog, insights, or resources section
- ❌ Client portal, auth, or any logged-in surface
- ❌ Submission persistence — email delivery only, no database
- ❌ Analytics beyond Vercel's built-in
- ❌ i18n
- ❌ The Privacy / Terms / SDVOSB / WOSB footer pages (links render; destinations are a content dependency — see §14)

---

## 5. User Stories

**US-1 — Veteran evaluating fit**
*As a transitioning service member, I want to see the practice is veteran-owned within seconds of landing, so that I know the coach understands where I'm coming from before I invest more attention.*
Home hero carries the "Executive & Health Coaching" badge above the fold; "A Veteran-Owned Perspective on Growth" sits in the first scroll; SDVOSB/WOSB marks appear on Home, About, and Solutions.

**US-2 — Executive skimming the offer**
*As a time-poor executive, I want the three service lines legible at a glance, so that I can decide relevance without reading prose.*
The Solutions bento grid — Health & Life Coaching, Career & Executive Coaching, A Blended Approach — each an icon, a heading, two lines, and one action.

**US-3 — Government partner verifying status**
*As a partner sourcing against set-asides, I want certification status stated unambiguously, so that I can qualify the firm without emailing to ask.*
SDVOSB and WOSB appear in the footer sitewide and as dedicated cards in the Solutions "Strategic Transitions" section, spelled out in full rather than abbreviated.

**US-4 — Starting a conversation**
*As an interested visitor, I want to send a message and be told it arrived, so that I'm not left wondering whether to follow up.*
`/contact` accepts name, email, and message; validates inline; disables the button and shows a spinner while sending; then confirms success or explains the failure and preserves what was typed.

**US-5 — Mobile visitor**
*As someone opening this on my phone from a LinkedIn link, I want to reach any page, so that I can actually look around.*
A hamburger opens an accessible menu with all four routes and the booking CTA. **This does not exist in the designs and must be built.**

**US-6 — Keyboard and screen reader user**
*As someone who doesn't use a mouse, I want to operate the whole site from the keyboard, so that I can use it at all.*
Visible focus on every interactive element; logical tab order; the mobile menu traps focus while open and restores it on close; form errors are announced.

**US-7 — Understanding the approach**
*As a prospective client, I want to know what the firm believes, so that I can judge whether the style suits me.*
About carries Our Story, three differentiator pillars, and three numbered values. **All six descriptions are placeholders today.**

### Technical stories

**TS-1** — *As a developer, I want one nav and one footer component, so that a change lands once instead of four times.*
**TS-2** — *As a developer, I want design tokens defined once in `@theme`, so that no component hardcodes `#00a8cc`.*
**TS-3** — *As a developer, I want the Stitch exports preserved unmodified as reference, so that fidelity is checkable after the port.*

---

## 6. Core Architecture & Patterns

**Approach.** Static-first. All four pages are React Server Components rendered at build time. Exactly one client component (`TopNav`, for menu and scroll state) plus the contact form. The only server-side work is the form's route handler. No database, no session, no middleware.

```
dennis-ventures/
├── HTML files/                 # Stitch exports — READ-ONLY reference, never edited
├── PRD.md
├── public/
│   ├── images/                 # owned assets replacing Stitch CDN URLs
│   └── og/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # fonts, TopNav, Footer, base metadata
│   │   ├── globals.css         # @theme tokens + .glass-card + .hero-gradient
│   │   ├── page.tsx            # Home
│   │   ├── about/page.tsx
│   │   ├── solutions/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/contact/route.ts
│   ├── components/
│   │   ├── layout/             # TopNav, MobileMenu, Footer
│   │   ├── ui/                 # Button, Card, Badge, SectionHeading, Field
│   │   └── sections/           # Hero, ServiceGrid, ValueList, CtaBanner
│   ├── content/                # typed copy — site.ts, home.ts, about.ts, …
│   └── lib/                    # validation, utils
```

**Patterns**

- **Server-first.** `"use client"` only where interactivity demands it. Currently: `TopNav`, `ContactForm`.
- **Copy is data.** Section copy lives in typed objects under `src/content/`, not inline in JSX. Placeholder text becomes a typed field a non-developer can fill without touching a component.
- **Tokens, never literals.** Components reference `bg-accent`, never `bg-[#00a8cc]`. One `@theme` block is the only place hex appears.
- **Sections compose pages.** Each page is a thin composition of section components. The CTA banner is identical on Home, About, and Solutions — one `CtaBanner`, three usages.
- **The exports stay frozen.** `HTML files/` is reference material. Fidelity is verified by diffing rendered output against it; that only works if it never moves.

**Two behaviors need rework, not translation.** The scroll-shrink nav manipulates `classList` directly (`nav.classList.add('py-2')`) — in React it becomes a `useState` + scroll listener driving className. The Solutions fade-in `IntersectionObserver` blanket-applies `opacity-0` to every `section > div`, which means **if JS fails, the entire page is invisible**. The port must reverse that: visible by default, animation as progressive enhancement, and respecting `prefers-reduced-motion`.

---

## 7. Features

### 7.1 Navigation (`TopNav` + `MobileMenu`)
Sticky, `bg-surface/80` with `backdrop-blur-md`, shrinking `py-4` → `py-2` past 50px. Active route in accent with a bottom border — derived from `usePathname()`, not hardcoded per page as in the exports. **The mobile menu is net-new design work:** a hamburger under `md`, an accessible panel with the four routes plus the booking CTA, focus trapped while open, closing on Escape, route change, and outside click.

### 7.2 Contact form
Fields: Full Name, Email Address, Your Vision or Message. Client validation on blur; server re-validation in the route handler (never trust the client). States: idle → submitting (disabled + spinner) → success (confirmation, form cleared) or error (message preserved, cause explained, retry available). Honeypot field for spam. **The export's handler is truncated mid-function — there is nothing to port. This is written from scratch.**

### 7.3 Design tokens
A single `@theme` block in `globals.css`, ported from the winning Stitch config (§16) and semantically renamed. `.glass-card` and `.hero-gradient` are defined once here — note that `.glass-card` is *used* in `solution-code.html` and `.hero-gradient` is *used* in `contact-code.html`, but **neither file defines them**, so both pages are visually broken in the exports themselves. The port fixes bugs, not just formats.

### 7.4 UI primitives
`Button` (variants: `solid` / `outline`, sizes `sm` / `md` / `lg` — derived from the three button treatments recurring across all four pages), `Card` (the `.glass-card` shell with an optional accent bottom-border), `Badge` (the uppercase pill), `SectionHeading` (heading + the 64×6px accent rule that appears on every page), `Field` (label + input/textarea + error).

### 7.5 Content layer
Every string in `src/content/*.ts` behind a type. The 7 placeholders become required fields — the build surfaces them rather than letting `[PLACEHOLDER]` reach production.

---

## 8. Technology Stack

**Confirmed from `package.json` — already installed:**

| | Version | Notes |
|---|---|---|
| Next.js | 16.2.10 | App Router, Turbopack |
| React | 19.2.4 | Server Components default |
| Tailwind CSS | ^4 | **v4 — CSS-first `@theme`** |
| TypeScript | ^5 | strict |
| ESLint | ^9 | `eslint-config-next` |

**To add**

| Package | Purpose |
|---|---|
| `resend` | Contact form email delivery |
| `zod` | Shared client/server validation schema |
| `next/font/google` | Self-host Manrope — replaces the render-blocking `<link>` |

**Deliberately not added:** no UI kit (five primitives don't warrant one), no form library (three fields), no animation library (CSS transitions suffice), no CMS.

> ⚠️ **Two version traps.** (1) Stitch emits a **Tailwind v3** `tailwind.config` JS object; this project is **v4**, where tokens are CSS `@theme` variables. The config cannot be copied — it must be translated. (2) `AGENTS.md` warns that this Next.js version diverges from model training data and directs reading `node_modules/next/dist/docs/` before writing code. Both are honored.

**Icons.** All four pages use Material Symbols via a Google Fonts `<link>` with `?display=block`, which blocks render on a font request. Options: self-host the subset actually used (~12 glyphs) or swap for inline SVG. Decision deferred to Phase 1 — either beats the current arrangement.

---

## 9. Security & Configuration

**Auth:** none. Fully public site, no accounts, no protected routes.

**Environment**

| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Vercel env (server) | Email delivery — server-only, never `NEXT_PUBLIC_` |
| `CONTACT_TO_EMAIL` | Vercel env (server) | Inquiry destination |
| `NEXT_PUBLIC_SITE_URL` | Vercel env | Canonical URLs, OG tags |

`.env.local` is gitignored; `.env.example` is committed with empty values.

**In scope:** server-side validation of every field; honeypot + basic rate limiting on the route handler; secrets server-only; no PII stored anywhere; dependency audit before launch.

**Out of scope:** CAPTCHA (add only if spam materializes), WAF, SOC2/FedRAMP posture, CSP hardening beyond Next's defaults.

> **Note.** Inquiries may arrive from government-adjacent parties, but the form collects only name, email, and free text — no controlled or sensitive data. If that ever changes, this section is revisited before, not after.

---

## 10. API Specification

One endpoint.

### `POST /api/contact`

```jsonc
// Request
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'm transitioning out of active service this fall and…",
  "website": ""   // honeypot — must be empty
}
```

```jsonc
// 200 OK
{ "ok": true }

// 400 — validation failed
{ "ok": false, "errors": { "email": "Enter a valid email address." } }

// 429 — rate limited
{ "ok": false, "error": "Too many requests. Please try again shortly." }

// 500 — delivery failed
{ "ok": false, "error": "Message couldn't be sent. Please email us directly." }
```

Auth: none (public). Validated server-side by the same `zod` schema the client uses. A non-empty `website` returns `200` without sending — bots get no signal.

---

## 11. Success Criteria

**MVP is done when** all four pages are live on the custom domain, faithful to the designs, fully usable on a phone, with a contact form that reliably delivers mail — and no placeholder text anywhere.

**Functional**
- ✅ `/`, `/about`, `/solutions`, `/contact` all render and inter-link
- ✅ Every link and CTA resolves (zero `href="#"` remaining)
- ✅ Mobile nav works on a real device at 375px
- ✅ Contact form delivers email; all three states verified
- ✅ Zero `[PLACEHOLDER]` strings in the built output
- ✅ Zero references to `lh3.googleusercontent.com`
- ✅ Zero references to `cdn.tailwindcss.com`
- ✅ One nav component, one footer component, one token block
- ✅ `next build` clean; no TS or ESLint errors

**Quality**
- ✅ Lighthouse ≥ 90 in all four categories, all four pages
- ✅ LCP < 2.5s on 4G
- ✅ No CLS from font swap
- ✅ axe DevTools: zero critical violations
- ✅ Full keyboard traversal
- ✅ No horizontal scroll at 375px
- ✅ Site renders and navigates with JavaScript disabled *(the exports fail this today — see §6)*

**Experience**
- The Solutions page is visually indistinguishable in system from the other three
- The offer is graspable in under 30 seconds
- Certifications are findable without scrolling hunting

---

## 12. Implementation Phases

### Phase 0 — Decisions *(blocking — see §16)*
**Goal:** unblock the port.
- ✅ Ship the token comparison page; pick the canonical design system
- ✅ Source the 7 copy placeholders
- ✅ Confirm real images
- ✅ Create the Resend account, get the key
**Done when:** nothing in §16 is open.

### Phase 1 — Foundation *(~1 day)*
**Goal:** the system exists before any page uses it.
- ✅ Port the winning config to `@theme`, semantically renamed
- ✅ Self-host Manrope via `next/font`; resolve the icon strategy
- ✅ Define `.glass-card` + `.hero-gradient` globally
- ✅ Build `Button`, `Card`, `Badge`, `SectionHeading`, `Field`
- ✅ Build `TopNav` (incl. **the new mobile menu**) and `Footer`
- ✅ Wire `layout.tsx`
**Validation:** a scratch page renders every primitive in every variant; nav works at 375px; visual diff against the exports.

### Phase 2 — Pages *(~2 days)*
**Goal:** all four ported.
- ✅ Home — hero, mission, intro, service bento, CTA
- ✅ About — story, 3 pillars, 3 values, certifications, CTA
- ✅ Solutions — hero, 3 offerings, strategic transitions, CTA *(re-skinned to canonical)*
- ✅ Contact — header, form, imagery column
- ✅ Extract copy into `src/content/`; drop in real images
- ✅ Fix the home hero's malformed paragraph markup (body copy currently sits outside its `<p>`, with `margin-top: 70px` inline hacks)
- ✅ Rebuild fade-in as progressive enhancement
**Validation:** side-by-side against each export at all three breakpoints; no placeholders; no CDN URLs.

### Phase 3 — Form & polish *(~1 day)*
- ✅ `zod` schema; `/api/contact`; Resend; honeypot + rate limit
- ✅ All three form states
- ✅ Per-page metadata + OG images
- ✅ `sitemap.ts`, `robots.ts`, favicon
- ✅ Accessibility pass (axe + manual keyboard)
- ✅ Lighthouse pass
**Validation:** real submission lands in the real inbox; scores clear 90.

### Phase 4 — Launch *(~half day)*
- ✅ Vercel project, env vars, preview deploy
- ✅ Custom domain + DNS + SSL
- ✅ Cross-browser (Safari, Chrome, Firefox) + real iOS/Android
- ✅ Production smoke test
**Validation:** live, all pages reachable, form delivers from production.

**Estimate: ~4.5 working days** after Phase 0 clears. Phase 0 is the schedule risk — it depends on inputs outside the codebase.

---

## 13. Future Considerations

**Near-term:** scheduler integration at the `/contact` seam (the natural conversion endpoint for a coaching practice); the four footer legal/certification pages; Vercel Analytics.

**Medium:** dark mode — *designed*, then built; an insights/blog surface if content marketing starts; testimonials or case studies, which this audience weighs heavily; a founder bio page behind the existing "Meet the Founder" button, which currently has nowhere to go.

**Longer:** a CMS if a non-developer needs to edit copy regularly; intake questionnaires; capability statement downloads for government buyers; a client portal.

---

## 14. Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| **R1** | **Design-system fork.** Solutions uses Inter/grey/tighter-radii; the others use Manrope/aqua/looser. Porting as-is ships a visibly inconsistent site. | High | **Blocking decision, §16.** Comparison page in flight. Nothing in Phase 1 starts until it's called. |
| **R2** | **Stitch images were previews, not assets.** ✅ *Expiry neutralized* — all four captured to `public/images/` on 2026-07-16 while the URLs still resolved. But the captures came back **512px max**, i.e. generation previews. Two have since been replaced with usable versions; two have not. | Med *(was High)* | Hero and ocean now 1376×768 / 1200×896 → usable. **`about-portrait` + `contact-backdrop` remain 512px** and must be replaced (D3). Zero CDN references stays a launch gate. |
| **R2b** | **CSS backgrounds bypass `next/image`.** The home hero and contact backdrop are `background-image` in the exports. Ported literally, they'd ship 1.1MB PNGs unoptimized to every visitor and blow the LCP < 2.5s target. | Med | Convert both to `<Image fill>` with the gradient as an overlay div — same look, plus AVIF/WebP and a responsive srcset. Explicit Phase 2 work. |
| **R3** | **Copy placeholders block launch.** 7 unwritten strings — the home mission plus all 6 About descriptions. About is ~40% placeholder. | High | Phase 0 dependency, owned by the client, not the build. Typed content fields make the gap visible. Real risk: this is the likeliest schedule slip, since it needs the founder's voice and can't be invented. |
| **R4** | **Tailwind v3 → v4.** Stitch emits a v3 config object; this is v4 `@theme`. Copying it silently produces no styles at all. | Medium | Translation is explicit Phase 1 work with a visual diff gate. `AGENTS.md`'s directive to read the local docs first is honored. |
| **R5** | **Fidelity drift.** Four hand-ports across three breakpoints; small deviations accumulate into a site that no longer matches the designs. | Medium | Exports stay frozen as reference. Side-by-side diff per page per breakpoint. `ui-ux-reviewer` runs against each. |
| **R6** | **Mobile nav is undesigned.** Not a port — no export has one. Design decisions get made mid-build, where they get made badly. | Medium | Explicit Phase 1 scope with its own acceptance criteria, not a footnote on TopNav. Real-device testing before Phase 2. |
| **R7** | **Email silently fails.** A contact form that appears to work but delivers nothing is worse than none — inquiries vanish without anyone noticing. | Medium | Verify end-to-end from production in Phase 4. Surface real errors to the user with a direct-email fallback. Never fake success. |

---

## 15. Appendix

**Source designs** — read-only reference:

| File | Page | Lines | Notes |
|---|---|---|---|
| `HTML files/home-code.html` | Home | 288 | Manrope/aqua · malformed hero `<p>` · inline margin hacks |
| `HTML files/aboutcode.html` | About | 327 | Manrope/aqua · 6 placeholders · `data-alt` instead of `alt` |
| `HTML files/solution-code.html` | Solutions | 289 | **Forked system** · `.glass-card` undefined · undefined `bg-flow-2` · malformed `</script</script>` |
| `HTML files/contact-code.html` | Contact | 207 | **Truncated mid-function** · `.hero-gradient` undefined |

**Shared across all four:** nav + footer duplicated verbatim; `cdn.tailwindcss.com`; Stitch CDN images; `href="#"` throughout; `© 2024` (stale — it is 2026); `darkMode: "class"` declared with no dark variants.

**Project conventions**
- `AGENTS.md` → *"This is NOT the Next.js you know"* — read `node_modules/next/dist/docs/` before writing code
- `CLAUDE.md` → `@AGENTS.md`
- Configured agents: `nextjs-frontend-engineer`, `ui-ux-reviewer`, `code-quality-reviewer`

**Decisions already made:** Next.js + Tailwind (stack) · Resend + route handler (form) · `/contact` behind a seam (booking CTA) · Vercel (hosting).

**Known environment note:** Node 23 (non-LTS). Some tooling wants 20/22/24; installs and builds are clean today. Node 24 is the clean fix if anything surfaces.

---

## 16. Feature Lineup

The unit of work is a **feature**: one `/plan-feature` cycle producing a plan in `.agents/plans/`, then one `/execute` cycle implementing it. §12's phases describe *sequence*; this table is what actually gets planned and built.

| # | Feature | Plan file | Source export | Depends on | Status |
|---|---|---|---|---|---|
| **F0** | **Foundation** — tokens, primitives, `TopNav` + mobile menu, `Footer`, `layout` | *(none — see note)* | all four | — | ✅ Built |
| **F1** | **Home page** | `.agents/plans/port-home-page.md` | `home-code.html` | F0 | ✅ **Built & signed off** (2026-07-19) — automated gates green; mobile hero-badge collision fixed; visual review passed |
| **F2** | **About page** | `.agents/plans/port-about-page.md` | `aboutcode.html` | F0 | ⬜ Not planned |
| **F3** | **Solutions page** (incl. re-skin off the forked system) | `.agents/plans/port-solutions-page.md` | `solution-code.html` | F0 | ⬜ Not planned |
| **F4** | **Contact page** — layout, form UI, states | `.agents/plans/port-contact-page.md` | `contact-code.html` | F0 | ⬜ Not planned |
| **F5** | **Contact form backend** — `zod`, route handler, Resend, honeypot, rate limit | `.agents/plans/contact-form-backend.md` | *none — written from scratch* | F4 | ⬜ Not planned |
| **F6** | **SEO + AEO** — cross-cutting discoverability infrastructure (see §16b) | `.agents/plans/seo-aeo.md` | *none — additive* | F1–F5 | ⬜ Not planned — **later phase** |

> **Note on F0.** Foundation was built directly, without a `plan-feature` cycle — a process deviation, recorded here rather than papered over. Reviewed and kept on 2026-07-16 because it was already implemented, typechecked, and verified rendering. Every feature from F1 on follows plan → execute.

**Sequencing:** F6 runs **after** the pages exist (F1–F5), because structured data and answer content describe real page content — planning it against placeholder copy would just get redone. Per-page `<title>`/description still ride along with each page as they're built (F1 already sets Home's); F6 owns the *cross-cutting* pieces those can't: sitemap, robots, JSON-LD, OG image generation, `llms.txt`, and the answer-optimized content structure.

**Still not features** (deferred): the footer legal pages are D6; deployment is §12 Phase 4.

### 16b. F6 scope — SEO + AEO

Two overlapping goals. **SEO** = rank in traditional search. **AEO** (Answer Engine Optimization) = be the source an AI answer engine *cites* when someone asks it a question. For a referral-driven, certification-gated coaching practice, AEO is arguably the higher-value half — the buyers in §3 increasingly start with "find me a veteran-owned executive coach" typed into ChatGPT or Google's AI Overview, not a ten-blue-links search.

**SEO deliverables**
- `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js file conventions — not hand-written XML)
- Per-page OG + Twitter card tags; generated OG images (`opengraph-image` convention) rather than hand-cut PNGs
- Canonical URLs; `metadataBase` already set in F0 `layout.tsx`
- Heading hierarchy and semantic landmarks audit (largely satisfied by F1–F5 if built to spec)
- Core Web Vitals — already gated per page via Lighthouse ≥ 90 / LCP < 2.5s

**AEO deliverables**
- **JSON-LD structured data** (the shared backbone of both goals): `ProfessionalService` / `LocalBusiness` for the org, `Person` for the founder, `Service` / `OfferCatalog` for the three coaching lines, and the SDVOSB/WOSB credentials as machine-readable properties. Emitted as `<script type="application/ld+json">` from a typed helper, not hand-inlined.
- **`FAQPage` schema + a real FAQ section** — direct question→answer pairs are the single most citable content format for answer engines ("What is an SDVOSB?", "Do you coach transitioning veterans?"). Content dependency, like D2.
- **Extractable entity definitions** — clear, self-contained statements of who Dennis Ventures is and what the certifications mean, so an engine can quote a clean sentence.
- **`public/llms.txt`** — the emerging convention pointing AI crawlers at the canonical description and key pages.
- **AI-crawler policy in `robots.ts`** — an explicit **decision** (see D7): whether to allow `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, etc. For a practice that *wants* to be surfaced in AI answers, allowing them is the point; this is a business call, not a default.

**Depends on:** real copy (D2) and real certification/founder facts, since fabricated structured data is worse than none — it misrepresents a real business to machines that quote it verbatim.

---

## 17. Open Decisions — **Blocking**

Phase 1 does not begin until these close.

| # | Decision | Status | Needed for |
|---|---|---|---|
| **D1** | **Canonical design system** — Manrope/aqua vs Inter/grey. | 🟢 **Closed 2026-07-16 — System A: Manrope + aqua + rounded corners.** Solutions gets re-skinned. Ported to `@theme` in `globals.css`. Comparison archived at `designs/system-compare.html`. | ✅ done |
| **D2** | **The 7 copy placeholders** — ~~home mission~~; About pillars ×3; About values ×3. | 🟡 **Partially closed.** Founder content received 2026-07-19 (`designs/founder-content.md`); **Home mission filled**. The 3 About pillars can be drafted from it in F2; the 3 named values (Expertise/Calmness/Professionalism) don't map 1:1 to the bio and may still need founder input. | F2 |
| **D8** | **WOSB certification unverified.** The Stitch exports assert "WOSB Certified" sitewide, but the founder's capability summary states **SDVOSB only** — WOSB is not mentioned. Asserting an uncertified set-aside status is a credibility and potential legal risk. | 🔴 **Open — verify before launch.** Confirm WOSB status with the founder; if not certified, strip the WOSB claims from footer + Solutions. | Launch (blocking) |
| **D3** | **Real imagery** | 🟡 **Half closed.** `home-hero` (1376×768) and `solutions-ocean` (1200×896) replaced and usable. `about-portrait` and `contact-backdrop` are **still 512px Stitch previews** and must be replaced. Note the contact slot is a *tall* column — a portrait-orientation shot suits it; the current square crops hard. | Phase 2 |
| **D4** | **Domain** — which name, and is it registered? | 🔴 **Open** | Phase 4 |
| **D5** | **Icons** | 🟢 **Closed 2026-07-16 — `lucide-react` v1.24.0.** Tree-shakeable, no font request, no FOUT. Substitution map lives in `src/components/ui/icons.tsx`, keyed by the exports' own glyph names so every swap is auditable. Shapes are close to Material's, not identical — if one reads wrong beside the design, the exact-fidelity fallback is the `material-symbols` package (self-hosted font) or `@material-symbols/svg-400`. | ✅ done |
| **D6** | **Footer legal pages** — Privacy, Terms, SDVOSB Status, WOSB Status. Links render; destinations don't exist (they 404). Real pages, or remove until they do? | 🟡 Out of MVP scope | Launch |
| **D7** | **AI-crawler policy (AEO)** — allow `GPTBot` / `PerplexityBot` / `ClaudeBot` / `Google-Extended` to crawl the site? Allowing them is how the practice gets surfaced and cited in AI answers; blocking them opts out of that channel. | 🟡 Open — decide during F6 | F6 |

### Deviations from the exports — confirm or reverse

Recorded per §2 principle 1 ("deviations are decisions, not drift").

| Change | Why | Reverse? |
|---|---|---|
| Footer **icon buttons removed entirely** (share + mail) | Requested 2026-07-16. Neither had a handler in any export — both decorative. That slot is reserved for social links once we know which accounts exist; **LinkedIn is the expected first one**. | Intentional — slot is held open. |
| Icons swapped **Material Symbols → Lucide** | Requested 2026-07-16 for speed. Removes a render-blocking font request. | Fallback to `material-symbols` if fidelity suffers. |
| Navigating CTAs are `<Link>`, not `<button>` | The exports render every CTA as `<button>`, including ones that navigate. Links are keyboard/SR-correct and work pre-hydration. | No — this is a straight bug fix. |
| **Dark mode block deleted** from `globals.css` | The scaffold shipped `prefers-color-scheme: dark` that would fight a design with zero dark variants. | No — see §4. |
| Footer `© 2024` → computed year | Hardcoded and already stale (it's 2026). | No. |
