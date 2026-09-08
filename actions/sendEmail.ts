"use server";

import React from "react";
import { Resend } from "resend";
import { z } from "zod";
import ContactFormEmail from "@/email/contact-form-email";
import { reserveContactAttempt } from "@/lib/contact/limiter";
import type { ContactResult } from "@/lib/contact/types";

const contactSchema = z.object({
  senderEmail: z.string().trim().max(254).email(),
  message: z.string().trim().min(1).max(5000),
});

export const sendEmail = async (formData: FormData): Promise<ContactResult> => {
  const parsed = contactSchema.safeParse({
    senderEmail: formData.get("senderEmail"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { success: false, code: "validation" };
  const { senderEmail, message } = parsed.data;
  if (!reserveContactAttempt(senderEmail)) return { success: false, code: "rate_limit" };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "fberbert@gmail.com",
      subject: "Contato Mestre Fábio",
      replyTo: senderEmail,
      react: React.createElement(ContactFormEmail, { message, senderEmail }),
    });
    if (error || !data?.id) {
      console.error("contact_delivery_unconfirmed");
      return { success: false, code: "delivery" };
    }
    return { success: true };
  } catch {
    console.error("contact_delivery_exception");
    return { success: false, code: "delivery" };
  }
};
