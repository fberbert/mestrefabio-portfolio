"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Reveal from "./reveal";
import { translations } from "@/lib/translations";
import { useSectionInView } from "@/lib/hooks";
import { useLang } from "@/context/language-context";

export default function Experience() {
  const { t, lang } = useLang();
  const { ref } = useSectionInView("#experience", 0.1);

  return (
    <section
      id="experience"
      ref={ref}
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading index="03">{t("section.experience")}</SectionHeading>
      <ol>
        {translations[lang].experiencesData.map((item) => (
          <li key={`${item.title}-${item.date}`}>
            <Reveal className="grid gap-2 border-t border-line py-8 md:grid-cols-12 md:gap-8">
              <p className="label pt-1 tabular-nums text-muted md:col-span-3">{item.date}</p>
              <div className="md:col-span-9">
                <h3 className="font-display text-xl font-bold tracking-tight [font-stretch:105%] sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-1 font-display text-sm font-medium text-accent-ink">
                  {item.location}
                </p>
                <p className="mt-3 max-w-[70ch] leading-relaxed text-muted">{item.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
