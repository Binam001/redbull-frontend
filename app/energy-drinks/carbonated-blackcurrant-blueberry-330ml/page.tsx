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
import EnergyDrinkContent from "@/components/shared/EnergyDrinkContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Red Bull® Carbonated Blackcurrant Blueberry 330ml | New-Gen Can - Energy Drinks Nepal",
  description:
    "Red Bull® New-Gen can combines crisp carbonation with a delicious blackcurrant and blueberry flavor profile. Provides smooth, flavorful refreshment and an energizing boost for work, study, gaming, and workouts in a convenient 330ml ready-to-drink can.",
};

export default function CarbonatedBlackcurrantBlueberry330mlPage() {
  return (
    <main className="relative overflow-x-hidden">
      {/* <LongHero /> */}
      <CanAnimation />
      <EnergyDrinkContent
        title1="A Fresh Berry Flavor with a Spark,"
        title2="Driven by Unstoppable Momentum"
        desc="Experience Red Bull Carbonated Blackcurrant Blueberry 330ml: an
          invigorating fusion of dark, luscious berries and crisp, sparkling
          carbonation built for active days and demanding schedules. Formulated
          with high-grade taurine and essential B-group vitamins, it delivers a
          smooth, reliable functional energy boost whether you’re locked into a
          project, heading into a workout, or recharging for what’s next."
      />
      <VideoSection1 />
      <ImageDivider1 />
      <EnergyDrinkContent
        title1="More Than Just a Drink,"
        title2="Energy That Inspires the Extraordinary"
        desc="Red Bull is more than what’s inside the can, it’s the spark that turns
          ambition into motion. From athletes conquering impossible summits and
          redefining human limits, to creators and dreamers staying up to build
          the future, it exists to fuel the courage, focus, and drive to do what
          has never been done before. When you have the drive, Red Bull gives
          you the wings to make it extraordinary."
      />
      {/* <TextDivider2 /> */}
      <ImageSliderSection />
      {/* <CarbonatedHero /> */}
      {/* <CarbonatedDivider /> */}
      {/* <DrinkComparisionTable /> */}
      {/* <CarbonatedCta /> */}
    </main>
  );
}
