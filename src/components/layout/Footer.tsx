import { certifications, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-outline-soft/20 bg-surface-sunken">
      <div className="mx-auto flex w-full max-w-site flex-col items-center gap-4 px-margin-mobile py-12 text-center md:flex-row md:justify-between md:gap-gutter md:px-margin-desktop md:text-left">
        <span className="text-headline-md font-bold tracking-tight text-ink">
          {site.name}
        </span>
        <p className="text-label-sm text-ink-muted">
          {/* The exports hardcode "© 2024". Computed at build time instead. */}
          © {new Date().getFullYear()} {site.name}. {certifications}.
        </p>
      </div>
    </footer>
  );
}
