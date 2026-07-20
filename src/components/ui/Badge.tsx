import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The uppercase lavender pill: "Executive & Health Coaching", "Our Story". */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-lavender px-4 py-1.5",
        "text-label-sm font-bold uppercase tracking-widest text-lavender-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
