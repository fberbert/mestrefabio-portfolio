"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="bg-white w-[2.2rem] h-[2.2rem] sm:w-[3rem] sm:h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] no-border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center sm:hover:scale-[1.15] transition-all dark:bg-gray-950"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <BsSun title="Switch to dark theme" />
      ) : (
        <BsMoon title="Switch to light theme" />
      )}
    </button>
  );
}
