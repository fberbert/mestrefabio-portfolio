import React from "react";

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-sm">
        &copy; {new Date().getFullYear()} Fábio Berbert de Paula. All rights reserved.
      </small>
      <p className="text-sm sm:max-w-[50%] sm:mx-auto">
        <span className="font-semibold">About this website:</span> built with
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        Framer Motion, Typed.js, React Email & Resend, hosted on Amazon S3.
      </p>
    </footer>
  );
}
