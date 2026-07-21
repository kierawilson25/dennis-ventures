import { contactSchema, getFieldErrors } from "@/lib/contact-schema";

/**
 * Contact form endpoint. Validates with the SAME schema the client uses
 * (PRD.md §10 — never trust the client) and returns the documented JSON shapes.
 *
 * F4 STUB: this does not send email. The user has no Resend key yet, so a valid
 * submission is validated and acknowledged but not delivered. F5 replaces the
 * marked block with real Resend delivery to CONTACT_TO_EMAIL and adds honeypot
 * hardening + rate limiting (429). The contract here is what F5 builds on.
 */
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
  // bots get no signal (PRD.md §10). F5 hardens this + adds rate limiting.
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  // F4 STUB — no email is sent (no Resend key yet). F5 swaps this for real
  // delivery. Log server-side so the success path is observable in dev.
  console.info("[contact] valid submission (delivery deferred to F5):", {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  return Response.json({ ok: true });
}
