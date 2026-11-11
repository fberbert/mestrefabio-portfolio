// layout.tsx
import Header from "@/components/header";
import "./globals.css";
import { Archivo, Literata } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import MotionProvider from "@/components/motion-provider";
import SkipLink from "@/components/skip-link";
import ScrollToTop from "@/components/scroll-to-top";
import ThemeContextProvider from "@/context/theme-context";
import LanguageContextProvider from "@/context/language-context";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = Literata({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-body",
  display: "swap",
});

export { metadata } from "@/lib/site-metadata";

// Applies the saved or preferred theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeContextProvider>
          <LanguageContextProvider>
            <ActiveSectionContextProvider>
              <MotionProvider>
                <SkipLink />
                <Header />
                {children}
                <Footer />
                <ScrollToTop />
              </MotionProvider>
            </ActiveSectionContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
