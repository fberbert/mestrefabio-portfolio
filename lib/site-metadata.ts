import type { Metadata } from "next";

const experienceYears = new Date().getFullYear() - 2000;

export const metadata: Metadata = {
  title: "Mestre Fábio | Personal Portfolio",
  description: `Fábio is a full-stack developer with ${experienceYears} years of experience. Bring me your ideas and I'll bring them to life!`,
};
