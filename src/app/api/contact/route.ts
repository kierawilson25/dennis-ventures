import { Resend } from "resend";
import { renderContactEmail } from "@/lib/contact-email";
import { contactSchema, getFieldErrors } from "@/lib/contact-schema";

/**
 * Contact form endpoint. Validates with the SAME schema the client uses
 * (PRD.md §10 — never trust the client) and returns the documented JSON shapes.
 *
 * F5: delivers via Resend to CONTACT_TO_EMAIL. Sends from the shared
 * onboarding@resend.dev address since the sending domain isn't verified yet
 * (no DNS access on dennisventuresllc.com) — swap to a verified domain
 * address once that's available.
 *
 * The client is constructed inside the handler, not at module scope — Next
 * executes this file's top level during the build's page-data-collection
 * step, before build-time env vars are guaranteed to be populated.
 */
export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { name, email, message } = parsed.data;
  const { html, text } = renderContactEmail({ name, email, message });

  const { error } = await resend.emails.send({
    from: "Dennis Ventures Contact Form <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    html,
    text,
  });

  if (error) {
    console.error("[contact] Resend delivery failed:", error);
    return Response.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
