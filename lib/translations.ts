// translations.ts
/*
 * Usage:
 *
 * 1. Import some string from this file:
 *
 *   import { useLang } from "@/context/language-context";
 *   import { t } from "@/lib/translations";
 *
 *   const { t } = useLang();
 *   const translatedString = t("intro.typed"); // automatically detects the language
 *
 * 2. Import some object from this file:
 *
 *  import { useLang } from "@/context/language-context";
 *  import { translations } from "@/lib/translations";
 *
 *  const { lang } = useLang();
 *
 *  const header = translations[lang].header;
 *  const projectsData = translations[lang].projectsData;
 *
 *
 * */
import React from "react";
import vivaolinuxImg from "@/public/img/projects/vivaolinux.jpg";
import automatizandoImg from "@/public/img/projects/automatizando.jpg";
import whereisluizaImg from "@/public/img/projects/whereisluiza.jpg";
import bitcoinconverterImg from "@/public/img/projects/bitcoinconverter.jpg";
// import abrirgaragemImg from "@/public/img/projects/abrir-garagem.jpg";
import brinquedofalanteImg from "@/public/img/projects/brinquedo-falante.png";
import chatbotcasaImg from "@/public/img/projects/chatbot-casa.jpg";
import monetalImg from "@/public/img/projects/monetal.jpg";
import cursoAutomacaoImg from "@/public/img/projects/curso-automacao.jpg";
import { StaticImageData } from "next/image";
import { FaLinux, FaCode, FaReact, FaAmazon } from "react-icons/fa";
import { SiPhp } from "react-icons/si";
import { LuRouter } from "react-icons/lu";

// Definição dos tipos
export type Meta = {
  title: string;
  description: string;
};

export type Link = {
  name: string;
  hash: string;
};

export type Header = {
  links: Link[];
};

export type Menu = { [key: string]: string };

export type Section = { [key: string]: string };

export type Intro = { [key: string]: string };

export type About = {
  description: string;
  phrase1: string;
  stuff1: string;
  stuff2: string;
  stuff3: string;
  stuff4: string;
  stuff5: string;
  stuff6: string;
  stuff7: string;
  stuff8: string;
  phrase2: string;
  creationsTitle: string;
  vivaLinuxDesc: string;
  automatizandoDesc: string;
  talkingToyDesc: string;
  abrirGaragemDesc: string;
  alexaboladaDesc: string;
  cryptoDesc: string;
  openSourceDesc: string;
  position: string;
};

export type Project = {
  visitProject: string;
  expandVideo: string;
  hideVideo: string;
};

export type ProjectData = {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: StaticImageData;
  video?: string;
  url?: string;
  visible?: boolean;
};

export type ProjectsData = {
  [key: string]: ProjectData;
};

export type skills = string[];

export type Experience = {
  title: string;
  location: string;
  description: string;
  icon: JSX.Element;
  date: string;
};

export type ExperiencesData = Experience[];

export type Contact = {
  description: string;
  email: string;
  message: string;
  submit: string;
  footer: string;
};

export type Footer = {
  rights: string;
  about: string;
  github: string;
};

export type Translations = {
  [lang: string]: {
    meta: Meta;
    header: Header;
    menu: Menu;
    section: Section;
    intro: Intro;
    about: About;
    project: Project;
    projectsData: ProjectsData;
    skills: skills;
    experiencesData: ExperiencesData;
    contact: Contact;
    footer: Footer;
  };
};

export const translations: Translations = {
  en: {
    meta: {
      title: "Mestre Fábio | Personal Portfolio",
      description:
        "Fábio is a full-stack developer with {{EXP}} years of experience. Bring me your ideas and I'll bring them to life!",
    },
    header: {
      links: [
        { name: "Home", hash: "#home" },
        { name: "About", hash: "#about" },
        { name: "Projects", hash: "#projects" },
        { name: "Skills", hash: "#skills" },
        { name: "Experience", hash: "#experience" },
        { name: "Contact", hash: "#contact" },
      ],
    },
    menu: {
      home: "Home",
      about: "About",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
    },
    section: {
      about: "About me",
      projects: "Notable projects",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
    },
    intro: {
      typed:
        "Hello, I'm Fábio. ^1000\n I'm a full-stack developer with {{YEARS}} years of experience. ^1000\nBring me your ideas, and I'll bring them to life.",
    },
    about: {
      description:
        "Self-taught Full Stack Engineer. Engaged to React/Next.JS, JavaScript, Artificial Intelligence, Shell Scripting, Python, Cryptocurrencies, Home Assistant and last but not least GNU/Linux!",
      phrase1: "Stuff I can help you with:",
      stuff1: "Development of responsive, dynamic and modern websites.",
      stuff2:
        "Installation and configuration of Linux servers locally or in the cloud, such as AWS, Google Cloud and Azure.",
      stuff3: "Development of chatbots with AI.",
      stuff4: "Database management and optimization.",
      stuff5: "Training AI models specific to your needs.",
      stuff6: "Development of Android applications.",
      stuff7: "Shell scripts for task automation on servers.",
      stuff8: "Create home automation solutions and integrate with any system.",
      phrase2: "I created the music video below using AI:",
      creationsTitle: "Key Creations and Contributions:",
      vivaLinuxDesc:
        "Founder of Viva o Linux - A renowned website in the Linux community.",
      automatizandoDesc:
        "Automatizando.dev - A hub for my innovations in home automation and AI.",
      talkingToyDesc:
        "Inventor of Talking Toy - An interactive toy integrating Alexa skills and AI.",
      abrirGaragemDesc:
        "Developer of Abrir Garagem - A smart solution for garage door automation.",
      alexaboladaDesc:
        "Instagram Content Creator: @alexabolada - Sharing insights and developments in AI and home automation.",
      cryptoDesc:
        "Expert in Cryptocurrency: Active in the field since 2016, solid knowledge in blockchain and exchange APIs.",
      openSourceDesc:
        "Free Software Community Contributor: Since 2002, contributing to various open-source projects.",
      position:
        "I am currently open for a full-time position as a software developer / DevOps engineer.",
    },
    project: {
      visitProject: "Visit project",
      expandVideo: "Expand video",
      hideVideo: "Hide video",
    },
    projectsData: {
      vivaolinux: {
        title: "Viva o Linux",
        description:
          "I founded this renowned website in 2002. Within over a decade, it became the largest Linux community in Brazil, featuring forums, articles, and code sharing.",
        tags: ["PHP", "MySQL", "Linux", "Apache", "Nginx"],
        imageUrl: vivaolinuxImg,
        url: "https://www.vivaolinux.com.br",
        visible: true,
      },
      automatizando: {
        title: "Automatizando.dev",
        description:
          "A hub for my innovations in home automation and AI, where I serve as the full-stack developer. It features EAD, a forum, and articles.",
        tags: ["React", "TypeScript", "Next.js", "Tailwind", "MySQL"],
        imageUrl: automatizandoImg,
        url: "https://automatizando.dev",
        visible: true,
      },
      cursoautomacao: {
        title: "Home Automation Course",
        description:
          "An online course on home automation, covering the IoT, Home Assistant, Node-RED and automations with IA.",
        tags: ["Home Assistant", "IoT", "Artificial Intelligence"],
        url: "https://automatizando.dev/cursos",
        imageUrl: cursoAutomacaoImg,
        visible: true,
      },
      abrirgaragem: {
        title: "Open Garage",
        description:
          "A web app that opens garage doors via a cloud-based API and IoT device, enabling remote access. It includes access logs, user management, and scheduling.",
        tags: ["React", "Node.js", "Tuya", "Home Assistant", "MySQL"],
        video: "/video/abrir-garagem.mp4",
        url: "https://automatizando.dev/garagem",
        visible: true,
      },
      brinquedofalante: {
        title: "Talking Toy",
        description:
          "A talking plush toy enhanced with AI for interactive play, integrating a modified Alexa Echo Dot, portable battery, a web app for personality customization, and an API connecting to OpenAI's text engine.",
        tags: ["React", "Node.js", "OpenAI", "Alexa Skills Kit"],
        imageUrl: brinquedofalanteImg,
        video: "/video/brinquedo-falante.mp4",
        url: "https://automatizando.dev/brinquedo",
        visible: true,
      },
      chatbotcasa: {
        title: "Chatbot with my house",
        description:
          "A chatbot that controls the house using natural language, with integration with Home Assistant and OpenAI. You talk to the chatbot, and it decides which devices to turn on or off to improve your day.",
        tags: ["Home Assistant", "OpenAI", "Node.js", "ChatGPT", "Twilio"],
        imageUrl: chatbotcasaImg,
        video: "/video/chatbot-casa.mp4",
        url: "https://www.instagram.com/p/C3X1r_yAx23/",
        visible: true,
      },
      monetal: {
        title: "Monetal",
        description:
          "A corporate website in Python/Django for a cryptocurrency consulting company.",
        tags: ["Python", "Django", "Amazon AWS", "Bitcoin"],
        imageUrl: monetalImg,
        url: "https://monetal.com.br",
        visible: true,
      },
      whereisluiza: {
        title: "Where is Luiza",
        description:
          "A simple children's game for Android where the goal is to find where the character Luiza is.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: whereisluizaImg,
        url: "https://play.google.com/store/apps/details?id=com.whereisluiza",
        visible: false,
      },
      bitcoinconverter: {
        title: "Bitcoin Converter",
        description:
          "A simple Bitcoin converter that converts amounts of Bitcoin to USD and Brazilian Real, and vice versa.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: bitcoinconverterImg,
        url: "https://play.google.com/store/apps/details?id=com.bitcoinconverter2",
        visible: false,
      },
    },
    skills: [
      "HTML",
      "CSS",
      "Linux",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Android",
      "React Native",
      "Python",
      "Django",
      "Git",
      "Shell Scripting",
      "Amazon Web Services",
      "Artificial Intelligence",
      "OpenAI",
      "ChatGPT",
      "AI Prompt",
      "Tailwind",
      "Bootstrap",
      "Prisma",
      "SQL",
      "NoSQL",
      "MongoDB",
      "MySQL",
      "PostgreSQL",
      "Jest",
      "IoT",
      "Home Assistant",
      "Scrum",
    ],
    experiencesData: [
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
        title: "Freelancer Developer",
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
    ],
    contact: {
      description: `Please contact me directly at <a class="underline" href="mailto:fabio@mestrefabio.com">fabio@mestrefabio.com</a> or through this form.`,
      email: "Your email",
      message: "Your message",
      submit: "Send message",
      footer: "You can also reach me on social media:",
    },
    footer: {
      rights: "© {{YEAR}} Fábio Berbert de Paula. All rights reserved.",
      about: `About this website: built with React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer Motion, Typed.js, React Email & Resend, hosted on Amazon S3.`, 
      github: "You can download the source code for this website on my",
    },
  },
  "pt-BR": {
    meta: {
      title: "Mestre Fábio | Portfólio Pessoal",
      description:
        "Fábio é um desenvolvedor full-stack com {{EXP}} anos de experiência. Traga-me suas ideias e eu as trarei à vida!",
    },
    header: {
      links: [
        { name: "Início", hash: "#home" },
        { name: "Sobre", hash: "#about" },
        { name: "Projetos", hash: "#projects" },
        { name: "Habilidades", hash: "#skills" },
        { name: "Experiência", hash: "#experience" },
        { name: "Contato", hash: "#contact" },
      ],
    },
    menu: {
      home: "Início",
      about: "Sobre",
      projects: "Projetos",
      skills: "Habilidades",
      experience: "Experiência",
      contact: "Contato",
    },
    section: {
      about: "Sobre mim",
      projects: "Principais Projetos",
      skills: "Habilidades",
      experience: "Experiência",
      contact: "Contato",
    },
    intro: {
      typed:
        "Olá, meu nome é Fábio. ^1000\n Sou um Desenvolvedor Full-Stack com {{YEARS}} anos de experiência. ^1000\nEstou pronto para transformar suas ideias em realidade.",
    },
    about: {
      description:
        "Desenvolvedor Full Stack, auto-didata, engajado com React/Next.JS, JavaScript/TypeScript, Inteligência Artificial, Shell Scripting, Python e faixa preta em Linux!",
      phrase1: "Coisas que posso te ajudar:",
      stuff1: "Desenvolvimento de websites responsivos, dinâmicos e modernos.",
      stuff2:
        "Instalação e configuração de servidores Linux localmente ou na nuvem, como AWS, Google Cloud e Azure.",
      stuff3: "Desenvolvimento de chatbots com IA.",
      stuff4: "Gerenciamento e otimização de banco de dados.",
      stuff5:
        "Treinamento de modelos de IA específicos para suas necessidades.",
      stuff6: "Desenvolvimento de aplicativos Android.",
      stuff7: "Scripts em shell para automação de tarefas em servidores.",
      stuff8:
        "Criar soluções de automação residencial/comercial e integrar com qualquer sistema.",
      phrase2: "Eu criei a música abaixo usando IA:",
      creationsTitle: "Principais Criações e Contribuições:",
      vivaLinuxDesc:
        "Fundador do Viva o Linux - Famoso site da comunidade Linux.",
      automatizandoDesc:
        "Automatizando.dev - Um hub para minhas inovações em automação residencial e IA.",
      talkingToyDesc:
        "Inventor do Brinquedo Falante - Um brinquedo interativo que usa IA para conversar.",
      abrirGaragemDesc:
        "Desenvolvedor do Abrir Garagem - Uma solução inteligente para automação de portas de garagem.",
      alexaboladaDesc:
        "Criador de conteúdo no Instagram: @alexabolada - publicando minhas inventividades em automação residencial.",
      cryptoDesc:
        "Especialista em Criptomoedas: Estudioso desde 2016, sólidos conhecimentos em blockchain e APIs de exchanges.",
      openSourceDesc:
        "Contribuidor para a Comunidade de Software Livre: Desde 2002, contribuindo para vários projetos de código aberto.",
      position:
        "Estou atualmente aberto para oportunidades como desenvolvedor de software / engenheiro de DevOps.",
    },
    project: {
      visitProject: "Ver projeto",
      expandVideo: "Expandir vídeo",
      hideVideo: "Ocultar vídeo",
    },
    projectsData: {
      vivaolinux: {
        title: "Viva o Linux",
        description:
          "Eu fundei este renomado site em 2002. Em mais de uma década, tornou-se a maior comunidade Linux no Brasil, apresentando fóruns, artigos e compartilhamento de código.",
        tags: ["PHP", "MySQL", "Linux", "Apache", "Nginx"],
        imageUrl: vivaolinuxImg,
        url: "https://www.vivaolinux.com.br",
        visible: true,
      },
      automatizando: {
        title: "Automatizando.dev",
        description:
          "Um hub para minhas inovações em automação residencial e IA, onde atuo como desenvolvedor full-stack. Inclui EAD, um fórum e artigos.",
        tags: ["React", "TypeScript", "Next.js", "Tailwind", "MySQL"],
        imageUrl: automatizandoImg,
        url: "https://automatizando.dev",
        visible: true,
      },
      cursoautomacao: {
        title: "Curso de Automação Residencial",
        description:
          "Um curso online sobre automação residencial, abordando IoT, Home Assistant, Node-RED e automações com IA.",
        tags: ["Home Assistant", "IoT", "Inteligência Artificial"],
        url: "https://automatizando.dev/cursos",
        imageUrl: cursoAutomacaoImg,
        visible: true,
      },
      abrirgaragem: {
        title: "Abrir Garagem",
        description:
          "Um aplicativo web que abre portas de garagem por meio de uma API baseada em nuvem e um dispositivo IoT, permitindo acesso remoto. Inclui registros de acesso, gerenciamento de usuários e agendamento.",
        tags: ["React", "Node.js", "Tuya", "Home Assistant", "MySQL"],
        video: "/video/abrir-garagem.mp4",
        url: "https://automatizando.dev/garagem",
        visible: true,
      },
      brinquedofalante: {
        title: "Brinquedo Falante",
        description:
          "Um brinquedo de pelúcia falante aprimorado com IA para brincadeiras interativas, integrando uma Alexa Echo Dot modificada, bateria portátil, um aplicativo web para personalização de personalidade e uma API conectando à engine da OpenAI.",
        tags: ["React", "Node.js", "OpenAI", "Alexa Skills Kit"],
        imageUrl: brinquedofalanteImg,
        video: "/video/brinquedo-falante.mp4",
        url: "https://automatizando.dev/brinquedo",
        visible: true,
      },
      chatbotcasa: {
        title: "Chatbot com minha casa",
        description:
          "Um chatbot que controla a casa usando linguagem natural, com integração ao Home Assistant e OpenAI. Você conversa com o chatbot, e ele decide quais dispositivos ligar ou desligar para melhorar seu dia.",
        tags: ["Home Assistant", "OpenAI", "Node.js", "ChatGPT", "Twilio"],
        imageUrl: chatbotcasaImg,
        video: "/video/chatbot-casa.mp4",
        url: "https://www.instagram.com/p/C3X1r_yAx23/",
        visible: true,
      },
      monetal: {
        title: "Monetal",
        description:
          "Um site corporativo em Python/Django para uma empresa de consultoria em criptomoedas.",
        tags: ["Python", "Django", "Amazon AWS", "Bitcoin"],
        imageUrl: monetalImg,
        url: "https://monetal.com.br",
        visible: true,
      },
      whereisluiza: {
        title: "Onde está Luiza",
        description:
          "Um jogo infantil simples para Android, onde o objetivo é encontrar onde a personagem Luiza está.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: whereisluizaImg,
        url: "https://play.google.com/store/apps/details?id=com.whereisluiza",
        visible: false,
      },
      bitcoinconverter: {
        title: "Conversor de Bitcoin",
        description:
          "Um conversor de Bitcoin simples que converte quantidades de Bitcoin para USD e Real brasileiro, e vice-versa.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: bitcoinconverterImg,
        url: "https://play.google.com/store/apps/details?id=com.bitcoinconverter2",
        visible: false,
      },
    },
    skills: [
      "HTML",
      "CSS",
      "Linux",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Android",
      "React Native",
      "Python",
      "Django",
      "Git",
      "Shell Script",
      "Amazon Web Services",
      "Inteligência Artificial",
      "OpenAI",
      "ChatGPT",
      "AI Prompt",
      "Tailwind",
      "Bootstrap",
      "Prisma",
      "SQL",
      "NoSQL",
      "MongoDB",
      "MySQL",
      "PostgreSQL",
      "Jest",
      "IoT",
      "Home Assistant",
      "Scrum",
    ],
    experiencesData: [
      {
        title: "Administrador de Sistemas GNU/Linux",
        location: "LinuxSolutions - Rio de Janeiro, Brasil",
        description:
          "Obtive meu certificado LPI 6 meses antes de me formar e consegui meu primeiro emprego imediatamente.",
        icon: React.createElement(FaLinux),
        date: "2000 - 2001",
      },
      {
        title: "Desenvolvedor Full-Stack e DevOps",
        location: "ISM - Rio de Janeiro, Brasil",
        description:
          "Trabalhei como desenvolvedor full-stack e DevOps para o setor de suporte avançado do provedor de internet ISM.",
        icon: React.createElement(LuRouter),
        date: "2001 - 2004",
      },
      {
        title: "Desenvolvedor Full-Stack e DevOps",
        location: "Viva o Linux",
        description:
          "Atuei como pessoa jurídica neste projeto, que envolveu desde a criação e manutenção do site até a manutenção dos servidores.",
        icon: React.createElement(SiPhp),
        date: "2002 - 2022",
      },
      {
        title: "Desenvolvedor Freelancer",
        location: "",
        description:
          "Trabalhei como desenvolvedor freelancer para diversas empresas e projetos.",
        icon: React.createElement(FaCode),
        date: "2004 - 2022",
      },
      {
        title: "Desenvolvedor Full-Stack e DevOps",
        location: "Automatizando.dev",
        description:
          "Sou o fundador e desenvolvedor full-stack da Automatizando.dev, um hub para minhas inovações em automação residencial e IA.",
        icon: React.createElement(FaReact),
        date: "2022 - presente",
      },
      {
        title: "Arquiteto Amazon AWS",
        location: "Aivis - Nova Friburgo, Brasil",
        description:
          "Atualmente trabalho como arquiteto Amazon AWS para a empresa Aivis.",
        icon: React.createElement(FaAmazon),
        date: "2024 - presente",
      },
    ],
    contact: {
      description: `Entre em contato diretamente comigo pelo e-mail <a class="underline" href="mailto:fabio@mestrefabio.com">fabio@mestrefabio.com</a> ou através do formulário abaixo.`,
      email: "Seu email",
      message: "Sua mensagem",
      submit: "Enviar mensagem",
      footer: "Você também pode me encontrar nas redes sociais:",
    },
    footer: {
      rights: "© {{YEAR}} Fábio Berbert de Paula. Todos os direitos reservados.",
      about: `Sobre este site: construído com React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer Motion, Typed.js, React Email & Resend, hospedado na Amazon S3.`,
      github: "Você pode baixar o código-fonte deste site no meu",
    },
  },
};
