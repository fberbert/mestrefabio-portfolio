// about.tsx
"use client";

import React from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import MusicVideo from "./music-video";
import { useLang } from "@/context/language-context";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

const lastItemVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 3,
    },
  },
};

export default function About() {
  const { t } = useLang();
  const { ref } = useSectionInView("#about", 0.2);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-left leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{
        once: false,
      }}
      id="about"
    >
      <SectionHeading>{t("section.about")}</SectionHeading>
      <p className="mb-7 text-center sm:text-justify text-lg sm:text-2xl">
        {t("about.description")}
      </p>

      <p className="mb-7 text-center sm:text-justify text-lg sm:text-2xl">
        {t("about.phrase1")}
      </p>

      <ul className="sm:mb-3 sm:ml-9 list-none border-0 border-white border-opacity-60 dark:border-gray-900 rounded-md">
        {[
          t("about.stuff1"),
          t("about.stuff2"),
          t("about.stuff3"),
          t("about.stuff4"),
          t("about.stuff5"),
          t("about.stuff6"),
          t("about.stuff7"),
          t("about.stuff8"),
        ].map((item, index) => (
          <motion.li
            key={index}
            className="p-4 py-8 bg-white bg-opacity-10 dark:bg-gray-900 dark:bg-opacity-0"
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: false,
            }}
            custom={index + 1}
          >
            <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
            {item}
          </motion.li>
        ))}
      </ul>

      <p>{t("about.phrase2")}</p>
      <MusicVideo />

      <p className="mt-4 mb-1">{t("about.creationsTitle")}</p>

      <ul className="sm:mb-3 sm:ml-9 list-none border-0 border-white border-opacity-60 dark:border-gray-900 rounded-md">
        <motion.li
          className="bg-white bg-opacity-0 dark:bg-gray-900 p-4 py-8 dark:bg-opacity-30"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={1}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.vivaLinuxDesc")}
        </motion.li>

        <motion.li
          className="p-4 py-8 bg-white bg-opacity-10 dark:bg-gray-900 dark:bg-opacity-0"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={2}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.automatizandoDesc")}
        </motion.li>
        <motion.li
          className="bg-white bg-opacity-0 dark:bg-gray-900 p-4 py-8 dark:bg-opacity-30"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={3}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.talkingToyDesc")}
        </motion.li>
        <motion.li
          className="p-4 py-8 bg-white bg-opacity-10 dark:bg-gray-900 dark:bg-opacity-0"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={4}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.abrirGaragemDesc")}
        </motion.li>
        <motion.li
          className="bg-white bg-opacity-0 dark:bg-gray-900 p-4 py-8 dark:bg-opacity-30"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={5}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.alexaboladaDesc")}
        </motion.li>
        <motion.li
          className="p-4 py-8 bg-white bg-opacity-10 dark:bg-gray-900 dark:bg-opacity-0"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={6}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.cryptoDesc")}
        </motion.li>
        <motion.li
          className="bg-white bg-opacity-0 dark:bg-gray-900 p-4 py-8 dark:bg-opacity-30"
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
          custom={7}
        >
          <FaRegCheckSquare className="inline mr-2 text-blue-700 dark:text-blue-900" />{" "}
          {t("about.openSourceDesc")}
        </motion.li>
        <motion.li
          className="mt-6 mb-3 text-base text-center bg-blue-900 text-white dark:bg-white/10 p-3 rounded-md py-4"
          variants={lastItemVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: false,
          }}
        >
          {t("about.position")}
        </motion.li>
      </ul>
    </motion.section>
  );
}
