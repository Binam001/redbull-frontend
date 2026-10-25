import AthletesDisplay from "@/components/athletes/AthletesDisplay";
import AthletesHero from "@/components/athletes/AthletesHero";
import HeroSection from "@/components/athletes/HeroSection";
import GridSection from "@/components/athletes/GridSection";
import AthletesSection from "@/components/athletes/AthletesSection";
import SvgPathHoverCardGrid from "@/components/landing/SvgPathHoverCardGrid";

const page = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* <AthletesHero /> */}
      <HeroSection />
      <SvgPathHoverCardGrid showViewAllButton={false} />
      {/* <GridSection /> */}
      {/* <AthletesDisplay /> */}
      <AthletesSection />
    </div>
  );
};

export default page;
