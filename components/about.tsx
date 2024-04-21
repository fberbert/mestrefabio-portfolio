"use client";

import React from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

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
  const { ref } = useSectionInView("About", 0.5);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-left leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-7 text-center sm:text-justify text-lg sm:text-2xl">
        Full Stack Engineer. Engaged to React/Next.JS, JavaScript, Artificial
        Inteligence, Shell Scripting, Python, Cryptocurrencies, Home Assistant
        and last but not least GNU/Linux!
      </p>

      <p className="mb-1">Key Creations and Contributions:</p>

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
          Founder of{" "}
          <a
            target="_blank"
            href="https://vivaolinux.com.br"
            className="underline"
          >
            Viva o Linux
          </a>{" "}
          - A renowned website in the Linux community.
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
          <a
            target="_blank"
            href="https://automatizando.dev"
            className="underline"
          >
            Automatizando.dev
          </a>{" "}
          - A hub for my innovations in home automation and AI.
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
          Inventor of{" "}
          <a
            target="_blank"
            href="https://automatizando.dev/brinquedo"
            className="underline"
          >
            Talking Toy
          </a>{" "}
          - An interactive toy integrating Alexa skills and AI.
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
          Developer of{" "}
          <a
            target="_blank"
            href="https://automatizando.dev/garagem"
            className="underline"
          >
            Abrir Garagem
          </a>{" "}
          - A smart solution for garage door automation.
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
          Instagram Content Creator:{" "}
          <a
            target="_blank"
            href="https://instagram.com/alexabolada"
            className="underline"
          >
            @alexabolada
          </a>{" "}
          - Sharing insights and developments in AI and home automation.
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
          Expert in Cryptocurrency: Active in the field since 2016, with a focus
          on emerging technologies.
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
          Free Software Community Contributor: Since 2002, contributing to
          various open-source projects.
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
          I am currently open for a{" "}
          <span className="font-medium">full-time position</span> as a software
          developer / devops engineer.
        </motion.li>
      </ul>
    </motion.section>
  );
}
