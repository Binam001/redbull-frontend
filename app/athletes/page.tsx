import AthletesDisplay from "@/components/athletes/AthletesDisplay";
import AthletesHero from "@/components/athletes/AthletesHero";

const page = () => {
    return (
        <div className="relative min-h-screen bg-white">
            <AthletesHero />
            <AthletesDisplay />
        </div>
    );
};

export default page;