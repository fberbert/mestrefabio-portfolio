// footer.tsx
"use client";

import React from "react";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLang();
  const footer = translations[lang].footer;
  const colon = footer.about.indexOf(":");
  const aboutLabel = footer.about.slice(0, colon);
  const aboutText = footer.about.slice(colon + 1);

  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 sm:pb-28">
      <div className="flex flex-col gap-4 border-t border-ink pt-6 text-sm text-muted md:flex-row md:justify-between md:gap-10">
        <p className="font-display font-semibold text-ink">
          {footer.rights.replace("{{YEAR}}", new Date().getFullYear().toString())}
        </p>
        <p className="max-w-[60ch]">
          <span className="font-semibold">{aboutLabel}:</span>
          {aboutText}{" "}
          {footer.github}{" "}
          <a
            href="https://github.com/fberbert/mestrefabio-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
