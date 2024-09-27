import React from "react";
import Head from "next/head";

export default function VideoOfProject({src}: {src: string}) {
  return (
    <>
      <Head>
        <link rel="preload" href={src} as="video" type="video/mp4" />
      </Head>
      <div className="w-full padding-top-[56.25%] sm:padding-top-0 my-3">
        <video className="w-[250px] sm:h-[auto] rounded-3xl object-contain object-center" controls>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
