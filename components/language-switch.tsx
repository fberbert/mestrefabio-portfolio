"use client";

import { useLang } from "@/context/language-context";
import React from "react";
// Importando os ícones das bandeiras
import { US, BR } from 'country-flag-icons/react/3x2';

export default function LangSwitch() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      className="fixed top-[5px] sm:top-[12px] right-2 sm:right-5 sm:w-[30px] sm:h-[30px] w-[25px] h-[25px] bg-opacity-0 no-border flex items-center justify-center p-0 overflow-hidden brightness-90 hover:brightness-110 active:brightness-90 active:scale-105 transition-all rounded-lg"
      onClick={toggleLang}
      aria-label="Toggle language"
    >
      {lang === "en" ? (
        <US
          title="Mudar para Português"
          className="object-cover"
        />
      ) : (
        <BR
          title="Switch to English"
          className="object-cover"
        />
      )}
    </button>
  );
}
