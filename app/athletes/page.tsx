import AthletesDisplay from "@/components/athletes/AthletesDisplay";
import AthletesHero from "@/components/athletes/AthletesHero";
import HeroSection from "@/components/athletes/HeroSection";

const page = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* <AthletesHero /> */}
      <HeroSection />
      <AthletesDisplay />
    </div>
  );
};

export default page;
