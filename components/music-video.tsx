import React from "react";

export default function MusicVideo({ label }: { label: string }) {
  return (
    <video
      className="aspect-video w-full rounded-sm border border-line bg-[oklch(0.16_0.012_55)] object-contain"
      controls
      playsInline
      preload="metadata"
      aria-label={label}
    >
      <source src="/video/fabio-music-redux.mp4" type="video/mp4" />
    </video>
  );
}
