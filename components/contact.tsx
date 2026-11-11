"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Reveal from "./reveal";
import { useSectionInView } from "@/lib/hooks";
import ContactForm from "./contact-form";
import SocialMediaBar from "./social-media-bar";
import { useLang } from "@/context/language-context";

export default function Contact() {
  const { t } = useLang();
  const { ref } = useSectionInView("#contact", 0.3);

  return (
    <section
      id="contact"
      ref={ref}
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading index="05">{t("section.contact")}</SectionHeading>

      {/* Mobile order: intro, form, social links. Desktop: form spans the right column. */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
        <Reveal className="lg:col-span-5">
          <p
            className="text-xl leading-relaxed sm:text-2xl"
            dangerouslySetInnerHTML={{ __html: t("contact.description") }}
          />
          <p className="mt-4 leading-relaxed text-muted">{t("contact.guidance")}</p>
        </Reveal>

        <Reveal className="lg:col-span-7 lg:row-span-2" delay={0.1}>
          <ContactForm />
        </Reveal>

        <Reveal className="lg:col-span-5">
          <h3 className="label text-muted">{t("contact.footer")}</h3>
          <SocialMediaBar />
        </Reveal>
      </div>
    </section>
  );
}
