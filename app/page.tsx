import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Quote from "@/components/sections/Quote";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { getHeroClips } from "@/lib/hero-playlist";

export default function Home() {
  const clips = getHeroClips();
  return (
    <>
      <Navbar />
      <main>
        <Hero clips={clips} />
        <About />
        <Quote />
        <Services />
        <WhyUs />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <ThemeSwitcher />
      <FloatingButtons />
    </>
  );
}