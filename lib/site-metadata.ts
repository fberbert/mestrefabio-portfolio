import type { Metadata } from "next";
import { yearsOfExperience } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mestre Fábio | Personal Portfolio",
  description: `Fábio is a senior full-stack developer focused on applied AI, Linux and AWS, with ${yearsOfExperience()} years of experience. Bring me your ideas and I'll bring them to life!`,
};
