import ProductCta from "@/components/red-bill-250ml/ProductCta";
import ProductDivider from "@/components/red-bill-250ml/ProductDivider";
import ProductsHero from "@/components/red-bill-250ml/ProductsHero";
import ShortHero from "@/components/red-bill-250ml/ShortHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Bull® 250ml | RED BULL® GOLD - Energy Drinks Nepal",
  description:
    "Red Bull® Gold is a functional beverage that contains high quality ingredients like Taurine, Vitamins B3, B5, B6 and B12. Stimulates the body's metabolism and enhances mental performance and physical endurance.",
};

export default function RedBull250mlPage() {
  return (
    <main className="relative">

      <ShortHero />
      <ProductsHero />
      <ProductDivider />
      <ProductCta />
    </main>
  );
}
