"use client";

import React from "react";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const scrollToTop = () => {
    setActiveSection("Home");
    setTimeOfLastClick(Date.now());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="fixed bottom-20 right-5 bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
      onClick={scrollToTop}
    >
      <FaArrowUp />
    </button>
  );
}
