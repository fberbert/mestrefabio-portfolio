import React from "react";

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      className="fixed top-0 left-0 bottom-0 w-full h-full z-[-100] opacity-40 dark:opacity-10 object-cover object-center"
    >
      <source src="/video/code.mp4" type="video/mp4" />
    </video>
  );
}
