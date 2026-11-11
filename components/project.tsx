// project.tsx
"use client";

import clsx from "clsx";
import { FiArrowUpRight } from "react-icons/fi";
import { useLang } from "@/context/language-context";
import type { ProjectData } from "@/lib/translations";
import ProjectMedia from "./project-media";
import Reveal from "./reveal";

type ProjectProps = ProjectData & {
  index: number;
  reversed?: boolean;
};

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="label rounded-sm border border-line px-2 py-1 text-[0.7rem] text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function VisitLink({ url, title }: { url?: string; title: string }) {
  const { t } = useLang();
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link mt-6 inline-flex items-center gap-1 font-display text-sm font-semibold uppercase tracking-[0.08em]"
    >
      {t("project.visitProject")}
      <span className="sr-only">: {title}</span>
      <FiArrowUpRight aria-hidden="true" />
    </a>
  );
}

export default function Project({
  index,
  reversed = false,
  title,
  tagline,
  description,
  details,
  tags,
  imageUrl,
  video,
  url,
  featured,
}: ProjectProps) {
  const { t } = useLang();
  const number = String(index + 1).padStart(2, "0");

  if (featured) {
    return (
      <Reveal>
        <article className="grid gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <ProjectMedia
            title={title}
            imageUrl={imageUrl}
            video={video}
            sizes="(min-width: 1024px) 680px, 100vw"
            className={clsx("lg:col-span-7", reversed && "lg:order-2")}
          />
          <div className="lg:col-span-5">
            <p className="label text-accent-ink">
              {t("project.featured")}
            </p>
            <h3 className="mt-3 font-display text-4xl font-extrabold tracking-tight [font-stretch:110%] sm:text-5xl">
              {title}
            </h3>
            <p className="mt-5 text-lg leading-relaxed">{description}</p>
            {details && <p className="mt-4 leading-relaxed text-muted">{details}</p>}
            <Tags tags={tags} />
            <VisitLink url={url} title={title} />
          </div>
        </article>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <article className="grid gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-8">
        <p className="label hidden text-accent-ink md:col-span-1 md:block">{number}</p>
        <ProjectMedia
          title={title}
          imageUrl={imageUrl}
          video={video}
          sizes="(min-width: 768px) 360px, 100vw"
          className="md:col-span-4"
        />
        <div className="md:col-span-7">
          <h3 className="font-display text-2xl font-bold tracking-tight [font-stretch:108%] sm:text-3xl">
            {title}
          </h3>
          <p className="label mt-2 text-muted">
            <span className="text-accent-ink md:hidden">{number} · </span>
            {tagline}
          </p>
          <p className="mt-4 max-w-[65ch] leading-relaxed">{description}</p>
          <Tags tags={tags} />
          <VisitLink url={url} title={title} />
        </div>
      </article>
    </Reveal>
  );
}
