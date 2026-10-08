import AspireHero from "@/components/red-bill-250ml/ProductsHero";
import ProductCta from "@/components/red-bill-250ml/ProductCta";
import ProductDivider from "@/components/red-bill-250ml/ProductDivider";
import { Metadata } from "next";
import ProductsHero from "@/components/red-bill-250ml/ProductsHero";

export const metadata: Metadata = {
  title: "Red Bull® 250ml | RED BULL® GOLD - Energy Drinks Nepal",
  description:
    "Red Bull® Gold is a functional beverage that contains high quality ingredients like Taurine, Vitamins B3, B5, B6 and B12. Stimulates the body's metabolism and enhances mental performance and physical endurance.",
};

export default function RedBull250mlPage() {
  return (
    <main className="relative">
      <ProductsHero />
      <ProductDivider />
      <ProductCta />
    </main>
  );
}
