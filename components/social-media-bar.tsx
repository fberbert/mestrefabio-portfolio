import React from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa";

const links = [
  { href: "https://www.linkedin.com/in/fabio-linux/", icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://github.com/fberbert", icon: FaGithub, label: "GitHub" },
  { href: "https://wa.me/5522999780978", icon: FaWhatsapp, label: "WhatsApp" },
  { href: "https://t.me/vivaolinux", icon: FaTelegram, label: "Telegram" },
  { href: "https://www.instagram.com/alexabolada/", icon: FaInstagram, label: "Instagram" },
];

export default function SocialMediaBar() {
  return (
    <ul className="mt-4 border-b border-line">
      {links.map(({ href, icon: Icon, label }) => (
        <li key={label} className="border-t border-line">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3 font-display font-semibold transition-colors hover:text-accent-ink"
          >
            <Icon aria-hidden="true" className="text-lg text-muted" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
