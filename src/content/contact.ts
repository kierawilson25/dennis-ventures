/**
 * Contact page copy. Every string the page renders lives here as a typed field —
 * components never inline copy. Header / field / overlay copy is transcribed
 * verbatim from HTML files/contact-code.html. The status and validation
 * messages are new: the export's form handler is truncated mid-function, so
 * there was nothing to port — they are written in the site's calm voice.
 */

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
