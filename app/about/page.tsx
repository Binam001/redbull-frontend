import AboutHero from "@/components/about/AboutHero";
import AboutTokenomics from "@/components/about/AboutTokenomics";
import Saras from "@/components/about/Saras";
import VideoAnimation from "@/components/about/ScrollVideoAnimation";
import Tcp from "@/components/about/Tcp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | HydroFlow",
  description: "Tokenizing Hydration - Pure. Refreshing. Blockchain-Powered.",
};

export default function AboutPage() {
  return (
    <main className="relative w-full">
      <AboutHero />
      <AboutTokenomics />
      <Tcp />
      <Saras />
      {/* <VideoAnimation /> */}
    </main>
  );
}
