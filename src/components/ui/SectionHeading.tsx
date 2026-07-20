import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The 64x6 accent rule that sits under headings on every page. */
export function AccentRule({ className }: { className?: string }) {
  return <div className={cn("h-1.5 w-16 rounded-full bg-accent", className)} />;
}

export function SectionHeading({
  title,
  lede,
  align = "left",
  rule = true,
  size = "lg",
  className,
}: {
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  rule?: boolean;
  size?: "lg" | "xl";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      <h2
        className={cn(
          "text-ink",
          size === "xl"
            ? "text-headline-xl-tight md:text-headline-xl"
            : "text-headline-lg-tight md:text-headline-lg",
        )}
      >
        {title}
      </h2>
      {rule ? <AccentRule className={cn("mt-6", centered && "mx-auto")} /> : null}
      {lede ? (
        <p
          className={cn(
            "mt-6 text-body-lg leading-relaxed text-ink-muted",
            centered && "mx-auto max-w-2xl",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
