import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-3 rounded-lg font-bold " +
  "transition-all active:scale-95 focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-accent-ink hover:shadow-lg",
  outline: "border border-outline text-accent hover:bg-surface-sunken",
};

/** Sizes match the three button treatments recurring across all four exports. */
const sizes: Record<Size, string> = {
  sm: "px-6 py-2.5 text-label-sm",
  md: "px-8 py-4 text-label-sm",
  lg: "px-10 py-5 text-lg",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };
type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: never };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  // One destructure: the styling props come out, everything else (`href`,
  // `onClick`, `type`, aria-*, …) rides along in `rest` and is forwarded to
  // whichever element renders.
  const { variant = "solid", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  // The exports render every CTA as a <button>, including ones that navigate.
  // Anything with an href becomes a real <Link> so it is keyboard- and
  // screen-reader-correct and works before hydration.
  if ("href" in rest && rest.href) {
    return (
      <Link className={classes} {...(rest as ComponentPropsWithoutRef<typeof Link>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
