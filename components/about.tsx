"use client";

import React from "react";
import { FaRegCheckSquare } from "react-icons/fa";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About", 0.2);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-justify leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        Full Stack Engineer. Engaged to React/Next.JS, JavaScript, Artificial
        Inteligence, Shell Scripting, Python, Cryptocurrencies, Home Assistant
        and last but not least GNU/Linux!
      </p>

      <p className="mb-1">Key Creations and Contributions:</p>

      <ul className="sm:mb-3 sm:ml-9 list-none border-4 border-gray-400 dark:border-gray-900 rounded-md">
        <li className="bg-gray-400 dark:bg-gray-900 p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Founder of <a target="_blank" href="https://vivaolinux.com.br" className="underline">Viva o Linux</a> - A renowned website in the Linux community.
        </li>

        <li className="p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          <a target="_blank" href="https://automatizando.dev" className="underline">Automatizando.dev</a> - A hub for my innovations in home automation and AI.
        </li>
        <li className="bg-gray-400 dark:bg-gray-900 p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Inventor of <a target="_blank" href="https://automatizando.dev/brinquedo" className="underline">Talking Toy</a> - An interactive toy integrating Alexa skills and AI.
        </li>
        <li className="p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Developer of <a target="_blank" href="https://automatizando.dev/garagem" className="underline">Abrir Garagem</a> - A smart solution for garage door automation.
        </li>
        <li className="bg-gray-400 dark:bg-gray-900 p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Instagram Content Creator: <a target="_blank" href="https://instagram.com/alexabolada" className="underline">@alexabolada</a> - Sharing insights and developments in AI and home automation.
        </li>
        <li className="p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Expert in Cryptocurrency: Active in the field since 2016, with a focus
          on emerging technologies.
        </li>
        <li className="bg-gray-400 dark:bg-gray-900 p-4">
          <FaRegCheckSquare className="inline mr-2" />
          {" "}
          Free Software Community Contributor: Since 2002, contributing to
          various open-source projects.
        </li>
      </ul>

      <p className="mt-6 mb-3 text-base text-center bg-gray-300 dark:bg-gray-800 p-3 rounded-full">
        I am currently open for a{" "}
        <span className="font-medium">full-time position</span> as a software
        developer / devops engineer.
      </p>
    </motion.section>
  );
}
