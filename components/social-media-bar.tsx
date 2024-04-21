import React from "react";
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";

export default function SocialMediaBar() {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Link
        href="https://www.instagram.com/alexabolada/"
        className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
        title="Instagram"
        aria-label="Instagram"
        target="_blank"
      >
        <FaInstagram />
      </Link>

      <Link
        href="https://wa.me/5522999780978"
        className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
        title="Whatsapp"
        aria-label="Whatsapp"
        target="_blank"
      >
        <FaWhatsapp />
      </Link>

      <Link
        href="https://github.com/fberbert"
        className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
        title="GitHub"
        aria-label="GitHub"
        target="_blank"
      >
        <FaGithub />
      </Link>

      <Link
        href="https://www.linkedin.com/in/fabio-linux/"
        className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
        title="LinkedIn"
        aria-label="LinkedIn"
        target="_blank"
      >
        <FaLinkedin />
      </Link>

      <Link
        href="https://t.me/vivaolinux"
        className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
        title="Telegram"
        aria-label="Telegram"
        target="_blank"
      >
        <FaTelegram />
      </Link>
    </div>
  );
}
