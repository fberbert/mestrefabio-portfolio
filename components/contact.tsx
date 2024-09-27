"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SocialMediaBar from "./social-media-bar";
import toast from "react-hot-toast";
import { useLang } from "@/context/language-context";
import { FaPaperPlane } from "react-icons/fa";
import { useFormStatus } from "react-dom";

export default function Contact() {
  const { t } = useLang();
  const { ref } = useSectionInView("#contact");
  const { pending } = useFormStatus();

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

      <form
        className="mt-10 flex flex-col dark:text-black"
        action={async (formData) => {
          const { data, error } = await sendEmail(formData);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success("Email sent successfully!");
          // clear form fields
          const form = document.querySelector("form");
          if (form) form.reset();
        }}
      >
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder={t("contact.email")}
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          placeholder={t("contact.message")}
          required
          maxLength={5000}
        />
        <button
          type="submit"
          className="group flex items-center justify-center gap-2 h-[3rem] w-auto bg-gray-900 text-white rounded-full outline-none transition-all focus:scale-110 hover:bg-gray-950 active:scale-105 dark:bg-white dark:bg-opacity-10 disabled:scale-100 disabled:bg-opacity-65 hover:bg-black dark:hover:bg-opacity-20"
          disabled={pending}
        >
          {pending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
          ) : (
            <>
              {t("contact.submit")}{" "}
              <FaPaperPlane className="text-xs opacity-70 transition-all" />{" "}
            </>
          )}
        </button>
      </form>

      <p className="text-gray-700 dark:text-white/80 mt-4">
        {t("contact.footer")}
      </p>

      <SocialMediaBar />
    </motion.section>
  );
}
