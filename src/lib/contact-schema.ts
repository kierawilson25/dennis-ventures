import { z } from "zod";

/**
 * Shared by the client form (ContactForm.tsx) and the server route
 * (api/contact/route.ts). Keep this file free of server-only / React / Next
 * imports so both bundles can import it — the same schema validates on both
 * sides (PRD.md §10).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email("Enter a valid email address."), // zod v4 top-level format
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(2000, "Please keep it under 2000 characters."),
  // Honeypot: real users never fill this. It must PASS schema validation (no
  // max(0) constraint) so the route — not the validator — decides a filled
  // value is a bot and returns a silent {ok:true}. A schema rejection here
  // would 400 with the field name, handing bots the exact signal the honeypot
  // denies. Enforcement/hardening is F5.
  website: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Map a ZodError to { field: firstMessage }. Reads `.issues` (stable across
 * zod v4) rather than the deprecated `.flatten()`.
 */
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
