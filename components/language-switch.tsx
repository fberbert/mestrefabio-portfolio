"use client";

import { useLang } from "@/context/language-context";

export default function LangSwitch() {
  const { toggleLang, t } = useLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t("menu.langLabel")}
      title={t("menu.langLabel")}
      className="label grid h-11 min-w-[2.75rem] place-items-center rounded-sm border border-line px-2 text-ink transition-colors hover:border-ink"
    >
      {t("menu.langShort")}
    </button>
  );
}
