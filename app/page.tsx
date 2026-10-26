import FeaturedEvents from "@/components/events/FeaturedEvents";
import Cheers from "@/components/landing/Cheers";
import Divider from "@/components/landing/Divider";
import HeroCarousel from "@/components/landing/HeroCarousel";
import HeroTry from "@/components/landing/HeroTry";
import SvgPathHoverEffect from "@/components/landing/SvgPathHoverCardGrid";
import Faq from "@/components/landing/CleanFaq";
import TextDivider1 from "@/components/landing/TextDivider1";
import TextDivider2 from "@/components/landing/TextDivider2";

const page = () => {
  return (
    <div className="relative">
      <HeroCarousel />
      <TextDivider1 />
      <HeroTry />
      <Cheers />
      <FeaturedEvents />
      <TextDivider2 />
      <SvgPathHoverEffect />
      <Divider />
      <Faq />
    </div>
  );
};

export default page;
