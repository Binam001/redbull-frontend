export interface EnergyDrink {
  id: string;
  slug: string;
  name: string;
  dropdownName: string;
  colloquialName: string;
  volume: string;
  colloquialDescription: string;
  description: string;
  tagline: string;
  category: string;
  accentColor: string;
  secondaryColor: string;
  badge: string;
  href: string;
  ingredients: string[];
  features: {
    title: string;
    description: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
}

export const ENERGY_DRINKS: EnergyDrink[] = [
  {
    id: "red-bull-250ml",
    slug: "red-bull-250ml",
    name: "Red Bull® 250ml",
    dropdownName: "Red Bull® 250ml",
    colloquialName: "RED BULL® GOLD",
    volume: "250ml",
    colloquialDescription:
      "Red Bull® 250ml or RED BULL® GOLD as it's colloquially referred to.",
    description:
      "Red Bull® Gold is a functional beverage that contains high quality ingredients like Taurine, Vitamins B3, B5, B6 and B12. The perfect companion to your active lifestyle, Red Bull® Gold contains a nutritious blend of amino acids, carbohydrates and B Vitamins to stimulate the body's metabolism and enhance mental performance and physical endurance.",
    tagline: "Stimulate Metabolism & Enhance Mental & Physical Endurance",
    category: "Functional Energy Beverage",
    accentColor: "#F59E0B",
    secondaryColor: "#CB2026",
    badge: "Gold Edition",
    href: "/energy-drinks/red-bull-250ml",
    ingredients: [
      "Taurine",
      "Vitamin B3 (Niacin)",
      "Vitamin B5 (Pantothenic Acid)",
      "Vitamin B6",
      "Vitamin B12",
      "Amino Acids",
      "Carbohydrates",
    ],
    features: [
      {
        title: "Stimulates Metabolism",
        description:
          "Formulated with key B-group vitamins to support healthy body metabolism and sustained energy release.",
      },
      {
        title: "Enhances Mental Performance",
        description:
          "Sharpen alertness, reaction speed, and cognitive concentration during demanding tasks.",
      },
      {
        title: "Physical Endurance",
        description:
          "Packed with high-grade Taurine and amino acids designed for active athletes and high-performance lifestyles.",
      },
    ],
    specifications: [
      { label: "Volume", value: "250 ml" },
      { label: "Colloquial Name", value: "RED BULL® GOLD" },
      { label: "Origin Selection", value: "Nepal Market" },
      { label: "Formulation", value: "Functional Energy" },
      { label: "Key Actives", value: "Taurine + B3, B5, B6, B12" },
    ],
  },
  {
    id: "carbonated-blackcurrant-blueberry-330ml",
    slug: "carbonated-blackcurrant-blueberry-330ml",
    name: "Red Bull® Carbonated Blackcurrant Blueberry 330ml",
    dropdownName: "Carbonated Blackcurrant Blueberry 330ml",
    colloquialName: "Red Bull® New-Gen Can",
    volume: "330ml",
    colloquialDescription:
      "Red Bull® Carbonated Blackcurrant Blueberry 330ml or Red Bull® New-Gen Can as it's colloquially referred to.",
    description:
      "Red Bull® New-Gen can is a refreshing beverage that combines carbonation with a delicious blackcurrant and blueberry flavor profile. Crafted for active lifestyles and busy routines, it provides smooth, flavorful refreshment and an energizing boost for work, study, gaming, and workouts in a convenient ready-to-drink can.",
    tagline: "Sparkling Berry Fusion with an Energizing Boost",
    category: "Carbonated Fruit Energy Beverage",
    accentColor: "#8B5CF6",
    secondaryColor: "#2563EB",
    badge: "New-Gen Can",
    href: "/energy-drinks/carbonated-blackcurrant-blueberry-330ml",
    ingredients: [
      "Carbonated Water",
      "Natural Blackcurrant Flavor",
      "Wild Blueberry Extract",
      "Taurine",
      "B-Group Vitamins",
      "Caffeine",
    ],
    features: [
      {
        title: "Refreshing Carbonation",
        description:
          "Crisp sparkling effervescence delivering smooth, palate-cleansing refreshment in every sip.",
      },
      {
        title: "Blackcurrant & Blueberry Flavor",
        description:
          "Vibrant natural dark berry notes balancing tartness and sweetness for maximum sensory satisfaction.",
      },
      {
        title: "Versatile Energy Boost",
        description:
          "Crafted for work, study, gaming marathons, and intense workouts in a sleek 330ml ready-to-drink format.",
      },
    ],
    specifications: [
      { label: "Volume", value: "330 ml" },
      { label: "Colloquial Name", value: "Red Bull® New-Gen Can" },
      { label: "Origin Selection", value: "Nepal Market" },
      { label: "Flavor Profile", value: "Blackcurrant & Blueberry" },
      { label: "Carbonation", value: "Lightly Sparkling" },
    ],
  },
];

export function getEnergyDrinkBySlug(slug: string): EnergyDrink | undefined {
  return ENERGY_DRINKS.find(
    (drink) =>
      drink.slug === slug ||
      (slug === "red-bull-gold" && drink.slug === "red-bull-250ml") ||
      (slug === "new-gen" && drink.slug === "carbonated-blackcurrant-blueberry-330ml")
  );
}
