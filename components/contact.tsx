"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import ContactForm from "./contact-form";
import SocialMediaBar from "./social-media-bar";
import { useLang } from "@/context/language-context";

export default function Contact() {
  const { t } = useLang();
  const { ref } = useSectionInView("#contact");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: false,
      }}
    >
      <SectionHeading>{t("section.contact")}</SectionHeading>

      <p
        className="text-gray-700 -mt-6 dark:text-white/80"
        dangerouslySetInnerHTML={{ __html: t("contact.description") }}
      />

      <ContactForm />

      <p className="text-gray-700 dark:text-white/80 mt-4">
        {t("contact.footer")}
      </p>

      <SocialMediaBar />
    </motion.section>
  );
}
