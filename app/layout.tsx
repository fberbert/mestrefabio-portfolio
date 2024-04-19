import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const exp = new Date().getFullYear() - 2000;
export const metadata = {
  title: "Mestre Fábio | Personal Portfolio",
  description: `Fábio is a full-stack developer with ${exp} years of experience. Bring me your ideas and I'll bring them to life!`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // original: #fbe2e3 | #946263 | #dbd7fb | #676394
  // new bases: #1B1A55 | #070F2B | #9290C3 | #535C91
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <video autoPlay muted loop id="myVideo">
          <source src="/code.mp4" type="video/mp4" />
        </video>

        <div className="bg-[#1B1A55] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#070F2B]"></div>
        <div className="bg-[#9290C3] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#535C91]"></div>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />

            <Toaster position="top-right" />
            <ScrollToTop />
            <ThemeSwitch />
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
