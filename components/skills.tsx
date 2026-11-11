"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Reveal from "./reveal";
import { useSectionInView } from "@/lib/hooks";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function Skills() {
  const { t, lang } = useLang();
  const { ref } = useSectionInView("#skills", 0.2);

  return (
    <section
      id="skills"
      ref={ref}
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading index="04">{t("section.skills")}</SectionHeading>
      <div className="grid gap-12 md:grid-cols-3 md:gap-10">
        {translations[lang].skills.map((group, index) => (
          <Reveal key={group.title} delay={index * 0.08}>
            <h3 className="border-t border-ink pt-3 font-display text-xl font-bold tracking-tight [font-stretch:108%]">
              {group.title}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-sm border border-line px-2.5 py-1 font-display text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
