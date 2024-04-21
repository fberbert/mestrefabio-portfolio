import React from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

export default function SocialMediaBar() {
  return (
    <motion.ul className="flex justify-center gap-4 mt-4">
      {[1, 2, 3, 4, 5].map(index => (
        <motion.li
          key={index}
          variants={fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          custom={index}
          transition={{ delay: 0.05 * index }}
          viewport={{ once: false }}
        >
          <LinkComponent index={index} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

function LinkComponent({ index }: { index: number }) {
  const links = [
    { href: "https://www.instagram.com/alexabolada/", icon: <FaInstagram />, title: "Instagram", aria: "Instagram" },
    { href: "https://wa.me/5522999780978", icon: <FaWhatsapp />, title: "Whatsapp", aria: "Whatsapp" },
    { href: "https://github.com/fberbert", icon: <FaGithub />, title: "GitHub", aria: "GitHub" },
    { href: "https://www.linkedin.com/in/fabio-linux/", icon: <FaLinkedin />, title: "LinkedIn", aria: "LinkedIn" },
    { href: "https://t.me/vivaolinux", icon: <FaTelegram />, title: "Telegram", aria: "Telegram" },
  ];

  const { href, icon, title, aria } = links[index - 1];

  return (
    <Link
      href={href}
      className="text-3xl text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white"
      title={title}
      aria-label={aria}
      target="_blank"
    >
      {icon}
    </Link>
  );
}

