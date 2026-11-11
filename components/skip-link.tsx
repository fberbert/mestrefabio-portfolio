"use client";

import { useLang } from "@/context/language-context";

export default function SkipLink() {
  const { t } = useLang();

  return (
    <a
      href="#main"
      className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[1000]"
    >
      {t("menu.skip")}
    </a>
  );
}
