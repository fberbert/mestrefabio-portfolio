"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { sendEmail } from "@/actions/sendEmail";
import { useLang } from "@/context/language-context";
import type { ContactResult } from "@/lib/contact/types";
import ContactSubmitButton from "./contact-submit-button";

export default function ContactForm({ action = sendEmail }: { action?: (data: FormData) => Promise<ContactResult> }) {
  const { t } = useLang();
  const formRef = useRef<HTMLFormElement>(null);
  // Controlled fields survive React's automatic form reset after an action resolves.
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <form ref={formRef} className="mt-10 flex flex-col dark:text-black" action={async data => {
      try {
        const result = await action(data);
        if (!result.success) { toast.error(t(`contact.${result.code}`)); return; }
        toast.success(t("contact.success"));
        formRef.current?.reset();
        setEmail(""); setMessage("");
      } catch { toast.error(t("contact.delivery")); }
    }}>
      <label htmlFor="contact-email" className="sr-only">{t("contact.email")}</label>
      <input id="contact-email" className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
        name="senderEmail" type="email" required maxLength={254} placeholder={t("contact.email")} value={email} onChange={event => setEmail(event.target.value)} />
      <label htmlFor="contact-message" className="sr-only">{t("contact.message")}</label>
      <textarea id="contact-message" className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
        name="message" placeholder={t("contact.message")} required maxLength={5000} value={message} onChange={event => setMessage(event.target.value)} />
      <ContactSubmitButton label={t("contact.submit")} />
    </form>
  );
}
