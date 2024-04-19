import React from "react";
import { SiPhp } from "react-icons/si";
import { LuRouter } from "react-icons/lu";
import { FaLinux, FaCode, FaReact, FaAmazon } from "react-icons/fa";
import vivaolinuxImg from "@/public/img/projects/vivaolinux.jpg";
import automatizandoImg from "@/public/img/projects/automatizando.jpg";
import whereisluizaImg from "@/public/img/projects/whereisluiza.jpg";
import bitcoinconverterImg from "@/public/img/projects/bitcoinconverter.jpg";
import abrirgaragemImg from "@/public/img/projects/abrir-garagem.jpg";
import brinquedofalanteImg from "@/public/img/projects/brinquedo-falante.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "GNU/Linux System Administrator",
    location: "LinuxSolutions - Rio de Janeiro, Brazil",
    description:
      "I obtained my LPI certificate 6 months before graduating and got my first job immediately.",
    icon: React.createElement(FaLinux),
    date: "2000 - 2001",
  },
  {
    title: "Full-Stack Developer and DevOps",
    location: "ISM - Rio de Janeiro, Brazil",
    description:
      "I worked as a full-stack developer and DevOps for the advanced support sector of the internet provider ISM.",
    icon: React.createElement(LuRouter),
    date: "2001 - 2004",
  },
  {
    title: "Full-Stack Developer and DevOps",
    location: "Viva o Linux",
    description:
      "I acted as a self-contracted individual in this project, which involved everything from the creation and maintenance of the website to the maintenance of the servers.",
    icon: React.createElement(SiPhp),
    date: "2002 - 2022",
  },
  {
    title: "Freelancer developer",
    location: "",
    description:
      "I have worked as a freelancer developer for several companies and projects.",
    icon: React.createElement(FaCode),
    date: "2004 - 2022",
  },
  {
    title: "Full-Stack Developer and DevOps",
    location: "Automatizando.dev",
    description:
      "I am the founder and full-stack developer of Automatizando.dev, a hub for my innovations in home automation and AI.",
    icon: React.createElement(FaReact),
    date: "2022 - present",
  },
  {
    title: "Amazon AWS Architect",
    location: "Aivis - Nova Friburgo, Brazil",
    description:
      "I am currently working as an Amazon AWS architect for the company Aivis.",
    icon: React.createElement(FaAmazon),
    date: "2024 - present",
  },
] as const;

export const projectsData = [
  {
    title: "Viva o Linux",
    description:
      "I founded this renowned website in 2002. Within over a decade, it became the largest Linux community in Brazil, featuring forums, articles, and code sharing.",
    tags: ["PHP", "MySQL", "Linux", "Apache", "Nginx"],
    imageUrl: vivaolinuxImg,
    url: "https://www.vivaolinux.com.br",
  },
  {
    title: "Automatizando.dev",
    description:
      "A hub for my innovations in home automation and AI, where I serve as the full-stack developer. It features EAD, a forum, and articles.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "MySQL"],
    imageUrl: automatizandoImg,
    url: "https://automatizando.dev",
  },
  {
    title: "Where is Luiza",
    description:
      "A simple children's game for Android where the goal is to find where the character Luiza is.",
    tags: ["React Native", "JavaScript", "Android"],
    imageUrl: whereisluizaImg,
    url: "https://play.google.com/store/apps/details?id=com.whereisluiza",
  },
  {
    title: "Open Garage",
    description:
      "A web app that opens garage doors via a cloud-based API and IoT device, enabling remote access. It includes access logs, user management, and scheduling.",
    tags: ["React", "Node.js", "Tuya", "Home Assistant", "MySQL"],
    imageUrl: abrirgaragemImg,
    url: "https://automatizando.dev/garagem",
  },
  {
    title: "Talking Toy",
    description:
      "A talking plush toy enhanced with AI for interactive play, integrating a modified Alexa Echo Dot, portable battery, a web app for personality customization, and an API connecting to OpenAI's text engine.",
    tags: ["React", "Node.js", "OpenAI", "Alexa Skills Kit"],
    imageUrl: brinquedofalanteImg,
    url: "https://automatizando.dev/brinquedo",
  },
  {
    title: "Bitcoin Converter",
    description:
      "A simple Bitcoin converter that converts amounts of Bitcoin to USD and Brazilian Real, and vice versa.",
    tags: ["React Native", "JavaScript", "Android"],
    imageUrl: bitcoinconverterImg,
    url: "https://play.google.com/store/apps/details?id=com.bitcoinconverter2",
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "Linux",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Python",
  "Git",
  "Shell Scripting",
  "Amazon Web Services",
  "Artificial Intelligence",
  "OpenAI",
  "Tailwind",
  "Bootstrap",
  "Prisma",
  "SQL",
  "NoSQL",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Jest",
] as const;
