import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Labeled input/textarea with an error slot and the a11y wiring the export
 * lacked (PRD.md §7.4). Presentational and hook-free, so it stays a Server
 * Component even though it's rendered inside the client ContactForm.
 *
 * The export shipped `border-none focus:ring-secondary/20`, which fails WCAG AA
 * focus visibility; this uses a strong accent focus-visible outline instead.
 */

type BaseProps = {
  id: string;
  label: ReactNode;
  error?: string;
  className?: string;
};
// Discriminate input vs textarea so the right native props (and ref type) flow
// through. ComponentPropsWithRef keeps `ref` in the public prop type — React 19
// passes it as a normal prop, so no forwardRef is needed.
type InputField = BaseProps & { as?: "input" } & ComponentPropsWithRef<"input">;
type TextareaField = BaseProps & { as: "textarea" } & ComponentPropsWithRef<"textarea">;

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
          {...(rest as ComponentPropsWithRef<"textarea">)}
        />
      ) : (
        <input
          id={id}
          className={controlClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...(rest as ComponentPropsWithRef<"input">)}
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
