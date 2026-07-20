/**
 * Joins class names, dropping falsy values. Deliberately not clsx/tailwind-merge:
 * this site has no conditional-variant collisions that would need merge
 * semantics, and a five-line helper beats two dependencies.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
