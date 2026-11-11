// projects.tsx
"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function Projects() {
  const { t, lang } = useLang();
  const { ref } = useSectionInView("#projects", 0.1);

  const projects = Object.values(translations[lang].projectsData).filter(
    (project) => project.visible,
  );
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <section
      ref={ref}
      id="projects"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading index="01">{t("section.projects")}</SectionHeading>
      {projects.map((project, index) => (
        <Project
          key={project.title}
          {...project}
          index={project.featured ? index : index - featuredCount}
          reversed={project.featured && index % 2 === 1}
        />
      ))}
    </section>
  );
}
