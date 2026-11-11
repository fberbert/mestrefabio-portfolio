// about.tsx
"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import MusicVideo from "./music-video";
import Reveal from "./reveal";
import { useLang } from "@/context/language-context";
import { yearsOfExperience } from "@/lib/utils";

export default function About() {
  const { t } = useLang();
  const { ref } = useSectionInView("#about", 0.2);

  const help = [t("about.help1"), t("about.help2"), t("about.help3"), t("about.help4")];

  return (
    <section
      ref={ref}
      id="about"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading index="02">{t("section.about")}</SectionHeading>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <p className="text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">
            {t("about.description").replace("{{YEARS}}", yearsOfExperience().toString())}
          </p>

          <h3 className="label mt-14 text-muted">{t("about.helpTitle")}</h3>
          <ol className="mt-4 border-b border-line">
            {help.map((item, index) => (
              <li key={index} className="flex gap-5 border-t border-line py-5">
                <span className="font-display text-sm font-bold text-accent-ink" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 font-display text-lg font-semibold">
            {t("about.position")}{" "}
            <a href="#contact" className="link whitespace-nowrap">
              {t("intro.contactCta")}
            </a>
          </p>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start" delay={0.1}>
          <aside
            id="mestre"
            className="scroll-mt-8 border-t-4 border-accent bg-surface p-6 sm:p-8"
          >
            <p className="font-display text-5xl font-extrabold leading-none text-accent-ink" aria-hidden="true">
              *
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight [font-stretch:108%]">
              {t("about.storyTitle")}
            </h3>
            <p className="mt-4 text-lg italic leading-relaxed">{t("about.story")}</p>
          </aside>
        </Reveal>
      </div>

      <Reveal className="mt-20 grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <MusicVideo label={t("about.musicCaption")} />
        </div>
        <div className="lg:col-span-5">
          <h3 className="label text-muted">{t("about.offTitle")}</h3>
          <ul className="mt-4 space-y-4 leading-relaxed">
            <li>{t("about.musicCaption")}</li>
            <li>
              <a
                href="https://www.instagram.com/alexabolada/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {t("about.alexaboladaDesc")}
              </a>
            </li>
            <li>{t("about.cryptoDesc")}</li>
            <li>{t("about.openSourceDesc")}</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
