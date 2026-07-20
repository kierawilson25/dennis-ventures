import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The centered, max-width, horizontally-padded wrapper (max-w-site + the
 * responsive margin tokens) that wraps essentially every section. One place.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-site px-margin-mobile md:px-margin-desktop",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
