// header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import LanguageSwitch from "@/components/language-switch";
import ThemeSwitch from "@/components/theme-switch";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function Header() {
  const { lang, t } = useLang();
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const [menuOpen, setMenuOpen] = useState(false);

  // Home is reached through the wordmark, so it stays out of the link list.
  const links = translations[lang].header.links.filter(
    (link) => link.hash !== "#home",
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (hash: string) => {
    setActiveSection(hash);
    setTimeOfLastClick(Date.now());
    setMenuOpen(false);
  };

  const navLink = (hash: string, name: string, mobile = false) => (
    <Link
      href={hash}
      onClick={() => go(hash)}
      aria-current={activeSection === hash ? "location" : undefined}
      className={clsx(
        "font-display font-semibold transition-colors",
        mobile
          ? "block border-b border-line py-4 text-2xl [font-stretch:112%]"
          : "relative py-2 text-sm uppercase tracking-[0.08em]",
        activeSection === hash ? "text-ink" : "text-muted hover:text-ink",
      )}
    >
      {name}
      {!mobile && activeSection === hash && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-accent"
        />
      )}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[999] border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="#home"
          onClick={() => go("#home")}
          className="whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-[0.06em] [font-stretch:115%] sm:text-base"
        >
          Mestre Fábio
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.hash}>{navLink(link.hash, link.name)}</li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeSwitch />
          <button
            type="button"
            className="label grid h-11 w-[5.5rem] place-items-center rounded-sm border border-line text-ink md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? t("menu.close") : t("menu.open")}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-line bg-paper px-5 pb-6 md:hidden"
        >
          <ul>
            {links.map((link) => (
              <li key={link.hash}>{navLink(link.hash, link.name, true)}</li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
