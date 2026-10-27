import CanAnimation from "@/components/carbonated-blackcurrant-blueberry-330ml/CanAnimation";
import CarbonatedCta from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedCta";
import CarbonatedDivider from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedDivider";
import CarbonatedHero from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedHero";
import ImageDivider1 from "@/components/carbonated-blackcurrant-blueberry-330ml/ImageDivider1";
import ImageSliderSection from "@/components/carbonated-blackcurrant-blueberry-330ml/ImageSliderSection";
import LongHero from "@/components/carbonated-blackcurrant-blueberry-330ml/LongHero";
import TextDivider1 from "@/components/carbonated-blackcurrant-blueberry-330ml/TextDivider1";
import TextDivider2 from "@/components/carbonated-blackcurrant-blueberry-330ml/TextDivider2";
import VideoSection1 from "@/components/carbonated-blackcurrant-blueberry-330ml/VideoSection1";
import DrinkComparisionTable from "@/components/shared/DrinkComparisionTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Red Bull® Carbonated Blackcurrant Blueberry 330ml | New-Gen Can - Energy Drinks Nepal",
  description:
    "Red Bull® New-Gen can combines crisp carbonation with a delicious blackcurrant and blueberry flavor profile. Provides smooth, flavorful refreshment and an energizing boost for work, study, gaming, and workouts in a convenient 330ml ready-to-drink can.",
};

export default function CarbonatedBlackcurrantBlueberry330mlPage() {
  return (
    <main className="relative">
      {/* <LongHero /> */}
      <CanAnimation />
      <TextDivider1 />
      <VideoSection1 />
      <ImageDivider1 />
      <TextDivider2 />
      <ImageSliderSection />
      {/* <CarbonatedHero /> */}
      {/* <CarbonatedDivider /> */}
      {/* <DrinkComparisionTable /> */}
      {/* <CarbonatedCta /> */}
    </main>
  );
}
