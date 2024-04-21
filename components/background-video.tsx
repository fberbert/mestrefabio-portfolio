import React from "react";

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      className="fixed top-0 left-0 bottom-0 w-full h-full z-[-100] opacity-40 object-cover object-center"
    >
      <source src="/code.mp4" type="video/mp4" />
    </video>
  );
}
