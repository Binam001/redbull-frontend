import AboutTokenomics from "@/components/about/AboutTokenomics";
import Saras from "@/components/about/Saras";
import Tcp from "@/components/about/Tcp";
import SecondSection from "@/components/home/SecondSection";
import GooeyReveal from "@/components/landing/GoeyReveal";
import Intro from "@/components/landing/Intro";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | HydroFlow",
  description: "Tokenizing Hydration - Pure. Refreshing. Blockchain-Powered.",
};

export default function AboutPage() {
  return (
    <main className="relative w-full">
      <GooeyReveal />

      <Intro />
      <SecondSection />
      {/* <AboutHero /> */}
      <AboutTokenomics />
      {/* <Tcp />
      <Saras /> */}
      {/* <VideoAnimation /> */}
    </main>
  );
}
