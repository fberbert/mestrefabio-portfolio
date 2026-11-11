import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import Skills from "@/components/skills";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Intro />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
