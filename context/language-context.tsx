"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { translations } from "@/lib/translations";

type Lang = "en" | "pt-BR";

type LangContextProviderProps = {
  children: React.ReactNode;
};

type LangContextType = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType | null>(null);

// auxiliar function to access nested keys
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split(".");
  let current = obj;
  for (let key of keys) {
    if (current[key] === undefined) {
      return path; // return the path if the key is not found
    }
    current = current[key];
  }
  return typeof current === "string" ? current : path; // return the path if the key is not found
};

export default function LangContextProvider({
  children,
}: LangContextProviderProps) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => {
    if (lang === "en") {
      setLang("pt-BR");
      window.localStorage.setItem("lang", "pt-BR");
    } else {
      setLang("en");
      window.localStorage.setItem("lang", "en");
    }
  };

  const t = (key: string) => {
    // using the current language, get the translation
    return getNestedTranslation(translations[lang], key);
  };

  useEffect(() => {
    const localLang = window.localStorage.getItem("lang") as Lang | null;

    if (localLang) {
      setLang(localLang);
    }

    if (window.navigator.language === "pt-BR") {
      setLang("pt-BR");
    }
  }, []);

  return (
    <LangContext.Provider
      value={{
        lang,
        toggleLang,
        t,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);

  if (context === null) {
    throw new Error("useLang must be used within a LangContextProvider");
  }

  return context;
}
