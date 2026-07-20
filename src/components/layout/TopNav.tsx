"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { bookingCta, navLinks, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The exports do this by mutating classList on scroll; here it drives state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The menu closes when a link inside it is tapped (see onClick below), which
  // is the React-idiomatic alternative to a pathname effect — it also covers
  // tapping the current page's link, where pathname wouldn't change.

  // Escape to close, Tab cycles within the panel, and the page behind it
  // doesn't scroll while it's open.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-outline-soft/30",
        "bg-surface/80 backdrop-blur-md transition-all duration-300 motion-reduce:transition-none",
        scrolled ? "py-2 shadow-md" : "py-4 shadow-sm",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-site items-center justify-between px-margin-mobile py-4 md:px-margin-desktop"
      >
        <Link
          href="/"
          className="text-headline-md font-bold tracking-tight text-ink"
        >
          {site.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-label-sm transition-colors",
                  isActive(link.href)
                    ? "border-b-2 border-accent pb-1 font-semibold text-accent"
                    : "font-medium text-ink-muted hover:text-accent",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href={bookingCta.href} size="sm" className="font-semibold">
            {bookingCta.label}
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/*
        No export has a mobile menu — the nav is `hidden md:flex` with nothing
        behind it, so phone visitors currently have no navigation at all. This
        is new design work, not a port. See PRD.md US-5 / R6.
      */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!menuOpen}
        className="border-t border-outline-soft/30 bg-surface md:hidden"
      >
        <ul className="flex flex-col px-margin-mobile py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "block border-l-2 py-4 pl-4 text-body-md transition-colors",
                  isActive(link.href)
                    ? "border-accent font-semibold text-accent"
                    : "border-transparent font-medium text-ink-muted hover:text-accent",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-margin-mobile pb-6 pt-2">
          <Button
            href={bookingCta.href}
            onClick={closeMenu}
            size="sm"
            className="w-full"
          >
            {bookingCta.label}
          </Button>
        </div>
      </div>
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" />
          <line x1="18" y1="4" x2="4" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </>
      )}
    </svg>
  );
}
