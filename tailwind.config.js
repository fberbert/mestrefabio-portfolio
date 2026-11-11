/** @type {import('tailwindcss').Config} */
const token = (name) => `oklch(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        accent: token("accent"),
        "accent-ink": token("accent-ink"),
        "accent-fg": token("accent-fg"),
        error: token("error"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
