import React from "react";

type SectionHeadingProps = {
  index: string;
  children: React.ReactNode;
};

export default function SectionHeading({ index, children }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-baseline gap-4 border-t border-ink pt-4 sm:mb-16">
      <span className="label text-accent-ink" aria-hidden="true">
        {index}
      </span>
      <h2 className="font-display text-4xl font-extrabold tracking-tight [font-stretch:112%] sm:text-6xl">
        {children}
      </h2>
    </div>
  );
}
