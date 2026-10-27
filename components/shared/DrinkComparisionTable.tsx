"use client";

import React from "react";

export type DrinkVariant = "carbonated" | "gold";

export interface ComparisonRow {
  feature: string;
  subtext?: string;
  redBull: string;
  xtreme: string;
  softDrinks: string;
}

export interface DrinkComparisionTableProps {
  className?: string;
  variant?: DrinkVariant;
  heroTitle?: string;
  title?: string;
  footnote?: string;
}

const COMPARISON_DATA_CARBONATED: ComparisonRow[] = [
  {
    feature: "Carbonation",
    subtext: "(Fizz Level)",
    redBull: "Carbonated / Sparkling",
    xtreme: "High Carbonation",
    softDrinks: "High Carbonation",
  },
  {
    feature: "Caffeine Content",
    subtext: "(per serving)",
    redBull: "80 mg",
    xtreme: "~30 mg – 72 mg",
    softDrinks: "~30 mg – 34 mg",
  },
  {
    feature: "Taurine & B-Complex Vitamins",
    subtext: "(Energy Blend)",
    redBull: "Yes (Full Dose)",
    xtreme: "Moderate / Low",
    softDrinks: "None",
  },
  {
    feature: "Price Point in Nepal",
    subtext: "(NPR)",
    redBull: "NPR 120 – 150",
    xtreme: "NPR 50 – 80",
    softDrinks: "NPR 50 – 70",
  },
  {
    feature: "Origin & Formula Class",
    redBull: "Premium Global / European",
    xtreme: "Regional / Local Mass",
    softDrinks: "Local Bottled Soft Drink",
  },
  {
    feature: "Sugar vs Energy Mix",
    redBull: "Balanced Functional Energy",
    xtreme: "High Sugar / Fast Spike",
    softDrinks: "Very High Sugar / No Functional Energy",
  },
];

const COMPARISON_DATA_GOLD: ComparisonRow[] = [
  {
    feature: "Carbonation",
    subtext: "(Fizz Level)",
    redBull: "Non-Carbonated (Still)",
    xtreme: "High Carbonation",
    softDrinks: "High Carbonation",
  },
  {
    feature: "Caffeine Content",
    subtext: "(per serving)",
    redBull: "50 mg – 80 mg",
    xtreme: "~30 mg – 72 mg",
    softDrinks: "~30 mg – 34 mg",
  },
  {
    feature: "Taurine & B-Complex Vitamins",
    subtext: "(Energy Blend)",
    redBull: "Yes (Full Dose)",
    xtreme: "Moderate / Low",
    softDrinks: "None",
  },
  {
    feature: "Price Point in Nepal",
    subtext: "(NPR)",
    redBull: "NPR 110 – 130",
    xtreme: "NPR 50 – 80",
    softDrinks: "NPR 50 – 70",
  },
  {
    feature: "Origin & Formula Class",
    redBull: "Thai Heritage Formula",
    xtreme: "Regional / Local Mass",
    softDrinks: "Local Bottled Soft Drink",
  },
  {
    feature: "Sugar vs Energy Mix",
    redBull: "Concentrated Sweet Energy",
    xtreme: "High Sugar / Fast Spike",
    softDrinks: "Very High Sugar / No Functional Energy",
  },
];

export const DrinkComparisionTable: React.FC<DrinkComparisionTableProps> = ({
  className = "",
  variant = "carbonated",
  heroTitle,
  title = "There’s no competition",
  footnote = "*Based on standard energy drink specifications and market availability in Nepal.",
}) => {
  const comparisonData =
    variant === "gold" ? COMPARISON_DATA_GOLD : COMPARISON_DATA_CARBONATED;

  const resolvedHeroTitle =
    heroTitle ??
    (variant === "gold" ? "Red Bull Gold Can" : "Carbonated Red Bull");

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 font-primary">
            {title}
          </h2>
        </div>

        {/* Mobile Horizontal Scroll Hint */}
        <div className="flex md:hidden items-center justify-end gap-1.5 text-xs text-neutral-400 font-medium mb-3">
          <span>Scroll to compare</span>
          <svg
            className="w-4 h-4 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>

        {/* Comparison Table Container with Outer Border and Rounded Corners */}
        <div className="relative w-full overflow-x-auto pb-4 scroll-smooth">
          <div className="min-w-[700px] border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <table className="w-full border-separate border-spacing-0 text-left">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[26%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>

              {/* Table Header */}
              <thead>
                <tr className="bg-white">
                  {/* Column 1: Feature Title */}
                  <th
                    scope="col"
                    className="px-5 sm:px-7 py-6 text-left align-middle border-b border-r border-neutral-200"
                  >
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Features / Specifications
                    </span>
                  </th>

                  {/* Column 2: Red Bull Highlighted Column */}
                  <th
                    scope="col"
                    className="relative px-4 sm:px-6 py-6 text-center align-middle bg-[#edf3fe] border-t-2 border-l-2 border-r-2 border-b border-[#233971]/40 border-b-[#233971]/20 shadow-[0_-4px_16px_rgba(35,57,113,0.03)]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-2xl font-bold text-[#233971] tracking-tight font-primary">
                        {resolvedHeroTitle}
                      </span>
                    </div>
                  </th>

                  {/* Column 3: Xtreme */}
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-6 text-center align-middle border-b border-r border-neutral-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-base sm:text-xl font-semibold text-neutral-800 tracking-tight">
                        Xtreme
                      </span>
                    </div>
                  </th>

                  {/* Column 4: Coke / Pepsi / Sprite */}
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-6 text-center align-middle border-b border-neutral-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-base sm:text-xl font-semibold text-neutral-800 tracking-tight">
                        Coke / Pepsi / Sprite
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {comparisonData.map((row, index) => {
                  const isLastRow = index === comparisonData.length - 1;

                  return (
                    <tr
                      key={row.feature}
                      className="group transition-colors duration-150 hover:bg-neutral-50/60"
                    >
                      {/* Feature Label Cell */}
                      <td
                        className={`px-5 sm:px-7 py-5 sm:py-6 align-middle border-r border-neutral-200 ${
                          isLastRow ? "" : "border-b border-neutral-200"
                        }`}
                      >
                        <div className="text-sm sm:text-base font-semibold text-neutral-800">
                          {row.feature}
                        </div>
                        {row.subtext && (
                          <div className="text-xs text-neutral-400 font-normal mt-0.5">
                            {row.subtext}
                          </div>
                        )}
                      </td>

                      {/* Highlighted Red Bull Cell */}
                      <td
                        className={`px-4 sm:px-6 py-5 sm:py-6 text-center align-middle bg-[#edf3fe] border-l-2 border-r-2 border-[#233971]/40 group-hover:bg-[#e4eeff] transition-colors duration-150 ${
                          isLastRow
                            ? "border-b-2 border-b-[#233971]/40 shadow-[0_6px_20px_rgba(35,57,113,0.06)]"
                            : "border-b border-[#233971]/15"
                        }`}
                      >
                        <span className="text-sm sm:text-base font-bold text-[#233971] tracking-tight">
                          {row.redBull}
                        </span>
                      </td>

                      {/* Xtreme Cell */}
                      <td
                        className={`px-4 sm:px-6 py-5 sm:py-6 text-center align-middle text-sm sm:text-base text-neutral-600 font-normal border-r border-neutral-200 ${
                          isLastRow ? "" : "border-b border-neutral-200"
                        }`}
                      >
                        {row.xtreme}
                      </td>

                      {/* Coke / Pepsi / Sprite Cell */}
                      <td
                        className={`px-4 sm:px-6 py-5 sm:py-6 text-center align-middle text-sm sm:text-base text-neutral-600 font-normal ${
                          isLastRow ? "" : "border-b border-neutral-200"
                        }`}
                      >
                        {row.softDrinks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnote */}
        {footnote && (
          <div className="mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-neutral-400 italic font-sans leading-relaxed">
              {footnote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DrinkComparisionTable;
