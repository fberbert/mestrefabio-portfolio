import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { metadata } from "../../lib/site-metadata";

describe("site metadata", () => {
  it("uses the correct portfolio title and current experience", () => {
    expect(metadata.title).toBe("Mestre Fábio | Personal Portfolio");
    expect(metadata.description).toBe(
      `Fábio is a senior full-stack developer focused on applied AI, Linux and AWS, with ${new Date().getFullYear() - 2000} years of experience. Bring me your ideas and I'll bring them to life!`,
    );
  });

  it("exposes one metadata source through the root layout", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain('export { metadata } from "@/lib/site-metadata"');
    expect(existsSync("app/head.tsx")).toBe(false);
  });

  it("lets the generated icon route provide the favicon", () => {
    expect(metadata.icons).toBeUndefined();
    expect(existsSync("app/icon.tsx")).toBe(true);
    expect(existsSync("app/icon.ico")).toBe(false);
  });
});
