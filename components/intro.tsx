"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import Typed from "typed.js";
import { useLang } from "@/context/language-context";

export default function Intro() {
  const { t } = useLang();
  const { ref } = useSectionInView("#home", 0.5);
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const yearsOfExperience = new Date().getFullYear() - 2000;
    const typed = new Typed(typedRef.current!, {
      strings: t(`intro.typed`).replace("{{YEARS}}", yearsOfExperience.toString()).split("\n"),
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 5000,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [t]);

  return (
    <section
      ref={ref}
      id="home"
      className="mb-4 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src="/img/profile-picture2.jpg"
              alt="Fábio portrait"
              width="192"
              height="192"
              quality="95"
              priority={true}
              className="h-24 w-24 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-[-25px] text-2xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, scaleX: -1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl min-h-[196px]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span ref={typedRef}></span>
      </motion.h1>
    </section>
  );
}
