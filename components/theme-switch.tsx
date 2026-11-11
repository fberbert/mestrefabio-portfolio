"use client";

import { useTheme } from "@/context/theme-context";
import { useLang } from "@/context/language-context";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const label = theme === "light" ? t("menu.themeToDark") : t("menu.themeToLight");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-sm border border-line text-ink transition-colors hover:border-ink"
    >
      {theme === "light" ? <BsMoon aria-hidden="true" /> : <BsSun aria-hidden="true" />}
    </button>
  );
}
