/**
 * All site copy lives here. Anything still in [BRACKETS] is a placeholder for you to fill in.
 */

import type { IconName } from "@/components/Icon";

export type NavItem = { label: string; href: string };

export type SocialLink = { label: string; href: string; icon: IconName };

/** One way to reach you: shown in the contact section, the contact page and the footer. */
export type ContactChannel = { label: string; value: string; href: string; icon: IconName };

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: string;
  /** Short status shown as plain text, e.g. "In progress". Leave empty when shipped. */
  status?: string;
  stack: string[];
  /** Screenshot of the project's front page, shown on hover. Path in /public. */
  preview?: string;
  /** Only add links that exist. Rows without links show none. */
  links?: ProjectLink[];
};

export type Certificate = {
  slug: string;
  title: string;
  /** What kind of certificate it is, as printed on it */
  kind: string;
  issuer: string;
  /** Short date line shown in lists, e.g. "Jun 2024" or "Jul – Dec 2025" */
  date: string;
  year: number;
  /** Label/value pairs shown under the title, taken from the certificate itself */
  details: { label: string; value: string }[];
  image: { src: string; width: number; height: number };
  pdf: string;
};

export const site = {
  name: "ermsDev",
  person: "Herman John Rubis",
  description:
    "Herman John Rubis is a full-stack web developer and UI/UX designer from Calamba, Laguna.",
  greeting: "Hi, I'm",
  /** Cycles in the hero, typed out like a terminal. */
  roles: [
    "full-stack web developer",
    "UI/UX designer",
    "Android app developer",
    "BSIT student at STI College Calamba",
  ],
  tagline: "I make the design and the code agree.",
  location: "Calamba, Laguna",
  timeZone: "Asia/Manila",
  email: "hermanrubisjd@gmail.com",
  schoolEmail: "rubis.353948@calamba.sti.edu.ph",
  github: "hermanjrubis",
  instagram: "hrmnrbs_",
  copyrightYear: 2026,
} as const;

/**
 * The draggable lanyard ID card in the hero (desktop only).
 * photo: path to an image in /public. Leave empty for a placeholder box.
 */
export const idCard = {
  name: "Herman John Rubis",
  roles: ["Full-stack web developer", "UI/UX designer"],
  photo: "/me.jpg",
  /** Small line on the back of the card. */
  backNote: "If found, please return to Herman.",
};

/**
 * Logo loop under the hero. `icon` is a Simple Icons slug (simpleicons.org);
 * see components/TechMarquee.tsx for the ones wired up.
 */
export const techStack = [
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css" },
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Express", icon: "express" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Three.js", icon: "threedotjs" },
  { name: "Firebase", icon: "firebase" },
  { name: "Supabase", icon: "supabase" },
  { name: "Cloudinary", icon: "cloudinary" },
  { name: "MapLibre", icon: "maplibre" },
  { name: "OpenStreetMap", icon: "openstreetmap" },
  { name: "Java", icon: "openjdk" },
  { name: "Android Studio", icon: "androidstudio" },
  { name: "Figma", icon: "figma" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Vercel", icon: "vercel" },
  { name: "Claude", icon: "claude" },
  { name: "Anthropic", icon: "anthropic" },
  { name: "npm", icon: "npm" },
] as const;

export const nav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Certificates", href: "/certificates" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: `https://github.com/${site.github}`, icon: "github" },
  { label: "Instagram", href: `https://www.instagram.com/${site.instagram}/`, icon: "instagram" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  // Add LinkedIn once you have the profile URL (add a "linkedin" icon in components/Icon.tsx too)
];

export const contactChannels: ContactChannel[] = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: "mail" },
  { label: "School email", value: site.schoolEmail, href: `mailto:${site.schoolEmail}`, icon: "school" },
  {
    label: "Instagram",
    value: `@${site.instagram}`,
    href: `https://www.instagram.com/${site.instagram}/`,
    icon: "instagram",
  },
  { label: "GitHub", value: `@${site.github}`, href: `https://github.com/${site.github}`, icon: "github" },
];

export const projects: Project[] = [
  {
    slug: "calzada",
    title: "Calzada",
    summary:
      "A commuting and local guide for Calamba, Laguna. Routes on an open map, 360° street photos you can walk through, an AI assistant, and a feed where local businesses post updates.",
    role: "Design + full stack",
    year: "2026",
    status: "In progress",
    stack: ["JavaScript", "Node.js", "Express", "Firebase", "MapLibre GL", "Groq", "Cloudinary"],
    preview: "/projects/calzada.jpg",
    links: [{ label: "Source", href: "https://github.com/hermanjrubis/calambiyahe" }],
  },
  {
    slug: "certify",
    title: "Certify",
    summary:
      "Bulk certificate generator. Upload a template, drag the name into place, paste a list, and download every certificate as one ZIP at full quality. Runs entirely in the browser.",
    role: "Design + front end",
    year: "2026",
    stack: ["HTML", "CSS", "JavaScript"],
    preview: "/projects/certify.jpg",
    links: [{ label: "Source", href: "https://github.com/hermanjrubis/certify" }],
  },
  {
    slug: "sti-bsit",
    title: "STI Calamba BSIT site",
    summary:
      "Multi-page site for the BSIT program at STI College Calamba: program tracks, admissions, facilities, events and an AI chat helper.",
    role: "Design + front end",
    year: "2026",
    stack: ["HTML", "CSS", "JavaScript"],
    preview: "/projects/sti.jpg",
    links: [{ label: "Source", href: "https://github.com/hermanjrubis/STI-College-Calamba" }],
  },
  {
    slug: "reservo",
    title: "Reservo",
    summary:
      "Android reservation app with a dashboard, a live queue display and a calendar picker. Built with my group for class.",
    role: "Android developer, group project",
    year: "2026",
    status: "In progress",
    stack: ["Java", "Android Studio"],
  },
];

/** Newest first. Images live in public/certificates/ next to the original PDFs. */
export const certificates: Certificate[] = [
  {
    slug: "sap-s4hana-global-bike",
    title: "Intro to SAP S/4HANA using Global Bike – Part II",
    kind: "Certificate of Participation",
    issuer: "SAP University Alliances",
    date: "Jul – Dec 2025",
    year: 2025,
    details: [
      { label: "Period", value: "July 28 – December 12, 2025" },
      { label: "Conducted by", value: "STI College, Philippines" },
    ],
    image: { src: "/certificates/sap-s4hana-global-bike.jpg", width: 1980, height: 2801 },
    pdf: "/certificates/sap-s4hana-global-bike.pdf",
  },
  {
    slug: "oracle-java-fundamentals",
    title: "Java Fundamentals",
    kind: "Award of Course Completion",
    issuer: "Oracle Academy",
    date: "Jun 2024",
    year: 2024,
    details: [
      { label: "Issued", value: "June 19, 2024" },
      { label: "Instructor", value: "Beronika Peña" },
    ],
    image: { src: "/certificates/oracle-java-fundamentals.jpg", width: 2800, height: 2164 },
    pdf: "/certificates/oracle-java-fundamentals.pdf",
  },
];

export type AboutFocus = { title: string; text: string; projects: string[] };
export type ToolGroup = { label: string; tools: string[] };

/**
 * About page. Written from what's already on the site; edit freely.
 * Tool names in `toolbox` must match names in `techStack` so their logos show.
 */
export const about = {
  /** Large opening line. It fills in word by word as you scroll. */
  statement:
    "I'm Herman John Rubis, Drei to most people. I study IT at STI College Calamba, and I design and build for the web, usually both on the same project.",
  bio: [
    "Most of what I build starts with a problem close to home: a commuting guide for Calamba, a tool that makes a whole batch of certificates in one go, and a reservation app my group is building for Android.",
    "The part I enjoy most is where design meets code. I sketch the screens first, then sweat the spacing, motion and small states in the browser until it feels finished, not just working.",
  ],
  focus: [
    {
      title: "Web development",
      text: "Full-stack web apps: JavaScript and TypeScript up front with React and Next.js, and Node.js, Express, Firebase or Supabase behind them.",
      projects: ["calzada", "certify", "sti-bsit"],
    },
    {
      title: "UI/UX design",
      text: "Wireframes and mockups before code, then a small design system the build can follow: type, spacing, colour and every state in between.",
      projects: ["calzada", "sti-bsit"],
    },
    {
      title: "Android",
      text: "Native Android apps in Java with Android Studio, built with my groupmates.",
      projects: ["reservo"],
    },
  ] satisfies AboutFocus[],
  education: {
    degree: "BS Information Technology",
    school: "STI College Calamba",
    status: "In progress",
  },
  toolbox: [
    { label: "Languages", tools: ["HTML", "CSS", "JavaScript", "TypeScript", "Java"] },
    { label: "Front end", tools: ["React", "Next.js", "Tailwind CSS", "Three.js"] },
    { label: "Back end & data", tools: ["Node.js", "Express", "Firebase", "Supabase", "Cloudinary"] },
    { label: "Maps", tools: ["MapLibre", "OpenStreetMap"] },
    { label: "Design & mobile", tools: ["Figma", "Android Studio"] },
    { label: "Workflow", tools: ["Git", "GitHub", "Vercel", "npm", "Claude"] },
  ] satisfies ToolGroup[],
};
