import React from "react";
import Head from "next/head";

export default function MusicVideo() {
  return (
    <>
      <Head>
        <link rel="preload" href="/video/fabio-music-redux.mp4" as="video" type="video/mp4" />
      </Head>
      <div className="relative w-full h-[56.25vw] padding-top-[56.25%] sm:padding-top-0 sm:h-[403px] my-3">
        <video className="absolute top-0 left-0 w-full h-full sm:h-[auto]
          object-contain object-center" controls>
          <source src="/video/fabio-music-redux.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
