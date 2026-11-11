"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { sendEmail } from "@/actions/sendEmail";
import { useLang } from "@/context/language-context";
import type { ContactResult } from "@/lib/contact/types";
import ContactSubmitButton from "./contact-submit-button";

type Status = { kind: "success" | "error"; message: string } | null;

const fieldClass =
  "mt-2 w-full rounded-sm border border-line bg-paper px-4 text-ink placeholder:text-muted transition-colors hover:border-ink/40 focus:border-accent-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";

export default function ContactForm({ action = sendEmail }: { action?: (data: FormData) => Promise<ContactResult> }) {
  const { t } = useLang();
  const formRef = useRef<HTMLFormElement>(null);
  // Controlled fields survive React's automatic form reset after an action resolves.
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>(null);

  return (
    <form ref={formRef} className="flex flex-col gap-6" action={async data => {
      setStatus(null);
      try {
        const result = await action(data);
        if (!result.success) { setStatus({ kind: "error", message: t(`contact.${result.code}`) }); return; }
        setStatus({ kind: "success", message: t("contact.success") });
        formRef.current?.reset();
        setEmail(""); setMessage("");
      } catch { setStatus({ kind: "error", message: t("contact.delivery") }); }
    }}>
      <div>
        <label htmlFor="contact-email" className="label text-muted">{t("contact.email")}</label>
        <input id="contact-email" className={clsx(fieldClass, "h-12")}
          name="senderEmail" type="email" required maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} />
      </div>
      <div>
        <label htmlFor="contact-message" className="label text-muted">{t("contact.message")}</label>
        <textarea id="contact-message" className={clsx(fieldClass, "h-48 py-3")}
          name="message" required maxLength={5000} value={message} onChange={event => setMessage(event.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <ContactSubmitButton label={t("contact.submit")} pendingLabel={t("contact.sending")} />
        <p role="status" aria-live="polite"
          className={clsx("font-display text-sm font-medium", status?.kind === "error" ? "text-error" : "text-accent-ink")}>
          {status?.message}
        </p>
      </div>
    </form>
  );
}
