"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useLang } from "@/context/language-context";

// Appears after the visitor scrolls past roughly one screen.
export default function ScrollToTop() {
  const { t } = useLang();
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    setActiveSection("#home");
    setTimeOfLastClick(Date.now());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label={t("menu.backToTop")}
          title={t("menu.backToTop")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[900] grid h-12 w-12 place-items-center rounded-full border border-line bg-paper text-ink shadow-[0_6px_20px_-8px_oklch(var(--ink)/0.35)] transition-colors hover:border-accent hover:text-accent-ink sm:bottom-8 sm:right-8"
        >
          <FiArrowUp aria-hidden="true" className="text-lg" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
