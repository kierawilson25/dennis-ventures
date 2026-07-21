# Feature: Port the Contact Page (F4)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types and components. Import from the right files.

> **Read `PRD.md` §4, §6, §7.2, §9, §10, §16 (F4/F5), §17, and `.agents/plans/port-solutions-page.md` + `.agents/plans/port-about-page.md` before starting.** F1 established section composition + the one-off inline-gradient rationale; F2 established the data-driven cert list + the framed `next/image` pattern; F3 established the `Card` action extension + the re-skin discipline. This feature reuses all three and adds the site's **first client component + first route handler + first shared validation lib**.
> **`AGENTS.md` mandates reading `node_modules/next/dist/docs/` before writing Next.js code. This is Next.js 16.2.10 with React 19.2.4.** The relevant guides are enumerated under "Relevant Documentation" and have been read for this plan.
> **This is the first page with real interactivity.** Every prior page is a pure Server Component. Contact introduces exactly one client island (`ContactForm`) and one server endpoint (`/api/contact`). Keep the page shell itself a Server Component; push `"use client"` down to the form only.

## Feature Description

Port `HTML files/contact-code.html` (207 lines, **truncated mid-`<script>`** — the export's form handler does not exist to copy) into the App Router as `/contact`, reusing the F0 foundation and F1–F3 patterns. The page is a centered header over a two-column layout: a **glass-card contact form** (Full Name, Email, Message) on the left and a **tall imagery column** ("Steady hands. / In a sea of change.") on the right, on the `.hero-gradient` background (already defined in `globals.css`).

Because the export's handler is truncated, the form's behavior is **written from scratch**, not ported. Per the two scoping decisions made this session (see **SCOPE DECISIONS**), F4 delivers a **fully demonstrable form pipeline that needs no Resend key**:

- a **shared zod schema** (`src/lib/contact-schema.ts`) imported by both client and server (the PRD §10 contract: "validated server-side by the same zod schema the client uses"),
- a **client `ContactForm`** with real client-side validation and all three states (idle → submitting → success / error),
- a **stub `/api/contact` route handler** that validates server-side with the same schema and returns `{ ok: true }` **without sending email** (the send is F5's only remaining job).

F5 (contact-form backend) later swaps the stub's "no-op deliver" for real Resend delivery and adds honeypot **enforcement** + rate limiting. F4 renders the honeypot field and defines the seam; F5 hardens it. **F4 requires no environment variables** — it ships a documented `.env.example` for F5.

## User Story

As an **interested visitor (transitioning veteran, executive, or government partner)**,
I want to **send a message through a form that validates my input and clearly tells me whether it was sent**,
So that **I can start a conversation without wondering whether my inquiry actually arrived** (PRD US-4).

## Problem Statement

The Contact design exists only as a standalone Stitch export that **cannot ship and is functionally incomplete**. Beyond the cross-cutting export defects shared by every page (CDN Tailwind, render-blocking Material Symbols font link, an **expiring** `lh3.googleusercontent.com` backdrop image, duplicated nav/footer, `href="#"` throughout, `© 2024`), this file has problems unique to it:

- **The form handler is truncated mid-function** (`contact-code.html:206–207` — the file ends at `const btn = form.querySelector('button');`). There is no submit logic, no validation, no states, no delivery. **Nothing to port — this is built from scratch.**
- **The backdrop is a CSS `background-image`** (`contact-code.html:151`) on the expiring `lh3` URL. Ported literally it would ship an unoptimized image bypassing `next/image` (PRD R2b) and break at launch (PRD R2).
- **`.hero-gradient` is used but never defined** in the file (no `<style>` block) — already fixed globally in `globals.css:113`.
- **No mobile height for the image column** — the export relies on `h-full` inside an `items-start` grid, which has no defined row height; on a real render the image column can collapse. Needs an explicit responsive height.
- **Inputs have `border-none` + a faint `focus:ring-secondary/20`** — insufficient focus visibility for WCAG AA (PRD §11, US-6). The port strengthens the focus treatment.

## Solution Statement

Compose `/contact` from F0 primitives as a **statically-rendered Server Component** whose only dynamic surface is the `ContactForm` client island and the `/api/contact` route handler. All copy moves to a new `src/content/contact.ts`. A new `src/components/ui/Field.tsx` primitive (PRD §7.4 — the one planned primitive F0 didn't build, because no page needed it until now) owns label + input/textarea + error markup with correct a11y wiring. A new `src/lib/contact-schema.ts` holds the shared zod schema, the inferred `ContactInput` type, and a version-robust field-error mapper. The backdrop becomes a `next/image fill` inside a sized frame with the export's dark gradient overlay preserved as a sibling div. Zero of the export's scripts are ported (the scroll-shrink is already handled by `TopNav`; the form handler is written fresh).

## Feature Metadata

**Feature Type**: New Capability (port + net-new form pipeline)
**Estimated Complexity**: Medium-High — same fidelity bar as F1–F3, **plus** the site's first client component, first route handler, first shared validation lib, and first real accessibility-critical interactive surface (form states, focus management, live regions).
**Primary Systems Affected**: `src/app/contact/page.tsx` (new), `src/content/contact.ts` (new), `src/lib/contact-schema.ts` (new), `src/components/ui/Field.tsx` (new), `src/components/sections/ContactForm.tsx` (new, client), `src/app/api/contact/route.ts` (new stub), `src/content/site.ts` (add a public contact email for the error fallback), `.env.example` (new), `.gitignore` (one-line negation), `package.json` (add `zod`).
**Dependencies**: **`zod` must be added as a direct dependency.** It is currently present at `4.4.3` **only transitively** (via `eslint-config-next → eslint-plugin-react-hooks → zod-validation-error`) — relying on that is fragile. **No `resend`** in F4 (that's F5).

---

## SCOPE DECISIONS (made this session — do not re-litigate)

1. **Form pipeline = "Full & demonstrable" (no Resend key needed).** F4 builds the shared zod schema + a stub `/api/contact` that validates and returns `{ ok: true }` but **sends no email**, plus full client validation and all states. F5's remaining job is *only* real delivery (Resend) + honeypot enforcement + rate limiting. Rationale: the user does not have Resend keys yet and wants a Contact page that fully demonstrates the success path now, key-free.
2. **Image = ship the current 512×512 `contact-backdrop` as-is, flagged.** Convert the CSS background to `next/image fill` + the dark gradient overlay. This mirrors the F2 `about-portrait` precedent (accepted-for-now, flagged for a higher-res replacement). **PRD D3 explicitly warns this slot is a *tall* column and the square image crops hard** — surface it as a known limitation; a portrait-orientation shot is wanted later. Do **not** invent a different subject.

**Explicitly deferred to F5 (do NOT build in F4):** Resend integration, real email delivery, honeypot *enforcement* logic hardening, rate limiting (429), `CAPTCHA`. F4 renders the honeypot input and the stub returns `{ ok: true }` on a filled honeypot (bots get no signal) — but the "silently drop + never deliver" hardening and rate limit are F5.

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

- `HTML files/contact-code.html` — **the source of truth for layout and copy.** Read it whole.
  - lines 110–119 — **`<main class="... hero-gradient">`** wrapping a centered header: badge "GET IN TOUCH" (114), h1 "Connect with Dennis Ventures." (115), lede (116–118). **Do not port `<main>`** — `layout.tsx:45` already owns the single `<main id="main">`. The page's top-level element becomes a `<section className="hero-gradient …">`.
  - lines 121–159 — **two-column grid** `grid-cols-1 lg:grid-cols-12 gap-gutter items-start`. Form column `lg:col-span-7` (123–146); imagery column `lg:col-span-5 h-full` (148–158).
  - lines 124–145 — **the form**: `glass-card rounded-xl p-8 md:p-12`, `<form class="space-y-8">`, three fields each `label` + input/textarea on `bg-surface-container-low` (→ `bg-surface-sunken`), rounded-lg, `px-6 py-4`, `border-none focus:ring-2 focus:ring-secondary/20`, `placeholder:text-outline/50`; textarea `rows=5 resize-none`. Submit button "Send Message" + `arrow_forward` icon (140–143).
  - lines 148–158 — **imagery column**: `relative rounded-xl overflow-hidden shadow-2xl h-full`; a `bg-cover bg-center` background-image div on the expiring `lh3` URL (151 — **replace with `next/image`**); a dark gradient overlay `bg-gradient-to-t from-black/80 via-black/20 to-transparent` (152); overlaid white text "Steady hands." / "In a sea of change." (153–156).
  - lines 189–207 — `<script>`: scroll-shrink (**already handled by `TopNav`** — do NOT port) + a **truncated** form handler (**nothing to port**).
  - **Re-skin note:** this export uses the *same* System-A-adjacent Material token names as Home/About (`bg-surface-container-low`, `text-on-surface`, `bg-primary-container`, `text-secondary`, `font-*`), **not** the forked System B of Solutions. Apply the same token translation F1/F2 used (table below), but there is no font/palette *fork* to undo here.
- `src/app/about/page.tsx` — **the primary structural mirror.** Metadata export (`title` only), `Container` usage, the framed `next/image` inside a `glass-card` (42–52), the 2-column grid, `Badge`/`SectionHeading`/`Button` usage, no `<main>` wrapper. Note About's image is **dimension-inferred contained** (no `fill`); Contact's backdrop is **cropped-to-fill** (needs `fill` + a sized relative parent) — closer to Solutions' ocean frame.
- `src/app/solutions/page.tsx` (lines 120–142) — **the `next/image fill`-in-a-sized-frame pattern** to mirror for the imagery column: a `relative` wrapper → `relative h-[…] w-full` → `<Image fill sizes=… placeholder="blur" className="object-cover" />`. Contact differs only in needing a **responsive** height (tall on desktop, shorter when stacked on mobile).
- `src/components/sections/Hero.tsx` — the **static-import path** (`../../../public/images/…`) and the layered image+gradient-overlay+content painting order (image absolute, gradient sibling div above it by DOM order, content `relative z-10`). The imagery column uses the same layering.
- `src/components/ui/Button.tsx` — solid/outline, sizes sm/md/lg. **It already renders a `<button>` when no `href` is passed and forwards `type`, `onClick`, `disabled`, `aria-*` via `...rest`** (Button.tsx:37–62). The submit button is `<Button type="submit" size="lg" disabled={submitting}>` — no new Button work needed. Note `disabled:opacity-60 disabled:pointer-events-none` is already in `base` (Button.tsx:12).
- `src/components/ui/Badge.tsx` — the header pill "GET IN TOUCH" (no icon → pass a plain string child).
- `src/components/ui/Container.tsx` — the `max-w-site` + responsive-margin wrapper.
- `src/components/ui/icons.tsx` — `arrow_forward → ArrowRight` is **already mapped** (icons.tsx:49). `Icon name="arrow_forward"`. No icon-map change.
- `src/components/ui/SectionHeading.tsx` — **not used on Contact** (the header is a one-off centered badge+h1+lede, not the heading+rule pattern). Read it only to confirm it doesn't fit; do not force it.
- `src/content/home.ts` / `src/content/solutions.ts` — the **exact content-module shape** `contact.ts` mirrors (typed consts, `as const`, split fields, verbatim copy). Home's split-headline pattern is the reference; Contact's h1 has no accent span, so it's a plain string.
- `src/content/site.ts` — holds `bookingCta` (`/contact`), `certifications`. **Task adds a public `contactEmail`** for the form's direct-email error fallback (PRD R7).
- `src/app/layout.tsx` — **owns the single `<main id="main">` and the base metadata + OG.** Confirm the page adds only `title` + `description`; the template + `metadataBase` come from here (layout.tsx:16–30).
- `src/app/globals.css` — token vocabulary + `.hero-gradient` (113), `.glass-card` (105). This is the re-skin target; introduce no token not defined here. **`.hero-gradient` is a radial lavender→surface — confirm it renders (it was previously only *used*, never *defined*, in the export).**
- `src/lib/cn.ts` — the class-join helper. Field/ContactForm use it for conditional error classes.

### New Files to Create

- `src/content/contact.ts` — all Contact copy (header, field labels/placeholders, submit label, image overlay text, success + error + validation messages) as typed fields.
- `src/lib/contact-schema.ts` — shared zod schema, `ContactInput` type, and a `getFieldErrors` mapper. **Framework-agnostic — no `server-only`, no React, no Next imports** (both the client form and the server route import it).
- `src/components/ui/Field.tsx` — presentational label + input/textarea + error primitive (PRD §7.4). Server-Component-safe (no hooks); rendered inside the client form.
- `src/components/sections/ContactForm.tsx` — **the one client component** (`"use client"`): controlled inputs, client validation, all three states, `fetch` POST to `/api/contact`, honeypot, focus management, live regions.
- `src/app/api/contact/route.ts` — **stub** `POST` handler: parse JSON → validate with the shared schema → honeypot short-circuit → `{ ok: true }` (no email). The F5 seam.
- `src/app/contact/page.tsx` — the route (Server Component) composing the header + form + imagery column.
- `.env.example` — committed template documenting the F5 vars (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`). F4 needs none of them.

### Files to Modify

- `package.json` — add `zod` as a direct dependency (`npm install zod`).
- `.gitignore` — add `!.env.example` so the committed template survives the `.env*` rule (line 34).
- `src/content/site.ts` — add a public `contactEmail` field for the error-state `mailto:` fallback.

### Relevant Documentation — READ BEFORE IMPLEMENTING (verified present for this plan)

- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — **Route Handlers**. Confirms: `route.ts` in `app/api/contact/`, `export async function POST(request: Request)`, use the Web `Request`/`Response` (`Response.json(...)`). **Route Handlers are not cached** (POST never is) — the endpoint is correctly dynamic. There **cannot** be a `route.ts` at the same segment as a `page.ts` — `app/api/contact/route.ts` and `app/contact/page.tsx` are different segments, so no conflict.
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` — **Mutating Data / Server Actions**. Read to make the deliberate choice: the PRD (§6, §10) specifies a **route handler + client `fetch`**, not a Server Action. We follow the PRD (documented API contract, honeypot, shared schema). `useActionState` is noted there but is tied to the form-`action` model; F4 uses an explicit `onSubmit` + `useState` for precise control over field errors and value preservation. (Server Actions + progressive enhancement is recorded as a future consideration under NOTES.)
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — **the `"use client"` boundary.** Read to confirm the page stays a Server Component and only `ContactForm` is a client island. Skim before writing the boundary.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — **`next/image` `fill`** (requires a `position: relative` sized parent + `object-cover`) and **local static import** (`import img from "../../../public/…"`, enables `placeholder="blur"`). Same pattern as Solutions' ocean frame.
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` — per-page `metadata` (`title` + `description`); root layout supplies the template + `metadataBase` + default OG.
- [Zod v4 basics](https://zod.dev/) — **this project resolves `zod@4.4.3`, not v3.** v4 differences to respect: top-level string formats (`z.email()`, `z.url()`) are preferred over the deprecated `.email()` method (both work here — verified). To stay version-robust, map errors from `result.error.issues` (`{ path, message }`) yourself rather than the deprecated `error.flatten()`.

### Patterns to Follow (extracted from this codebase)

**Copy is data** (`home.ts`, `solutions.ts`): every rendered string is a typed field in `src/content/*.ts`; components never inline copy. `as const`, one exported const per section.

**No hex literals; tokens only** (`globals.css` `@theme`): use `bg-surface-sunken`, `text-ink-muted`, `text-accent`, `border-outline-soft`, etc. The one-off `.hero-gradient` is a defined utility (not inline).

**Token translation (export Material names → System-A tokens)** — same map F1/F2 used (no font/palette fork here, unlike F3):

| Export (Material) | Port (System-A token) | Where |
|---|---|---|
| `font-headline-*`, `font-body-*`, `font-label-*` | *(drop — Manrope is the default `font-sans`)* | keep the `text-*` **size** classes |
| `text-secondary`, `bg-secondary`, `text-on-secondary` | `text-accent`, `bg-accent`, `text-accent-ink` | submit button, focus ring, active nav |
| `bg-primary-container`, `text-on-primary-container` | `bg-lavender`, `text-lavender-ink` | header badge |
| `bg-surface-container-low` | `bg-surface-sunken` | input backgrounds |
| `text-on-surface`, `text-on-surface-variant` | `text-ink`, `text-ink-muted` | headings, labels, lede |
| `border-outline-variant/…`, `text-outline/50` | `border-outline-soft/…`, `text-outline/50` | placeholder, dividers |
| `rounded-xl` (1rem) | `rounded-xl` | glass-card + image frame (unchanged) |

**`next/image fill` in a sized frame** (Solutions ocean, `solutions/page.tsx:126–136`): outer `relative overflow-hidden rounded-xl` → inner `relative h-[…] w-full` → `<Image fill sizes=… placeholder="blur" className="object-cover" />`. **Never `fill` without a sized `relative` parent** (image collapses to 0 height).

**Layered image + overlay + content** (`Hero.tsx:24–68`): image absolute (or `fill`), gradient overlay as a **sibling div after it** (paints above by DOM order — no negative z-index), content lifted with `relative z-10`.

**Decorative images get `alt=""`** (`Hero.tsx:28`, `about/page.tsx:45`, `solutions.ts:66`): the backdrop conveys nothing the visible "Steady hands." text and the form don't. `alt=""`.

**One-off gradients are inline with a justifying comment** (`page.tsx:22–29`, `about/page.tsx:59–65`) — but here the background is the **defined `.hero-gradient` utility**, so use the class, not inline.

**Anti-patterns (from F1–F3, plus F4-specific):**
- ❌ Porting any `font-headline-*`/`font-body-*`/`font-label-*` class (don't exist in v4 — silent no-op).
- ❌ A CSS `background-image` on the `lh3` URL, or a raw `<img>` — use `next/image`.
- ❌ `<main>` in the page (layout owns it) or a second `id="main"`.
- ❌ `"use client"` on the page or on `Field` — only `ContactForm` is a client component.
- ❌ Server-only imports (`resend`, `server-only`, `next/headers`) in `contact-schema.ts` — it must be importable by the client.
- ❌ Trusting the client — the route handler **re-validates** with the same schema (PRD §10).
- ❌ Faking success on error (PRD R7) — the error state must be truthful and offer the `mailto:` fallback.
- ❌ Building Resend / rate-limit / honeypot-hardening now (F5).
- ❌ `fill` without a sized `relative` parent.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation
Add `zod` as a direct dep; author the shared schema (`contact-schema.ts`) and the `Field` primitive; author `contact.ts` copy; add `site.contactEmail`; commit `.env.example` + the `.gitignore` negation.

### Phase 2: Core Implementation
Build `ContactForm` (client island: controlled inputs, client validation, states, fetch, honeypot, a11y) and the stub `/api/contact` route handler (shared-schema server validation, honeypot short-circuit, `{ ok: true }`).

### Phase 3: Integration
Compose `contact/page.tsx` (Server Component): the `.hero-gradient` section, centered header, two-column grid with `ContactForm` and the framed backdrop image; add metadata; confirm `TopNav` lights "Contact" active via `usePathname` (no code change).

### Phase 4: Validation
Automated gates (tsc/eslint/build; `/contact` static, `/api/contact` dynamic) + a live end-to-end exercise of all three states + accessibility (keyboard, live regions, focus) + fidelity diff at 375/768/1440.

---

## STEP-BY-STEP TASKS

Execute in order. Each task is atomic and independently validated.

### Task 1 — ADD `zod` as a direct dependency

- **IMPLEMENT**: `npm install zod` (resolves `^4.4.3`, matching the already-present transitive copy). This moves it from transitive to a declared `dependencies` entry in `package.json`.
- **WHY**: `contact-schema.ts` imports `zod` at runtime in both the client bundle and the server route. Depending on a transitive dep (currently via `eslint-config-next`) is fragile — a lint-config bump could remove it.
- **GOTCHA**: do **not** install `resend` (F5). Confirm the lockfile updates and `node_modules/zod` stays at 4.x.
- **VALIDATE**: `npm ls zod` shows `zod@4.x` under `dennis-ventures` **direct** (not only nested under `eslint-config-next`); `npx tsc --noEmit`.

### Task 2 — CREATE `src/lib/contact-schema.ts` (shared validation)

- **IMPLEMENT**: the zod schema, inferred type, and a version-robust field-error mapper. Framework-agnostic.
  ```ts
  import { z } from "zod";

  // Shared by the client form (ContactForm.tsx) and the server route
  // (api/contact/route.ts). Keep this file free of server-only / React / Next
  // imports so both bundles can import it. PRD §10.
  export const contactSchema = z.object({
    name: z.string().trim().min(1, "Please enter your name.").max(100),
    email: z.email("Enter a valid email address."), // zod v4 top-level format
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more — at least 10 characters.")
      .max(2000, "Please keep it under 2000 characters."),
    // Honeypot: real users never fill this. Must be empty. Enforcement/hardening
    // is F5; F4 validates its emptiness and the route short-circuits on a hit.
    website: z.string().max(0).optional().default(""),
  });

  export type ContactInput = z.infer<typeof contactSchema>;

  // Map a ZodError to { field: firstMessage }. Uses `.issues` (stable across
  // zod v4) rather than the deprecated `.flatten()`.
  export function getFieldErrors(
    error: z.ZodError,
  ): Partial<Record<keyof ContactInput, string>> {
    const out: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !out[key]) out[key] = issue.message;
    }
    return out;
  }
  ```
- **PATTERN**: mirrors the PRD §10 contract (400 body is `{ ok: false, errors: { email: "…" } }`).
- **GOTCHA (zod v4)**: use `z.email(...)` (top-level) — the `.email()` string method is deprecated in v4 (still works, but avoid). Both are present in `4.4.3` (verified). Do not use `error.flatten()` (deprecated in v4).
- **GOTCHA**: `website` is the honeypot; keep it in the schema so the same object validates client + server, but the form renders it hidden (Task 5) and the route treats a non-empty value as a bot (Task 6).
- **VALIDATE**: `npx tsc --noEmit`; quick REPL check: `node -e "const {contactSchema}=require('./src/lib/contact-schema.ts')"` won't run TS directly — instead rely on the build + the Task 9 live test.

### Task 3 — UPDATE `src/content/site.ts` (public contact email for the error fallback)

- **IMPLEMENT**: add a public `contactEmail` const the form's error state links to (`mailto:`), per PRD R7 ("direct-email fallback").
  ```ts
  // Public inbox for the contact-form error fallback (PRD R7). Distinct from the
  // server-only CONTACT_TO_EMAIL that F5's Resend delivery will use.
  // ⚠️ PLACEHOLDER pending the real address + domain (PRD D4 — domain undecided).
  export const contactEmail = "hello@dennisventures.com";
  ```
- **GOTCHA**: this address is a **placeholder flagged for confirmation** — the domain isn't chosen (D4). Surface it in the report; it is the one string in F4 that isn't verbatim-from-export or founder-sourced.
- **VALIDATE**: `npx tsc --noEmit`.

### Task 4 — CREATE `src/content/contact.ts`

- **IMPLEMENT**: mirror `home.ts`/`solutions.ts` shape. All header/label/overlay copy is **verbatim from `contact-code.html`**; the status/validation messages are new (no export handler to copy) and written in the site's calm voice.
  ```ts
  export const header = {
    badge: "Get In Touch",
    // No accent span in the export — plain string.
    heading: "Connect with Dennis Ventures.",
    lede: "Whether you're transitioning out of federal service or scaling your executive leadership, we're here to guide the journey. Let's start a conversation that matters.",
  } as const;

  export const form = {
    fields: {
      name: { label: "Full Name", placeholder: "How should we address you?" },
      email: { label: "Email Address", placeholder: "Where can we reach you?" },
      message: {
        label: "Your Vision or Message",
        placeholder: "Tell us about your goals or challenges...",
      },
    },
    submitLabel: "Send Message",
    submittingLabel: "Sending…",
    // Success + error states (written fresh — the export handler is truncated).
    success: {
      heading: "Message sent.",
      body: "Thank you for reaching out. We'll be in touch shortly.",
      resetLabel: "Send another message",
    },
    error: {
      // The email address is interpolated in the component from site.contactEmail.
      body: "Something went wrong and your message couldn't be sent. Please try again, or email us directly at",
    },
  } as const;

  export const imagery = {
    // Overlaid brand copy — real DOM text, so the image itself is decorative.
    overlineTitle: "Steady hands.",
    overlineSubtitle: "In a sea of change.",
    imageAlt: "", // decorative; the overlay text + form carry all meaning
  } as const;
  ```
- **GOTCHA**: note the lede's apostrophe — the export uses a curly `'` in "Let's"/"you're"; either the entity or a straight apostrophe is fine, but be consistent and ESLint-clean (`react/no-unescaped-entities` can flag raw `'` in JSX — here the copy lives in a `.ts` string, not JSX, so it's safe).
- **VALIDATE**: `npx tsc --noEmit`.

### Task 5 — CREATE `src/components/ui/Field.tsx` (label + input/textarea + error)

- **IMPLEMENT**: a presentational primitive (no hooks, no `"use client"`) rendering a labeled input **or** textarea with an error slot and correct a11y wiring. It is rendered *inside* the client form but is itself Server-Component-safe.
  ```tsx
  import type { ComponentPropsWithoutRef, ReactNode } from "react";
  import { cn } from "@/lib/cn";

  type BaseProps = {
    id: string;
    label: ReactNode;
    error?: string;
    className?: string;
  };
  // Discriminate input vs textarea so the right native props flow through.
  type InputField = BaseProps & { as?: "input" } & ComponentPropsWithoutRef<"input">;
  type TextareaField = BaseProps & { as: "textarea" } & ComponentPropsWithoutRef<"textarea">;

  const control =
    "w-full rounded-lg bg-surface-sunken px-6 py-4 text-body-md " +
    "placeholder:text-outline/50 transition-all " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  export function Field(props: InputField | TextareaField) {
    const { id, label, error, className, as = "input", ...rest } = props;
    const errorId = error ? `${id}-error` : undefined;
    const controlClass = cn(control, error && "outline-2 outline-error", className);

    return (
      <div>
        <label htmlFor={id} className="mb-2 ml-1 block text-label-sm text-ink-muted">
          {label}
        </label>
        {as === "textarea" ? (
          <textarea
            id={id}
            className={cn(controlClass, "resize-none")}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...(rest as ComponentPropsWithoutRef<"textarea">)}
          />
        ) : (
          <input
            id={id}
            className={controlClass}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...(rest as ComponentPropsWithoutRef<"input">)}
          />
        )}
        {error ? (
          <p id={errorId} role="alert" className="mt-2 ml-1 text-label-sm text-error">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
  ```
- **PATTERN**: discriminated-union props like `Button.tsx:33–39`; `cn` for conditional error styling like `TopNav`.
- **GOTCHA (a11y)**: `aria-describedby` must point at the error `id` only when an error exists; `aria-invalid` mirrors it. The stronger `focus-visible:outline-accent` replaces the export's insufficient `focus:ring-secondary/20` (WCAG AA, PRD US-6).
- **GOTCHA**: keep `id`/`name` explicit at the call site (the form controls them); do not auto-generate.
- **VALIDATE**: `npx tsc --noEmit`.

### Task 6 — CREATE `src/app/api/contact/route.ts` (stub POST handler)

- **IMPLEMENT**: the F5 seam. Parse JSON, validate with the shared schema, short-circuit the honeypot, and return `{ ok: true }` **without sending email**.
  ```ts
  import { contactSchema, getFieldErrors } from "@/lib/contact-schema";

  export async function POST(request: Request) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, errors: getFieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    // Honeypot: a filled `website` means a bot. Return 200 with no delivery so
    // bots get no signal (PRD §10). F5 hardens this + adds rate limiting.
    if (parsed.data.website) {
      return Response.json({ ok: true });
    }

    // F4 STUB: no email is sent (no Resend key yet — SCOPE DECISION 1).
    // F5 replaces this block with real Resend delivery to CONTACT_TO_EMAIL.
    // Log server-side so the success path is observable in dev.
    console.info("[contact] valid submission (delivery deferred to F5):", {
      name: parsed.data.name,
      email: parsed.data.email,
    });

    return Response.json({ ok: true });
  }
  ```
- **PATTERN**: `15-route-handlers.md` — `export async function POST(request: Request)`, `Response.json(...)`. Not cached (correct for POST).
- **GOTCHA**: matches the PRD §10 contract shapes (`{ ok: true }` / `{ ok: false, errors }` / `{ ok: false, error }`). Do **not** add the 429 branch (F5). Do **not** import `resend`/`next/headers` (keeps the route trivially prerender-neutral and F5-ready).
- **GOTCHA**: `console.info` is fine here; if ESLint flags `no-console`, downgrade to a comment `// TODO(F5)` — check the eslint config first (`eslint.config.mjs`). Prefer keeping the log unless it errors.
- **VALIDATE**: `npx tsc --noEmit`; after `npm run build`, `/api/contact` appears as a dynamic `ƒ` route (not static).

### Task 7 — CREATE `src/components/sections/ContactForm.tsx` (the client island)

- **IMPLEMENT**: `"use client"`. Controlled inputs, client validation via the shared schema, a `status` state machine, `fetch` POST, honeypot, focus + live-region a11y. Message value is preserved on error.
  - **State**: `status: "idle" | "submitting" | "success" | "error"`; `values: { name, email, message }`; `errors: Partial<Record<keyof ContactInput, string>>`; a hidden honeypot input (uncontrolled, `name="website"`).
  - **Submit flow** (`onSubmit`, `e.preventDefault()`):
    1. Build the payload from form state (include the honeypot value).
    2. `const parsed = contactSchema.safeParse(payload)` → if `!parsed.success`, `setErrors(getFieldErrors(parsed.error))`, focus the first invalid field, `return`.
    3. `setStatus("submitting")`, clear errors, `fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) })`.
    4. On network throw or `!res.ok` **with no field errors** → `setStatus("error")` (preserve values).
    5. On `400` with `{ errors }` → `setErrors(data.errors)`, `setStatus("idle")`, focus first invalid.
    6. On `{ ok: true }` → `setStatus("success")`, reset `values`.
  - **States UI**:
    - **submitting**: `<Button type="submit" size="lg" disabled aria-busy>` shows a spinner + `form.submittingLabel`. (Button already has `disabled` styles.)
    - **success**: replace the form with a confirmation block `role="status" aria-live="polite"` (heading + body from `contact.ts`) + a "Send another message" button that resets to `idle`.
    - **error**: a banner above the button `role="alert"` with `form.error.body` + a `mailto:` link to `site.contactEmail`; values preserved; button re-enabled to retry.
  - **Honeypot**: an off-screen (not `display:none`) input:
    ```tsx
    <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
    ```
  - **Fields**: render three `<Field>`s (name/email/message, message `as="textarea" rows={5}`), each `value`/`onChange` controlled, `error={errors.x}`, `name`/`id` = the key. Wrap in `<form onSubmit=… noValidate className="space-y-8">` inside `glass-card rounded-xl p-8 md:p-12`.
  - **Skeleton**:
  ```tsx
  "use client";
  import { useRef, useState } from "react";
  import { Button } from "@/components/ui/Button";
  import { Field } from "@/components/ui/Field";
  import { Icon } from "@/components/ui/icons";
  import { contactSchema, getFieldErrors, type ContactInput } from "@/lib/contact-schema";
  import { contactEmail } from "@/content/site";
  import { form as copy } from "@/content/contact";
  // …state, handlers, JSX per the flow above…
  ```
- **PATTERN**: client-component conventions from `TopNav.tsx` (`"use client"`, `useRef`/`useState`, focus management). Spinner: a small inline `<svg>` with `animate-spin` (Tailwind) — no new dependency.
- **GOTCHA (a11y / US-6)**: on validation failure, move focus to the first invalid field (`ref`s or `document.getElementById`); the error `<p role="alert">` announces. The status region uses `aria-live="polite"`. The submit button uses `aria-busy` while submitting.
- **GOTCHA (value preservation, PRD US-4/R7)**: on error, do **not** clear `values` — only clear on success. The message field especially must survive a failed send.
- **GOTCHA (no fake success)**: never set `"success"` except on an actual `{ ok: true }` response.
- **GOTCHA**: this is the **only** `"use client"` file in F4. Do not mark the page or `Field`.
- **VALIDATE**: `npx tsc --noEmit`; `npx eslint src/components/sections/ContactForm.tsx` (watch `react-hooks/exhaustive-deps`, `no-console`).

### Task 8 — CREATE `src/app/contact/page.tsx` (compose the page)

- **IMPLEMENT**: Server Component. `metadata` export (`title: "Contact"` + a `description`), then the `.hero-gradient` section → centered header → two-column grid (`ContactForm` + framed backdrop).
  ```tsx
  import type { Metadata } from "next";
  import Image from "next/image";
  import backdrop from "../../../public/images/contact-backdrop.jpg";
  import { Container } from "@/components/ui/Container";
  import { Badge } from "@/components/ui/Badge";
  import { ContactForm } from "@/components/sections/ContactForm";
  import { header, imagery } from "@/content/contact";

  export const metadata: Metadata = {
    title: "Contact",
    description:
      "Start a conversation with Dennis Ventures — veteran-owned executive and health coaching for transitioning service members, executives, and government partners.",
  };

  export default function ContactPage() {
    return (
      // hero-gradient defined in globals.css; layout owns <main>, so this is a section.
      <section className="hero-gradient pb-section pt-32">
        <Container>
          <div className="mx-auto mb-16 max-w-3xl space-y-6 text-center">
            <Badge>{header.badge}</Badge>
            <h1 className="text-headline-xl-tight leading-tight text-ink md:text-headline-xl">
              {header.heading}
            </h1>
            <p className="text-body-lg leading-relaxed text-ink-muted">{header.lede}</p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-72 overflow-hidden rounded-xl shadow-2xl sm:h-96 lg:h-full lg:min-h-[32rem]">
                <Image
                  src={backdrop}
                  alt={imagery.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                {/* Dark gradient overlay (export line 152), painted above the
                    image by DOM order. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-headline-md font-bold">{imagery.overlineTitle}</p>
                  <p className="mt-2 text-body-lg opacity-90">{imagery.overlineSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }
  ```
- **PATTERN**: header mirrors About's `Badge`+h1+lede (`about/page.tsx:27–34`); image frame mirrors Solutions' ocean (`solutions/page.tsx:120–139`) but with a **responsive height** (`h-72 sm:h-96 lg:h-full lg:min-h-[32rem]`) so the column never collapses when stacked (fixes the export's `h-full`-with-no-row-height bug). `items-stretch` lets the image match the form's height at `lg`.
- **GOTCHA (`pt-32`)**: the fixed `TopNav` overlaps the top of the page; the export used `pt-32` on `<main>`. Keep `pt-32` on this section so the header clears the nav (mirrors export line 110).
- **GOTCHA (static import + extension)**: `contact-backdrop.jpg` is **actually PNG data** (512×512) despite the `.jpg` name — `next/image` static import reads file content, so `placeholder="blur"` still works; the build is the gate. If the import errors, that mismatch is the first suspect (re-encode to a true JPEG or rename). Path is three `../` like `about`/`solutions`.
- **GOTCHA**: no `<main>`, no `"use client"`. `ContactForm` is imported and rendered as a client island inside this Server Component (allowed).
- **GOTCHA (no CtaBanner)**: unlike Home/About/Solutions, the Contact export has **no** closing CTA banner — the page ends at the form/imagery grid. Do not add one.
- **VALIDATE**: `npx tsc --noEmit && npm run build` — `/contact` must be `○ (Static)` (the client form is an island; the page shell still prerenders).

### Task 9 — CREATE `.env.example` + `.gitignore` negation (F5 seam)

- **IMPLEMENT**: commit a documented env template (PRD §9). F4 needs none of these at runtime.
  ```bash
  # .env.example — copy to .env.local (gitignored) and fill for F5.
  # F4 (Contact page UI + stub route) needs NONE of these.

  # F5 — Resend email delivery (server-only; never NEXT_PUBLIC_)
  RESEND_API_KEY=
  CONTACT_TO_EMAIL=

  # Canonical site URL for metadata/OG (already read by src/content/site.ts)
  NEXT_PUBLIC_SITE_URL=
  ```
  Then add to `.gitignore` **below** the `.env*` line (line 34):
  ```
  !.env.example
  ```
- **GOTCHA**: `.gitignore` line 34 is `.env*`, which would ignore `.env.example` too. The `!.env.example` negation must come **after** `.env*` to take effect. Verify with `git check-ignore -v .env.example` (should show the negation winning, i.e. the file is **not** ignored).
- **VALIDATE**: `git check-ignore -v .env.example` returns the negation (or exit 1 = not ignored); `git status` shows `.env.example` as a new untracked file.

### Task 10 — VERIFY automated gates

- **Static/dynamic render**: `npm run build 2>&1 | grep -E "/contact|/api/contact"` → `/contact` is `○ (Static)`, `/api/contact` is `ƒ (Dynamic)`.
- **Stale-ref grep (whole tree — mirror F2/F3)**:
  ```bash
  ! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss" src/ && echo "no stale refs"
  ```
- **Token-hygiene grep (new files)**: no Material/System-B class survives:
  ```bash
  ! grep -rE "font-headline-|font-body-|font-label-|text-secondary|bg-secondary|text-on-secondary|bg-primary-container|text-on-primary-container|bg-surface-container|text-on-surface|border-outline-variant" src/app/contact src/components/sections/ContactForm.tsx src/components/ui/Field.tsx src/content/contact.ts && echo "tokens clean"
  ```
- **One client component only**: `grep -rl "use client" src/app/contact src/components/ui/Field.tsx` → **empty**; `grep -l "use client" src/components/sections/ContactForm.tsx` → matches.
- **Schema is framework-agnostic**: `! grep -rE "server-only|next/headers|resend|react" src/lib/contact-schema.ts && echo "schema portable"`.
- **Lint/type**: `npx eslint src/ && npx tsc --noEmit`.

### Task 11 — VALIDATE live: states, accessibility, fidelity

- **Run**: `npm run dev` (or `build` + `start`), load `http://localhost:3000/contact`; `open "HTML files/contact-code.html"` beside it at 375 / 768 / 1440.
- **Form states (the core of F4)**:
  1. **Client validation**: submit empty → three inline errors, focus jumps to Name; bad email → email error; short message → message error. Errors clear on correction.
  2. **Submitting**: valid submit → button disables, spinner + "Sending…", `aria-busy`.
  3. **Success**: the stub returns `{ ok: true }` → confirmation block appears (`role="status"`), fields cleared; "Send another message" resets to idle. **This works with no Resend key** (SCOPE DECISION 1) — verify the server log line prints.
  4. **Error**: temporarily point the fetch at a bad path (or stop the server mid-submit) → error banner (`role="alert"`) with the `mailto:` fallback; **the typed message is preserved**. Revert the tweak.
  5. **Honeypot**: fill the hidden `website` via devtools → server returns `{ ok: true }` with **no** log line (bot path). 
- **Accessibility (US-6)**: keyboard-only traversal skip-link → nav → Name → Email → Message → Send → (imagery has no focusables) → footer; visible focus throughout; errors announced; success announced; no keyboard trap. Run axe → zero critical (check input contrast on `bg-surface-sunken`, label contrast, the white overlay text on the dark gradient).
- **Fidelity + responsive**: header centered; two-column at `lg` (form 7 / image 5), single-column below `lg`; **image column never collapses** at 375 (has `h-72`); no horizontal scroll at 375; `.hero-gradient` visible behind the content; "Contact" nav item accent-underlined (F0 `usePathname`).
- **Lighthouse ≥ 90 ×4**: the backdrop is the likely LCP on desktop — confirm `next/image` serves AVIF/WebP and `sizes` is right; confirm no CLS from the image (the sized frame prevents it).
- **JS-disabled note**: the **page** renders fully without JS (header, both columns, image, overlay text). The **form** requires JS to submit (it's a client `fetch` island, per the PRD's route-handler design) — this is expected and consistent with the PRD (the JS-disabled success criterion targets page render/nav, not the interactive form). Record as a known, intended limitation; the Server-Action progressive-enhancement alternative is a future consideration (NOTES).

---

## TESTING STRATEGY

**No test framework exists** (only `dev`/`build`/`start`/`lint`) — as with F1–F3, do not install one. The real gates are static analysis + a live exercise of all three form states + accessibility + visual diff.

### Static analysis
`tsc --noEmit`, `eslint src/`, `next build` — all clean; `/contact` `○ (Static)`, `/api/contact` `ƒ (Dynamic)`.

### Behavioral (primary gate — this is the first interactive page)
Manually exercise **all four states** (idle/validation, submitting, success, error) + the honeypot path against the running stub. Success must work with **no Resend key** (SCOPE DECISION 1). Error must preserve the message and offer the `mailto:` fallback (never fake success — PRD R7).

### Accessibility
axe zero critical; full keyboard traversal; focus moves to the first invalid field on error; `role="alert"` errors + `aria-live` status announce; `aria-invalid`/`aria-describedby` wired; strengthened focus ring vs the export.

### Visual regression
Side-by-side against `contact-code.html` at 375 / 768 / 1440 — layout + copy match; typeface/colour match the **site** (Manrope/aqua), same as F1/F2.

### Edge cases
- **Empty / partial / invalid submit** → correct inline errors, focus management.
- **Server 400** (schema rejects) → field errors surface from the response, not just the client.
- **Network failure / 500** → error state, values preserved, `mailto:` fallback.
- **Honeypot filled** → `{ ok: true }`, no delivery/log (bot gets no signal).
- **375px** → both columns stack; image column keeps a visible height; no horizontal scroll.
- **Long message (2000+ chars)** → max-length error; textarea doesn't break layout (`resize-none`).
- **`prefers-reduced-motion`** → the spinner is the only motion; acceptable, but confirm no essential info is motion-only.

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style
```bash
npx tsc --noEmit
npx eslint src/
```

### Level 2: Build & render classification
```bash
npm run build            # /contact ○ (Static); /api/contact ƒ (Dynamic)
```

### Level 3: Hygiene greps
```bash
! grep -rE "lh3\.googleusercontent|cdn\.tailwindcss" src/ && echo "no stale refs"
! grep -rE "font-headline-|font-body-|font-label-|text-secondary|bg-secondary|bg-primary-container|text-on-surface|bg-surface-container|border-outline-variant" src/app/contact src/components/sections/ContactForm.tsx src/components/ui/Field.tsx src/content/contact.ts && echo "tokens clean"
! grep -rE "server-only|next/headers|resend" src/lib/contact-schema.ts && echo "schema portable"
git check-ignore -v .env.example || echo ".env.example is committable"
```

### Level 4: Manual validation
```bash
npm run dev              # http://localhost:3000/contact
open "HTML files/contact-code.html"   # side-by-side at 375 / 768 / 1440
```
Then run the Task 11 checklist (states, keyboard, axe, Lighthouse). Watch the dev server console for the `[contact] valid submission` log on a successful submit.

---

## ACCEPTANCE CRITERIA

- [ ] `/contact` renders: centered header (badge + h1 + lede) over a two-column grid (form `lg:col-span-7`, imagery `lg:col-span-5`) on `.hero-gradient`, in the export's order
- [ ] Matches `contact-code.html` layout + copy at 375 / 768 / 1440 (typeface/colour match the site, per F1/F2)
- [ ] **Shared zod schema** in `src/lib/contact-schema.ts`, imported by **both** the client form and the server route; framework-agnostic (grep clean)
- [ ] `zod` is a **direct** dependency in `package.json`
- [ ] New `Field` primitive; new client `ContactForm`; **exactly one `"use client"`** in F4 (the form) — page and `Field` are Server-Component-safe
- [ ] Stub `/api/contact` validates with the shared schema and returns the PRD §10 shapes; **sends no email**; honeypot short-circuits to `{ ok: true }`
- [ ] All four states verified live against the stub: validation, submitting (spinner/disabled/`aria-busy`), success (cleared + announced), error (message preserved + `mailto:` fallback, never faked) — **success works with no Resend key**
- [ ] Backdrop uses `next/image fill` in a **responsive** sized frame (never collapses when stacked); dark gradient overlay + "Steady hands." text preserved; `alt=""` (decorative); 512px shipped as-is and **flagged** (D3)
- [ ] `.env.example` committed (survives `.gitignore` via `!.env.example`); documents the F5 vars
- [ ] Accessibility: keyboard traversal, focus-to-first-error, `role="alert"`/`aria-live`, `aria-invalid`/`aria-describedby`, strengthened focus ring; axe zero critical
- [ ] Copy in `src/content/contact.ts`; no inline strings in JSX; no hex literals; no `<main>` in the page; no `CtaBanner`
- [ ] `/contact` `○ (Static)`, `/api/contact` `ƒ (Dynamic)`; no `lh3`/`cdn.tailwindcss` refs
- [ ] `tsc`, `eslint`, `build` clean; Lighthouse ≥ 90 ×4

---

## COMPLETION CHECKLIST

- [ ] All 11 tasks completed in order, each validated
- [ ] Hygiene greps + build-classification gates clean
- [ ] All four form states + honeypot exercised live
- [ ] Home/About/Solutions unaffected (no shared-primitive breakage — `Button` untouched, `Field`/`ContactForm` are additive)
- [ ] No lint/type errors
- [ ] **Deviations + open items reported** (see NOTES)
- [ ] `PRD.md` §16 F4 status → Built; note F5 remains (Resend delivery + honeypot hardening + rate limit), and the `site.contactEmail`/domain placeholder (D4)

---

## NOTES

### Open items to surface in the execution report
1. **`site.contactEmail` is a placeholder** (`hello@dennisventures.com`) — the domain is undecided (PRD D4). It's the one non-verbatim, non-founder-sourced string in F4. Confirm the real address before launch; it appears in the error-state `mailto:` fallback.
2. **F5 is intentionally not built** — the stub `/api/contact` sends no email. F5's remaining work: swap the stub's log for Resend delivery to `CONTACT_TO_EMAIL`, harden the honeypot (silent drop), add rate limiting (429). The seam (`.env.example`, the shared schema, the `{ ok: true }` contract) is in place.
3. **Backdrop is a 512×512 preview in a tall column** — accepted as-is (SCOPE DECISION 2), flagged per D3. A portrait-orientation, higher-res shot is wanted; the frame will accept it with no code change.
4. **Backdrop file is PNG data with a `.jpg` extension** — works via static import, but noted so a future asset swap re-encodes cleanly.
5. **Contact has no closing `CtaBanner`** (unlike the other three pages) — matches the export; not an omission.

### Design decisions
- **Route handler + client `fetch`, not a Server Action** — follows the PRD's explicit §10 API contract (shared schema, honeypot, JSON shapes). The Next 16 docs favor Server Actions with progressive enhancement; that's recorded as a future consideration (below), not adopted, because the PRD designed the route-handler contract and F5 builds on it.
- **`Field` is a Server-Component-safe primitive**, not a client component — only `ContactForm` holds state. This keeps the client bundle to the single interactive island (PRD §6: "exactly one client component plus the contact form").
- **Shared schema in `src/lib/`** (not `src/content/` or the route) so client and server validate identically from one source (PRD §10). Kept free of server-only imports for that reason.
- **Stronger focus ring than the export** — the export's `border-none focus:ring-secondary/20` fails WCAG AA; `Field` uses `focus-visible:outline-2 outline-accent` (US-6).

### Future considerations (do NOT build in F4)
- **Server Action + progressive enhancement** for the form (works without JS) — a possible F5-era refactor if the JS-disabled form submission becomes a requirement; would replace the route handler + client fetch. Trade-off: loses the clean, testable JSON API contract the PRD specified.
- F5 backend; footer legal pages (D6); scheduler integration at the `/contact` seam; per-page OG image generation (F6).

### Confidence
**8.5 / 10** for one-pass success. All layout primitives exist and are proven (Badge, Container, Button, the `next/image fill` frame); the copy is real (verbatim from the export, no placeholder invention beyond the flagged `contactEmail`); the token map is the same one F1/F2 applied. Residual risk is concentrated in the **net-new interactive surface**: (a) the form state machine + focus/live-region a11y (mitigated by the explicit Task 7 flow + Task 11 live checklist), (b) the responsive image-column height that the export got wrong (mitigated by the explicit `h-72 sm:h-96 lg:h-full lg:min-h-[32rem]` + `items-stretch`), and (c) the zod-v4 API surface (mitigated by pinning `.issues`-based error mapping and `z.email()`). All three are caught by the build + live gates.
