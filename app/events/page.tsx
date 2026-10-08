import EventsHero from "@/components/events/EventsHero";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import EventsVideo from "@/components/events/EventsVideo";
import AllEvents from "@/components/events/AllEvents";
import VideoAnimation from "@/components/about/ScrollVideoAnimation";

export const metadata = {
  title: "Events | Red Bull",
  description: "Explore the latest Red Bull events, athletes, and experiences.",
};

const EventsPage = () => {
  return (
    <main className="relative bg-white">
      <EventsHero />
      <FeaturedEvents />
      <AllEvents />
      {/* <EventsVideo /> */}

    </main>
  );
};

export default EventsPage;