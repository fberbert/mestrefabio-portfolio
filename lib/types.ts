// types.ts
import { translations } from "@/lib/translations";

const links = translations.en.header.links;

export type SectionHash = (typeof links)[number]["hash"];
