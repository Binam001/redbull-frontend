import FloatingCircle from "@/components/red-bill-250ml/FloatingCircle";
import HeroSection from "@/components/red-bill-250ml/HeroSection";
import ImageDivider1 from "@/components/red-bill-250ml/ImageDivider1";
import ImageSliderSection from "@/components/red-bill-250ml/ImageSliderSection";
import ProductCta from "@/components/red-bill-250ml/ProductCta";
import ProductDivider from "@/components/red-bill-250ml/ProductDivider";
import ProductsHero from "@/components/red-bill-250ml/ProductsHero";
import RedBullPouringSection from "@/components/red-bill-250ml/RedBullPouringSection";
import ShortHero from "@/components/red-bill-250ml/ShortHero";
import SideBullSection from "@/components/red-bill-250ml/SideBullSection";
import TextDivider1 from "@/components/red-bill-250ml/TextDivider1";
import TextDivider2 from "@/components/red-bill-250ml/TextDivider2";
import VideoSection1 from "@/components/red-bill-250ml/VideoSection1";
import DrinkComparisionTable from "@/components/shared/DrinkComparisionTable";
import EnergyDrinkContent from "@/components/shared/EnergyDrinkContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Bull® 250ml | RED BULL® GOLD - Energy Drinks Nepal",
  description:
    "Red Bull® Gold is a functional beverage that contains high quality ingredients like Taurine, Vitamins B3, B5, B6 and B12. Stimulates the body's metabolism and enhances mental performance and physical endurance.",
};

export default function RedBull250mlPage() {
  return (
    <main className="relative overflow-x-hidden">
      {/* <RedBullPouringSection /> */}
      {/* <HeroSection />
      <FloatingCircle />
      <SideBullSection /> */}
      <ShortHero />
      {/* <TextDivider1 /> */}
      <EnergyDrinkContent
        title1="The Iconic Gold Heritage,"
        title2="Powered by Your True Energy"
        desc="Experience Red Bull® Gold 250ml: the legendary non-carbonated energy
          drink rooted in authentic Krating Daeng heritage. Formulated with
          high-potency taurine and vital B-group vitamins, it delivers a smooth,
          concentrated surge of vitality to stimulate your body’s metabolism,
          heighten mental focus, and sustain physical endurance through
          demanding days. Pure, relentless, and uncompromised ignite your true
          energy."
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
      {/* <ProductsHero /> */}
      {/* <ProductDivider /> */}
      {/* <DrinkComparisionTable variant="gold" /> */}
      {/* <ProductCta /> */}
    </main>
  );
}
