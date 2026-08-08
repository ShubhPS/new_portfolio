import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Manifesto />
        <Projects />
        <Process />
        <Experience />
      </main>
      <Contact />
    </>
  );
}
