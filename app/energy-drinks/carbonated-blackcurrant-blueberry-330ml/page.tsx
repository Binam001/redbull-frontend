import CarbonatedCta from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedCta";
import CarbonatedDivider from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedDivider";
import CarbonatedHero from "@/components/carbonated-blackcurrant-blueberry-330ml/CarbonatedHero";
import LongHero from "@/components/carbonated-blackcurrant-blueberry-330ml/LongHero";
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
      <LongHero />
      <CarbonatedHero />
      <CarbonatedDivider />
      <CarbonatedCta />
    </main>
  );
}
