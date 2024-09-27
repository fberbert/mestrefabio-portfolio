// footer.tsx
"use client";

import React from "react";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLang();
  const footer = translations[lang].footer;

  return (
    <footer className="mb-10 px-4 text-center dark:text-gray-500 text-gray-700">
      <small className="mb-2 block text-sm">
        {footer?.rights.replace(
          "{{YEAR}}",
          new Date().getFullYear().toString(),
        )}
      </small>
      <p className="text-sm sm:max-w-[50%] sm:mx-auto">
        <span className="font-semibold">{footer?.about.split(/:/)[0]}</span>:{" "}
        {footer?.about.split(/:/)[1]}
      </p>

      <p className="text-sm sm:max-w-[50%] sm:mx-auto mt-2">
       {footer?.github} <a
          href="https://github.com/fberbert/mestrefabio-portfolio"
          target="_blank"
          className="underline"
          aria-label="GitHub"
        >
          GitHub
        </a>.
      </p>
    </footer>
  );
}
