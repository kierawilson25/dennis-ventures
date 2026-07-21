"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/icons";
import {
  contactSchema,
  getFieldErrors,
  type ContactInput,
} from "@/lib/contact-schema";
import { contactEmail } from "@/content/site";
import { form as copy } from "@/content/contact";

/**
 * The site's one interactive island. Written from scratch — the export's
 * handler is truncated. Controlled inputs, client-side validation against the
 * shared schema, four states (idle → submitting → success / error), and a
 * hidden honeypot. The message is preserved on error; never faked to success
 * (PRD.md R7). The server re-validates with the same schema (route.ts).
 */

type Status = "idle" | "submitting" | "success" | "error";
type Values = { name: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const EMPTY: Values = { name: "", email: "", message: "" };

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const submitting = status === "submitting";

  const focusFirstError = (fieldErrors: FieldErrors) => {
    if (fieldErrors.name) nameRef.current?.focus();
    else if (fieldErrors.email) emailRef.current?.focus();
    else if (fieldErrors.message) messageRef.current?.focus();
  };

  const update = (key: keyof Values) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    // Clear a field's error as the visitor corrects it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = { ...values, website: honeypotRef.current?.value ?? "" };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = getFieldErrors(parsed.error);
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        setValues(EMPTY);
        return;
      }

      if (res.status === 400 && data.errors) {
        setErrors(data.errors as FieldErrors);
        setStatus("idle");
        focusFirstError(data.errors as FieldErrors);
        return;
      }

      setStatus("error");
    } catch {
      // Network failure — keep the typed message so nothing is lost.
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="glass-card flex flex-col items-start rounded-xl p-8 md:p-12"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-lavender text-accent">
          <Icon name="verified" size={28} />
        </div>
        <h2 className="text-headline-md font-bold text-ink">
          {copy.success.heading}
        </h2>
        <p className="mt-2 text-body-md leading-relaxed text-ink-muted">
          {copy.success.body}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-8"
          onClick={() => setStatus("idle")}
        >
          {copy.success.resetLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-8 md:p-12">
      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          <Field
            id="name"
            name="name"
            ref={nameRef}
            label={copy.fields.name.label}
            placeholder={copy.fields.name.placeholder}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            error={errors.name}
          />
          <Field
            id="email"
            name="email"
            ref={emailRef}
            label={copy.fields.email.label}
            placeholder={copy.fields.email.placeholder}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            error={errors.email}
          />
          <Field
            as="textarea"
            id="message"
            name="message"
            ref={messageRef}
            label={copy.fields.message.label}
            placeholder={copy.fields.message.placeholder}
            rows={5}
            value={values.message}
            onChange={update("message")}
            error={errors.message}
          />
        </div>

        {/* Honeypot — off-screen (not display:none, which some bots skip).
            Real users never see or fill it. */}
        <div
          aria-hidden
          className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            ref={honeypotRef}
          />
        </div>

        {status === "error" ? (
          <p role="alert" className="text-body-md text-error">
            {copy.error.body}{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold underline decoration-error/40 underline-offset-2 hover:decoration-error"
            >
              {contactEmail}
            </a>
            .
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <Spinner />
              {copy.submittingLabel}
            </>
          ) : (
            <>
              {copy.submitLabel}
              <Icon name="arrow_forward" size={20} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
