import type { ContactInput } from "@/lib/contact-schema";

// User-controlled fields land inside HTML below — escape to prevent markup/
// link injection in the rendered email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderContactEmail({ name, email, message }: Omit<ContactInput, "website">) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#eef5f7;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef5f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#00a8cc;padding:28px 32px;">
                <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.01em;">Dennis Ventures</p>
                <p style="margin:4px 0 0;font-size:13px;color:#e6e6fa;">New contact form submission</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:20px;">
                      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#46464c;">Name</p>
                      <p style="margin:0;font-size:16px;color:#191c1e;">${safeName}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:20px;padding-top:20px;border-top:1px solid #c7c5cc;">
                      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#46464c;">Email</p>
                      <p style="margin:0;font-size:16px;"><a href="mailto:${safeEmail}" style="color:#00a8cc;text-decoration:none;">${safeEmail}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #c7c5cc;">
                      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#46464c;">Message</p>
                      <p style="margin:0;font-size:15px;line-height:1.6;color:#191c1e;">${safeMessage}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f4fafd;padding:16px 32px;">
                <p style="margin:0;font-size:12px;color:#77767d;">Sent from the contact form at dennisventuresllc.com. Reply-to is set to the sender's email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\n${message}`;

  return { html, text };
}
