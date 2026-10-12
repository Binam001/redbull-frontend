import CareerDisplay from "@/components/career/CareerDisplay";
import CareerHero from "@/components/career/CareerHero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers | Join Our Mission - Red Bull",
    description:
        "Explore open career opportunities at Red Bull. We're looking for passionate people to join our mission across design, engineering, marketing, and operations.",
};

const page = () => {
    return (
        <div className="relative">
            <CareerHero />
            <CareerDisplay />
        </div>
    );
};

export default page;