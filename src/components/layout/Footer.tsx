import Link from "next/link";
import { certifications, footerLinks, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-outline-soft/20 bg-surface-sunken">
      <div className="mx-auto flex w-full max-w-site flex-col items-center justify-between gap-gutter px-margin-mobile py-12 md:flex-row md:px-margin-desktop">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <span className="text-headline-md font-bold tracking-tight text-ink">
            {site.name}
          </span>
          <p className="text-center text-label-sm text-ink-muted md:text-left">
            {/* The exports hardcode "© 2024". Computed at build time instead. */}
            © {new Date().getFullYear()} {site.name}. {certifications}.
          </p>
        </div>

        {/*
          The exports put two icon buttons here (share, mail); neither had a
          handler. Removed — social links go in this slot once we know which
          accounts exist (LinkedIn is the expected first one).
        */}
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-sm font-medium text-ink-muted decoration-accent transition-colors hover:text-accent hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
