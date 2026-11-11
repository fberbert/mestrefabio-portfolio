"use client";

import Image from "next/image";
import React from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { useSectionInView } from "@/lib/hooks";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { yearsOfExperience } from "@/lib/utils";
import Reveal from "./reveal";

export default function Intro() {
  const { t, lang } = useLang();
  const { ref } = useSectionInView("#home", 0.5);

  // The hero ledger lists the first live products, in the same order as the Projects section.
  const live = Object.values(translations[lang].projectsData)
    .filter((project) => project.visible && project.url)
    .slice(0, 6);

  return (
    <section
      ref={ref}
      id="home"
      className="mx-auto grid w-full max-w-6xl gap-14 px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:grid-cols-12 lg:gap-10"
    >
      <Reveal className="lg:col-span-8">
        <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight [font-stretch:110%]">
          {t("intro.title")}
        </h1>

        <div className="mt-10 flex items-start gap-5">
          <Image
            src="/img/profile-picture3.jpg"
            alt={t("intro.portraitAlt")}
            width="144"
            height="144"
            quality="90"
            priority={true}
            className="h-16 w-16 shrink-0 rounded-sm object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
          />
          <div>
            <p className="font-display text-lg font-semibold">
              {t("intro.name")}
              <a
                href="#mestre"
                className="ml-0.5 text-accent-ink hover:underline"
                aria-label={t("intro.footnote")}
                title={t("intro.footnote")}
              >
                *
              </a>
            </p>
            <p className="mt-2 max-w-[58ch] text-lg leading-relaxed text-muted">
              {t("intro.subtitle").replace("{{YEARS}}", yearsOfExperience().toString())}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={t("intro.cvUrl")} download className="btn-primary">
            {t("intro.downloadCv")}
            <FiArrowDown aria-hidden="true" />
          </a>
          <a href="#contact" className="btn-secondary">
            {t("intro.contactCta")}
          </a>
        </div>
      </Reveal>

      <Reveal className="self-end lg:col-span-4" delay={0.15}>
        <h2 className="label text-muted">{t("intro.liveTitle")}</h2>
        <ul className="mt-3 border-b border-line">
          {live.map((project) => (
            <li key={project.title} className="border-t border-line">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 py-3"
              >
                <span>
                  <span className="font-display font-semibold group-hover:text-accent-ink">
                    {project.title}
                  </span>
                  <span className="block text-sm text-muted">{project.tagline}</span>
                </span>
                <FiArrowUpRight
                  aria-hidden="true"
                  className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
