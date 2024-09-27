// projects.tsx
"use client";

import React from "react";
import SectionHeading from "./section-heading";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import { useLang } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { StaticImageData } from "next/image";

type Project = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: StaticImageData;
  url: string;
};

export default function Projects() {
  const { t, lang } = useLang();
  const { ref } = useSectionInView("#projects", 0.2);

  // Access project data directly from translations
  const projectsData = translations[lang].projectsData;

  if (!projectsData) return null; // Safeguard for missing project data

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>{t("section.projects")}</SectionHeading>
      <div>
        {Object.values(projectsData).map((project: Project, index: number) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
