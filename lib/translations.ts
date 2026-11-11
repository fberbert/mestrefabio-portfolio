// translations.ts
/*
 * Usage:
 *
 * 1. Import some string from this file:
 *
 *   import { useLang } from "@/context/language-context";
 *
 *   const { t } = useLang();
 *   const translatedString = t("intro.title"); // automatically detects the language
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
 * */
import vivaolinuxImg from "@/public/img/projects/vivaolinux.jpg";
import automatizandoImg from "@/public/img/projects/automatizando.jpg";
import whereisluizaImg from "@/public/img/projects/whereisluiza.jpg";
import bitcoinconverterImg from "@/public/img/projects/bitcoinconverter.jpg";
import brinquedofalanteImg from "@/public/img/projects/brinquedo-falante.png";
import chatbotcasaImg from "@/public/img/projects/chatbot-casa.jpg";
import monetalImg from "@/public/img/projects/monetal.jpg";
import cursoAutomacaoImg from "@/public/img/projects/curso-automacao.jpg";
import tonaquadraImg from "@/public/img/projects/tonaquadra.jpg";
import rabugentoImg from "@/public/img/projects/rabugento.jpg";
import friendsfightersImg from "@/public/img/projects/friendsfighters.jpg";
import nbabetagentImg from "@/public/img/projects/nbabetagent.jpg";
import { StaticImageData } from "next/image";

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
  storyTitle: string;
  story: string;
  description: string;
  helpTitle: string;
  help1: string;
  help2: string;
  help3: string;
  help4: string;
  offTitle: string;
  musicCaption: string;
  alexaboladaDesc: string;
  cryptoDesc: string;
  openSourceDesc: string;
  position: string;
};

export type Project = {
  visitProject: string;
  featured: string;
};

export type ProjectData = {
  title: string;
  // Short "what it is" line used in the hero's live products list.
  tagline: string;
  description: string;
  // Extra paragraph shown only on featured projects.
  details?: string;
  tags: string[];
  imageUrl?: StaticImageData;
  video?: string;
  url?: string;
  featured?: boolean;
  visible?: boolean;
};

export type ProjectsData = {
  [key: string]: ProjectData;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type Experience = {
  title: string;
  location: string;
  description: string;
  date: string;
};

export type ExperiencesData = Experience[];

export type Contact = {
  description: string;
  guidance: string;
  email: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  validation: string;
  rate_limit: string;
  delivery: string;
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
    skills: SkillGroup[];
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
        "Fábio is a senior full-stack developer focused on applied AI, Linux and AWS, with {{EXP}} years of experience. Bring me your ideas and I'll bring them to life!",
    },
    header: {
      links: [
        { name: "Home", hash: "#home" },
        { name: "Projects", hash: "#projects" },
        { name: "About", hash: "#about" },
        { name: "Experience", hash: "#experience" },
        { name: "Skills", hash: "#skills" },
        { name: "Contact", hash: "#contact" },
      ],
    },
    menu: {
      skip: "Skip to content",
      open: "Menu",
      close: "Close",
      langShort: "PT",
      langLabel: "Mudar para português",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme",
      backToTop: "Back to top",
    },
    section: {
      about: "About",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      contact: "Contact",
    },
    intro: {
      name: "Fábio Berbert de Paula, a.k.a. Mestre Fábio",
      footnote: "Why Mestre?",
      title: "I build AI products, from the database to the deploy.",
      subtitle:
        "Senior software engineer: full stack, Linux and AWS. {{YEARS}} years of experience, working remotely from Rio das Ostras, Brazil.",
      downloadCv: "Download resume",
      cvUrl: "/cv/Fabio_Berbert_Resume_EN.pdf",
      contactCta: "Get in touch",
      liveTitle: "Live right now",
      portraitAlt: "Portrait of Fábio Berbert de Paula",
    },
    about: {
      storyTitle: "Why \"Mestre\"?",
      story:
        "The nickname comes from one of my first jobs. I showed up, solved a string of problems that had been stuck for months, and someone started calling me Mestre (Portuguese for master). I embraced the character, and the name stuck.",
      description:
        "Full stack developer with {{YEARS}} years of experience in software development, Linux server administration and cloud infrastructure. My recent work centers on generative AI products: tool-using agents, WhatsApp assistants, CRM automation and data analysis. I own products end to end, from database modeling to deployment, with CI/CD, automated tests and observability.",
      helpTitle: "How I can help",
      help1:
        "AI agents that query your data and act inside your systems (function calling and MCP).",
      help2:
        "WhatsApp service with AI that books, answers, reminds and records, by text or voice.",
      help3:
        "Custom web systems and CRMs, integrated with the tools your company already uses.",
      help4:
        "Stable Linux and AWS infrastructure with automated deploys, tests and monitoring.",
      offTitle: "After hours",
      musicCaption: "I made this song and its music video with AI.",
      alexaboladaDesc:
        "Instagram @alexabolada, where I share experiments in AI and home automation.",
      cryptoDesc:
        "Cryptocurrencies since 2016, with solid knowledge of blockchain and exchange APIs.",
      openSourceDesc:
        "Free software contributor since 2002.",
      position:
        "Open to remote positions as a Senior Software Engineer, Full Stack or Applied AI, and to project work.",
    },
    project: {
      visitProject: "Visit project",
      featured: "Featured",
    },
    projectsData: {
      vivaolinux: {
        title: "Viva o Linux",
        tagline: "Linux community since 2002",
        description:
          "The Portuguese-language Linux and open source community I founded in 2002, online for 24 years, with articles, tips, scripts, forum and news written by its users.",
        details:
          "I still run it end to end: development, servers, SEO and moderation. I am modernizing the codebase to PHP 8.3 and Twig, with Meilisearch search, XSS and CSRF protection and an AI-assisted content pipeline. My own contributions: 149 articles, 530 tips, 67 scripts and nearly 2,000 forum posts.",
        tags: ["PHP", "MariaDB", "Twig", "Meilisearch", "Nginx", "Linux"],
        imageUrl: vivaolinuxImg,
        url: "https://www.vivaolinux.com.br",
        featured: true,
        visible: true,
      },
      friendsfighters: {
        title: "Friends Fighters",
        tagline: "Android fighting game",
        description:
          "A 2D fighting game for Android that turns photos of your friends into paper puppet fighters. Snap a photo, tap the face, and your friend is ready to brawl.",
        details:
          "Background removal runs on the phone itself (MediaPipe), with recorded voices for hits and knockouts, special moves, CPU opponents, three languages and a one-time purchase validated by its own back end. Published on Google Play.",
        tags: ["Godot", "GDScript", "MediaPipe", "Fastify", "PostgreSQL"],
        imageUrl: friendsfightersImg,
        video: "/video/friends-fighters-trailer.mp4",
        url: "https://play.google.com/store/apps/details?id=io.github.fberbert.friendsfighters",
        featured: true,
        visible: true,
      },
      tonaquadra: {
        title: "Tô na Quadra",
        tagline: "SaaS for sports arenas",
        description:
          "SaaS for sports arenas to run rankings, tournaments, challenges and casual Plays in beach tennis, tennis, padel, pickleball, footvolley and volleyball. An AI assistant on WhatsApp checks games and standings, schedules matches and records results. Used by arenas in Nova Friburgo, Rio das Ostras and Búzios (RJ).",
        tags: ["Node.js", "Next.js", "OpenAI", "WhatsApp", "Stripe", "PWA"],
        imageUrl: tonaquadraImg,
        url: "https://tonaquadra.com",
        visible: true,
      },
      monetal: {
        title: "Monetal Secretária IA",
        tagline: "AI receptionist for clinics",
        description:
          "Virtual receptionist on WhatsApp for clinics: per-professional schedules, booking, rescheduling and cancellation in natural language by text or voice, appointment confirmations, feedback and return campaigns. Next.js console in PT, EN and ES, with human handoff and Stripe plans.",
        tags: ["Node.js", "Next.js", "OpenAI", "Gemini", "ElevenLabs", "Stripe"],
        imageUrl: monetalImg,
        url: "https://monetal.com.br",
        visible: true,
      },
      rabugento: {
        title: "Rabugento Assistant",
        tagline: "personal assistant on WhatsApp",
        description:
          "Personal assistant on WhatsApp for finances (including bill reading), reminders, shopping lists, tasks, a document vault and lookups, by text or voice, with a synced web dashboard.",
        tags: ["Node.js", "Express", "MySQL", "OpenAI", "WhatsApp", "React"],
        imageUrl: rabugentoImg,
        url: "https://rabugento.app",
        visible: true,
      },
      nbabetagent: {
        title: "NBA Bet Agent",
        tagline: "NBA analysis agent",
        description:
          "Agent that pulls the daily NBA slate and combines standings, injuries, rest, travel and live odds to project outcomes, with Shin de-vigging, fractional Kelly staking, CLV tracking and automatic bet settlement. Next.js dashboard in three languages.",
        tags: ["Python", "FastAPI", "PostgreSQL", "pandas", "OpenAI", "Next.js"],
        imageUrl: nbabetagentImg,
        url: "https://nbabetagent.com",
        visible: true,
      },
      automatizando: {
        title: "Automatizando.dev",
        tagline: "home automation and AI",
        description:
          "Content and product platform for home automation and AI: articles, forum, paid courses, videos, function-calling assistants, WhatsApp chatbots, payments and remote gate control.",
        tags: ["Node.js", "Express", "Next.js", "MariaDB", "Redis", "OpenAI"],
        imageUrl: automatizandoImg,
        url: "https://automatizando.dev",
        visible: true,
      },
      brinquedofalante: {
        title: "Talking Toy",
        tagline: "a plush toy that talks",
        description:
          "A plush toy that talks with children: a battery-powered Echo Dot inside the toy, driven by a custom Alexa skill connected to a Node.js back end with generative AI. Parents set the name, personality, voice and interests through a web dashboard.",
        tags: ["React", "Node.js", "OpenAI", "Alexa Skills Kit"],
        imageUrl: brinquedofalanteImg,
        video: "/video/brinquedo-falante.mp4",
        url: "https://automatizando.dev/brinquedo",
        visible: true,
      },
      cursoautomacao: {
        title: "Home Automation Course",
        tagline: "online course",
        description:
          "An online course on home automation, covering the IoT, Home Assistant, Node-RED and automations with IA.",
        tags: ["Home Assistant", "IoT", "Artificial Intelligence"],
        url: "https://automatizando.dev/cursos",
        imageUrl: cursoAutomacaoImg,
        visible: false,
      },
      abrirgaragem: {
        title: "Open Garage",
        tagline: "garage door automation",
        description:
          "A web app that opens garage doors via a cloud-based API and IoT device, enabling remote access. It includes access logs, user management, and scheduling.",
        tags: ["React", "Node.js", "Tuya", "Home Assistant", "MySQL"],
        video: "/video/abrir-garagem.mp4",
        url: "https://automatizando.dev/garagem",
        visible: false,
      },
      chatbotcasa: {
        title: "Chatbot with my house",
        tagline: "home automation chatbot",
        description:
          "A chatbot that controls the house using natural language, with integration with Home Assistant and OpenAI. You talk to the chatbot, and it decides which devices to turn on or off to improve your day.",
        tags: ["Home Assistant", "OpenAI", "Node.js", "ChatGPT", "Twilio"],
        imageUrl: chatbotcasaImg,
        video: "/video/chatbot-casa.mp4",
        url: "https://www.instagram.com/p/C3X1r_yAx23/",
        visible: false,
      },
      whereisluiza: {
        title: "Where is Luiza",
        tagline: "children's game",
        description:
          "A simple children's game for Android where the goal is to find where the character Luiza is.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: whereisluizaImg,
        url: "https://play.google.com/store/apps/details?id=com.whereisluiza",
        visible: false,
      },
      bitcoinconverter: {
        title: "Bitcoin Converter",
        tagline: "Bitcoin converter",
        description:
          "A simple Bitcoin converter that converts amounts of Bitcoin to USD and Brazilian Real, and vice versa.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: bitcoinconverterImg,
        url: "https://play.google.com/store/apps/details?id=com.bitcoinconverter2",
        visible: false,
      },
    },
    skills: [
      {
        title: "Build",
        items: [
          "TypeScript",
          "JavaScript",
          "Python",
          "PHP",
          "SQL",
          "Shell Script",
          "GDScript",
          "Node.js",
          "Express",
          "Fastify",
          "FastAPI",
          "Django",
          "EspoCRM",
          "REST APIs",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Radix UI",
          "Framer Motion",
          "PWA",
        ],
      },
      {
        title: "Applied AI",
        items: [
          "OpenAI API",
          "Function calling",
          "MCP",
          "LangChain",
          "LangGraph",
          "Google Gemini",
          "ElevenLabs",
          "Prompt engineering",
        ],
      },
      {
        title: "Operate",
        items: [
          "Linux",
          "AWS",
          "Google Cloud",
          "Azure",
          "Docker",
          "Nginx",
          "GitHub Actions",
          "GitLab CI",
          "Grafana/Loki",
          "PostgreSQL",
          "MySQL/MariaDB",
          "SQL Server",
          "Amazon Redshift",
          "Redis",
          "Meilisearch",
          "MongoDB",
          "Jest",
          "Playwright",
          "pytest",
        ],
      },
    ],
    experiencesData: [
      {
        title: "AI Software Developer",
        location: "Wine · Remote",
        description:
          "Built Wine Communication Agent, an internal CRM platform that uses an LLM to generate personalized push and email messages. Created an MCP server over Amazon Redshift, CleverTap and PostgreSQL, a FastAPI back end with about 120 endpoints, async workers and a Next.js dashboard, with Grafana and Loki observability.",
        date: "Sep 2025 - Oct 2026",
      },
      {
        title: "Full Stack Developer",
        location: "Altarede · Nova Friburgo, Brazil (hybrid)",
        description:
          "Merged five separate systems into a single CRM (Hub Altarede) built on EspoCRM for a telecom provider, with 33 custom modules, integrations with OZMap, PRTG, IXC and SQL Server, real-time router monitoring and continuous deployment with GitLab CI.",
        date: "Nov 2024 - Oct 2026",
      },
      {
        title: "AWS Engineer",
        location: "Aivis Tecnologia · Remote",
        description:
          "Responsible for the architecture, configuration and maintenance of the Aivis system services and servers on Amazon AWS.",
        date: "Jun 2024 - Present",
      },
      {
        title: "Full Stack Engineer",
        location: "Automatizando.dev · Rio das Ostras, Brazil",
        description:
          "Own platform for content, courses and AI and home automation products.",
        date: "Aug 2023 - Oct 2024",
      },
      {
        title: "Founder and Full Stack Developer",
        location: "Viva o Linux",
        description:
          "Created and run the portal since 2002: development, servers, SEO and moderation. Leading the modernization of the legacy codebase to PHP 8.3, Twig and service/repository layers, with Meilisearch search, XSS and CSRF protection and an AI-assisted content pipeline.",
        date: "Nov 2002 - Present",
      },
      {
        title: "Back-end Developer and DevOps",
        location: "ISM (Internet provider) · Rio de Janeiro, Brazil",
        description:
          "Web systems development and Linux server administration for the provider.",
        date: "Jan 2001 - Dec 2004",
      },
      {
        title: "GNU/Linux Sysadmin",
        location: "Linux Solutions · Rio de Janeiro, Brazil",
        description:
          "Linux server administration and network services (web, email, DNS, firewall). I obtained my LPI certificate 6 months before graduating and got this job right away.",
        date: "Jun 2000 - May 2001",
      },
    ],
    contact: {
      description: `Write to <a class="link" href="mailto:fabio@mestrefabio.com">fabio@mestrefabio.com</a> or use the form.`,
      guidance:
        "Tell me what you need, the deadline and where the system runs today. I reply personally.",
      email: "Your email",
      message: "Your message",
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent. Thank you! I will reply to the email you provided.",
      validation: "Enter a valid email and a message of up to 5,000 characters.",
      rate_limit: "Too many attempts. Please try again in 10 minutes.",
      delivery: "Unable to send your message. Please try again later.",
      footer: "Elsewhere",
    },
    footer: {
      rights: "© {{YEAR}} Fábio Berbert de Paula. All rights reserved.",
      about: `About this website: built with React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer Motion, React Email & Resend.`,
      github: "Source code on",
    },
  },
  "pt-BR": {
    meta: {
      title: "Mestre Fábio | Portfólio Pessoal",
      description:
        "Fábio é um desenvolvedor full-stack sênior focado em IA aplicada, Linux e AWS, com {{EXP}} anos de experiência. Traga-me suas ideias e eu as trarei à vida!",
    },
    header: {
      links: [
        { name: "Início", hash: "#home" },
        { name: "Projetos", hash: "#projects" },
        { name: "Sobre", hash: "#about" },
        { name: "Experiência", hash: "#experience" },
        { name: "Habilidades", hash: "#skills" },
        { name: "Contato", hash: "#contact" },
      ],
    },
    menu: {
      skip: "Pular para o conteúdo",
      open: "Menu",
      close: "Fechar",
      langShort: "EN",
      langLabel: "Switch to English",
      themeToDark: "Mudar para o tema escuro",
      themeToLight: "Mudar para o tema claro",
      backToTop: "Voltar ao topo",
    },
    section: {
      about: "Sobre",
      projects: "Projetos",
      skills: "Habilidades",
      experience: "Experiência",
      contact: "Contato",
    },
    intro: {
      name: "Fábio Berbert de Paula, o Mestre Fábio",
      footnote: "Por que Mestre?",
      title: "Construo produtos com IA, do banco de dados ao deploy.",
      subtitle:
        "Engenheiro de Software Sênior: full stack, Linux e AWS. {{YEARS}} anos de experiência, trabalhando remoto de Rio das Ostras, RJ.",
      downloadCv: "Baixar currículo",
      cvUrl: "/cv/Fabio_Berbert_Curriculo_PT.pdf",
      contactCta: "Falar comigo",
      liveTitle: "No ar agora",
      portraitAlt: "Foto de Fábio Berbert de Paula",
    },
    about: {
      storyTitle: "Por que \"Mestre\"?",
      story:
        "O apelido nasceu em um dos meus primeiros empregos. Cheguei, resolvi uma série de problemas que estavam parados havia meses na empresa, e alguém passou a me chamar de Mestre. Assumi o personagem, e o apelido ficou.",
      description:
        "Desenvolvedor full stack com {{YEARS}} anos de experiência em desenvolvimento de sistemas, administração de servidores Linux e infraestrutura em nuvem. Nos últimos anos meu trabalho se concentra em produtos com IA generativa: agentes com ferramentas, assistentes no WhatsApp, automação de CRM e análise de dados. Cuido do produto de ponta a ponta, da modelagem do banco ao deploy, com CI/CD, testes automatizados e observabilidade.",
      helpTitle: "Como posso ajudar",
      help1:
        "Agentes de IA que consultam seus dados e executam tarefas nos seus sistemas (function calling e MCP).",
      help2:
        "Atendimento no WhatsApp com IA que agenda, responde, lembra e registra, por texto ou áudio.",
      help3:
        "Sistemas web e CRMs sob medida, integrados ao que sua empresa já usa.",
      help4:
        "Infraestrutura Linux e AWS estável, com deploy automatizado, testes e monitoramento.",
      offTitle: "Fora do expediente",
      musicCaption: "Fiz esta música e o clipe com IA.",
      alexaboladaDesc:
        "Instagram @alexabolada, onde publico meus experimentos com IA e automação residencial.",
      cryptoDesc:
        "Criptomoedas desde 2016, com sólidos conhecimentos em blockchain e APIs de exchanges.",
      openSourceDesc:
        "Contribuidor de software livre desde 2002.",
      position:
        "Aberto a vagas remotas de Engenheiro de Software Sênior, Full Stack ou IA aplicada, e a projetos sob demanda.",
    },
    project: {
      visitProject: "Ver projeto",
      featured: "Destaque",
    },
    projectsData: {
      vivaolinux: {
        title: "Viva o Linux",
        tagline: "comunidade Linux desde 2002",
        description:
          "A comunidade de Linux e software livre em português que fundei em 2002, no ar há 24 anos, com artigos, dicas, scripts, fórum e notícias escritos pelos próprios usuários.",
        details:
          "Continuo cuidando de tudo: desenvolvimento, servidores, SEO e moderação. Conduzo a modernização do código para PHP 8.3 e Twig, com busca em Meilisearch, proteção contra XSS e CSRF e pipeline de conteúdo assistido por IA. Minhas contribuições: 149 artigos, 530 dicas, 67 scripts e quase 2 mil posts no fórum.",
        tags: ["PHP", "MariaDB", "Twig", "Meilisearch", "Nginx", "Linux"],
        imageUrl: vivaolinuxImg,
        url: "https://www.vivaolinux.com.br",
        featured: true,
        visible: true,
      },
      friendsfighters: {
        title: "Friends Fighters",
        tagline: "jogo de luta para Android",
        description:
          "Jogo de luta 2D para Android que transforma fotos dos seus amigos em lutadores de papel. Tire a foto, toque no rosto e o seu amigo está pronto para a briga.",
        details:
          "A remoção de fundo roda no próprio celular (MediaPipe), com vozes gravadas para golpes e nocautes, golpes especiais, CPU, três idiomas e compra única validada por backend próprio. Publicado na Google Play.",
        tags: ["Godot", "GDScript", "MediaPipe", "Fastify", "PostgreSQL"],
        imageUrl: friendsfightersImg,
        video: "/video/friends-fighters-trailer.mp4",
        url: "https://play.google.com/store/apps/details?id=io.github.fberbert.friendsfighters",
        featured: true,
        visible: true,
      },
      tonaquadra: {
        title: "Tô na Quadra",
        tagline: "SaaS para arenas esportivas",
        description:
          "SaaS para arenas esportivas organizarem rankings, torneios, desafios e Plays recreativos em beach tennis, tênis, padel, pickleball, futevôlei e vôlei. Um assistente de IA no WhatsApp consulta jogos e classificação, combina horários e registra resultados. Em uso por arenas de Nova Friburgo, Rio das Ostras e Búzios (RJ).",
        tags: ["Node.js", "Next.js", "OpenAI", "WhatsApp", "Stripe", "PWA"],
        imageUrl: tonaquadraImg,
        url: "https://tonaquadra.com",
        visible: true,
      },
      monetal: {
        title: "Monetal Secretária IA",
        tagline: "secretária IA para clínicas",
        description:
          "Secretária virtual no WhatsApp para clínicas: agenda por profissional, marcação, remarcação e cancelamento em linguagem natural por texto ou áudio, confirmação de consultas, feedback e campanhas de retorno. Console Next.js em PT, EN e ES, com atendimento humano e planos via Stripe.",
        tags: ["Node.js", "Next.js", "OpenAI", "Gemini", "ElevenLabs", "Stripe"],
        imageUrl: monetalImg,
        url: "https://monetal.com.br",
        visible: true,
      },
      rabugento: {
        title: "Assistente Rabugento",
        tagline: "assistente pessoal no WhatsApp",
        description:
          "Assistente pessoal no WhatsApp para finanças (com leitura de boleto), lembretes, listas de compras, tarefas, cofre de documentos e consultas, por texto ou áudio, com painel web sincronizado.",
        tags: ["Node.js", "Express", "MySQL", "OpenAI", "WhatsApp", "React"],
        imageUrl: rabugentoImg,
        url: "https://rabugento.app",
        visible: true,
      },
      nbabetagent: {
        title: "NBA Bet Agent",
        tagline: "agente de análise da NBA",
        description:
          "Agente que coleta a rodada diária da NBA e cruza classificação, lesões, descanso, viagens e odds ao vivo para projetar resultados, com remoção de margem pelo método de Shin, critério de Kelly fracionado, rastreamento de CLV e liquidação automática de apostas. Painel em Next.js em três idiomas.",
        tags: ["Python", "FastAPI", "PostgreSQL", "pandas", "OpenAI", "Next.js"],
        imageUrl: nbabetagentImg,
        url: "https://nbabetagent.com",
        visible: true,
      },
      automatizando: {
        title: "Automatizando.dev",
        tagline: "automação residencial e IA",
        description:
          "Plataforma de conteúdo e produtos de automação residencial e IA: artigos, fórum, cursos pagos, vídeos, assistentes com function calling, chatbots de WhatsApp, pagamentos e controle remoto de portões.",
        tags: ["Node.js", "Express", "Next.js", "MariaDB", "Redis", "OpenAI"],
        imageUrl: automatizandoImg,
        url: "https://automatizando.dev",
        visible: true,
      },
      brinquedofalante: {
        title: "Brinquedo Falante",
        tagline: "pelúcia que conversa",
        description:
          "Bicho de pelúcia que conversa com crianças: um Echo Dot com bateria dentro do brinquedo, controlado por uma skill Alexa própria ligada a um backend Node.js com IA generativa. Pelo painel web, os pais configuram nome, personalidade, voz e interesses da criança.",
        tags: ["React", "Node.js", "OpenAI", "Alexa Skills Kit"],
        imageUrl: brinquedofalanteImg,
        video: "/video/brinquedo-falante.mp4",
        url: "https://automatizando.dev/brinquedo",
        visible: true,
      },
      cursoautomacao: {
        title: "Curso de Automação Residencial",
        tagline: "curso online",
        description:
          "Um curso online sobre automação residencial, abordando IoT, Home Assistant, Node-RED e automações com IA.",
        tags: ["Home Assistant", "IoT", "Inteligência Artificial"],
        url: "https://automatizando.dev/cursos",
        imageUrl: cursoAutomacaoImg,
        visible: false,
      },
      abrirgaragem: {
        title: "Abrir Garagem",
        tagline: "automação de garagem",
        description:
          "Um aplicativo web que abre portas de garagem por meio de uma API baseada em nuvem e um dispositivo IoT, permitindo acesso remoto. Inclui registros de acesso, gerenciamento de usuários e agendamento.",
        tags: ["React", "Node.js", "Tuya", "Home Assistant", "MySQL"],
        video: "/video/abrir-garagem.mp4",
        url: "https://automatizando.dev/garagem",
        visible: false,
      },
      chatbotcasa: {
        title: "Chatbot com minha casa",
        tagline: "chatbot de automação residencial",
        description:
          "Um chatbot que controla a casa usando linguagem natural, com integração ao Home Assistant e OpenAI. Você conversa com o chatbot, e ele decide quais dispositivos ligar ou desligar para melhorar seu dia.",
        tags: ["Home Assistant", "OpenAI", "Node.js", "ChatGPT", "Twilio"],
        imageUrl: chatbotcasaImg,
        video: "/video/chatbot-casa.mp4",
        url: "https://www.instagram.com/p/C3X1r_yAx23/",
        visible: false,
      },
      whereisluiza: {
        title: "Onde está Luiza",
        tagline: "jogo infantil",
        description:
          "Um jogo infantil simples para Android, onde o objetivo é encontrar onde a personagem Luiza está.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: whereisluizaImg,
        url: "https://play.google.com/store/apps/details?id=com.whereisluiza",
        visible: false,
      },
      bitcoinconverter: {
        title: "Conversor de Bitcoin",
        tagline: "conversor de Bitcoin",
        description:
          "Um conversor de Bitcoin simples que converte quantidades de Bitcoin para USD e Real brasileiro, e vice-versa.",
        tags: ["React Native", "JavaScript", "Android"],
        imageUrl: bitcoinconverterImg,
        url: "https://play.google.com/store/apps/details?id=com.bitcoinconverter2",
        visible: false,
      },
    },
    skills: [
      {
        title: "Construir",
        items: [
          "TypeScript",
          "JavaScript",
          "Python",
          "PHP",
          "SQL",
          "Shell Script",
          "GDScript",
          "Node.js",
          "Express",
          "Fastify",
          "FastAPI",
          "Django",
          "EspoCRM",
          "APIs REST",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Radix UI",
          "Framer Motion",
          "PWA",
        ],
      },
      {
        title: "IA aplicada",
        items: [
          "API OpenAI",
          "Function calling",
          "MCP",
          "LangChain",
          "LangGraph",
          "Google Gemini",
          "ElevenLabs",
          "Engenharia de prompts",
        ],
      },
      {
        title: "Operar",
        items: [
          "Linux",
          "AWS",
          "Google Cloud",
          "Azure",
          "Docker",
          "Nginx",
          "GitHub Actions",
          "GitLab CI",
          "Grafana/Loki",
          "PostgreSQL",
          "MySQL/MariaDB",
          "SQL Server",
          "Amazon Redshift",
          "Redis",
          "Meilisearch",
          "MongoDB",
          "Jest",
          "Playwright",
          "pytest",
        ],
      },
    ],
    experiencesData: [
      {
        title: "AI Software Developer",
        location: "Wine · Remoto",
        description:
          "Desenvolvi o Wine Communication Agent, plataforma interna de CRM que gera comunicações personalizadas por push e e-mail com LLM. Criei um servidor MCP sobre Amazon Redshift, CleverTap e PostgreSQL, uma API FastAPI com cerca de 120 endpoints, workers assíncronos e o painel em Next.js, com observabilidade em Grafana e Loki.",
        date: "set/2025 - out/2026",
      },
      {
        title: "Desenvolvedor Full Stack",
        location: "Altarede · Nova Friburgo, RJ (híbrido)",
        description:
          "Unifiquei cinco sistemas em um único CRM (Hub Altarede) baseado em EspoCRM para um provedor de telecom, com 33 módulos customizados, integrações com OZMap, PRTG, IXC e SQL Server, monitoramento de roteadores em tempo real e deploy contínuo com GitLab CI.",
        date: "nov/2024 - out/2026",
      },
      {
        title: "Engenheiro AWS",
        location: "Aivis Tecnologia · Remoto",
        description:
          "Responsável pela arquitetura, configuração e manutenção dos serviços e servidores do sistema Aivis na Amazon AWS.",
        date: "jun/2024 - presente",
      },
      {
        title: "Desenvolvedor Full Stack",
        location: "Automatizando.dev · Rio das Ostras, RJ",
        description:
          "Plataforma própria de conteúdo, cursos e produtos de IA e automação residencial.",
        date: "ago/2023 - out/2024",
      },
      {
        title: "Fundador e Desenvolvedor Full Stack",
        location: "Viva o Linux",
        description:
          "Criei e mantenho o portal desde 2002: desenvolvimento, servidores, SEO e moderação. Conduzo a modernização do código legado para PHP 8.3, Twig e camadas de serviço e repositório, com busca em Meilisearch, proteção contra XSS e CSRF e pipeline de conteúdo assistido por IA.",
        date: "nov/2002 - presente",
      },
      {
        title: "Desenvolvedor Back-end e DevOps",
        location: "Provedor ISM · Rio de Janeiro, RJ",
        description:
          "Desenvolvimento de sistemas web e administração de servidores Linux do provedor.",
        date: "jan/2001 - dez/2004",
      },
      {
        title: "Administrador de Sistemas GNU/Linux",
        location: "Linux Solutions · Rio de Janeiro, RJ",
        description:
          "Administração de servidores Linux e serviços de rede (web, e-mail, DNS, firewall). Obtive meu certificado LPI 6 meses antes de me formar e consegui este emprego em seguida.",
        date: "jun/2000 - mai/2001",
      },
    ],
    contact: {
      description: `Escreva para <a class="link" href="mailto:fabio@mestrefabio.com">fabio@mestrefabio.com</a> ou use o formulário.`,
      guidance:
        "Conte o que você precisa, o prazo e onde o sistema roda hoje. Eu mesmo respondo.",
      email: "Seu e-mail",
      message: "Sua mensagem",
      submit: "Enviar mensagem",
      sending: "Enviando...",
      success: "Mensagem enviada. Obrigado! Vou responder no e-mail informado.",
      validation: "Informe um e-mail válido e uma mensagem de até 5.000 caracteres.",
      rate_limit: "Muitas tentativas. Tente novamente em 10 minutos.",
      delivery: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
      footer: "Em outros lugares",
    },
    footer: {
      rights: "© {{YEAR}} Fábio Berbert de Paula. Todos os direitos reservados.",
      about: `Sobre este site: construído com React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Framer Motion, React Email & Resend.`,
      github: "Código-fonte no",
    },
  },
};
