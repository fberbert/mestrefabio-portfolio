"use client";

import React from "react";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const scrollToTop = () => {
    setActiveSection("#home");
    setTimeOfLastClick(Date.now());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="bg-white w-[2.2rem] h-[2.2rem] sm:w-[3rem] sm:h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] no-border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center sm:hover:scale-[1.15] transition-all dark:bg-gray-950"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
}
