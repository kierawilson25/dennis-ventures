import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The frosted card used for every service/pillar across Home, About, Solutions.
 *
 * `accent` picks the bottom border: the exports alternate lavender / aqua /
 * lavender across each three-card row.
 *
 * `icon` is a ReactNode rather than a name because the icon strategy is still
 * open (PRD.md D5 — self-hosted Material Symbols subset vs inline SVG). Pages
 * pass whatever wins; this component doesn't care.
 */
export function Card({
  icon,
  iconWell = "lavender",
  accent = "lavender",
  title,
  children,
  className,
}: {
  icon?: ReactNode;
  iconWell?: "lavender" | "aqua" | "lavender-soft";
  accent?: "lavender" | "accent";
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const wells = {
    lavender: "bg-lavender",
    aqua: "bg-aqua-soft",
    "lavender-soft": "bg-lavender/40",
  } as const;

  return (
    <div
      className={cn(
        "glass-card flex h-full flex-col rounded-lg p-10 transition-all duration-300 hover:shadow-xl",
        accent === "accent" ? "border-b-4 border-b-accent" : "border-b-4 border-b-lavender",
        className,
      )}
    >
      {icon ? (
        <div
          className={cn(
            "mb-6 flex h-14 w-14 items-center justify-center rounded-lg text-accent",
            wells[iconWell],
          )}
        >
          {icon}
        </div>
      ) : null}
      <h3 className="mb-3 text-headline-md font-bold text-ink">{title}</h3>
      <div className="text-body-md leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
