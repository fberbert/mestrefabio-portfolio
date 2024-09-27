// project.tsx
"use client";

import { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";
import { useLang } from "@/context/language-context";
import VideoOfProject from "./video-of-project";

type ProjectData = {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: StaticImageData;
  video?: string;
  url?: string;
};

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  video,
  url,
}: ProjectData) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const { t } = useLang();

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-white max-w-[42rem] border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-100 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        {/* Container Flex */}
        <div
          className={`flex flex-col sm:flex-row ${video ? "sm:min-h-[33rem]" : ""}`}
        >
          {/* Conteúdo */}
          <div className="pt-4 pb-0 px-5 sm:pl-10 sm:pr-5 sm:pt-10 flex flex-col sm:w-1/2">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="mt-2 mb-4 leading-relaxed text-black dark:text-white/70">
              {description}
            </p>
            <ul className="flex flex-wrap mt-4 gap-2">
              {tags.map((tag: string, index: number) => (
                <li
                  className="bg-black/[0.9] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                  key={index}
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="flex flex-row text-center p-4 mt-4 mb-1 justify-center gap-3">
              <a
                href={url}
                className="text-sm font-semibold hover:no-underline dark:bg-blue-900 px-4 py-2 rounded-md dark:text-blue-100 dark:hover:bg-blue-800 transition text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("project.visitProject")}
              </a>
              {/* Botão "Expand Video" e vídeo para dispositivos móveis */}
              {video && (
                <div className="sm:hidden text-center">
                  <button
                    onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                    className="text-sm font-semibold hover:no-underline dark:bg-blue-900 px-4 py-2 rounded-md dark:text-blue-100 dark:hover:bg-blue-800 transition text-black"
                  >
                    {isVideoExpanded
                      ? t("project.hideVideo")
                      : t("project.expandVideo")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vídeo/Imagem */}
          <div className="sm:w-1/2 flex items-center justify-center sm:p-4">
            {video ? (
              <>
                {/* Vídeo para telas grandes */}
                <div className="hidden sm:block w-full">
                  <VideoOfProject src={video} />
                </div>
                {isVideoExpanded && (
                  <div className="mt-0">
                    <VideoOfProject src={video} />
                  </div>
                )}
              </>
            ) : imageUrl ? (
              // Renderizar imagem se não houver VideoComponent
              <div className="hidden sm:block w-full">
                <Image
                  src={imageUrl}
                  alt={`Imagem do projeto ${title}`}
                  quality={95}
                  className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl transition group-hover:scale-[1.04] group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
