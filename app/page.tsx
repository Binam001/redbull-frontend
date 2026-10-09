import FeaturedEvents from "@/components/events/FeaturedEvents";
import Cheers from "@/components/landing/Cheers";
import HeroCarousel from "@/components/landing/HeroCarousel";
import HeroTry from "@/components/landing/HeroTry";
import SvgPathHoverEffect from "@/components/landing/SvgPathHoverCardGrid";
import ParagraphReveal from "@/components/shared/ParagraphReveal";

const page = () => {
  return (
    <div className="relative">
      {/* <HeroSection /> */}
      <HeroCarousel />
      <ParagraphReveal
        text="Red Bull is made for the moments when you’re ready to do more—when an early start, a demanding day, or one more attempt calls for renewed focus and drive. Its distinctive blend of ingredients helps you feel energized and alert, so you can keep moving through the work, training, and pursuits that matter to you."
        className="my-16"
      />
      <HeroTry />
      <Cheers />
      {/* <Products /> */}
      {/* <Divider /> */}
      <FeaturedEvents />
      <SvgPathHoverEffect />
      {/* <RedBullAnimation /> */}
      {/* <RedBullAnimtaion2 /> */}


      {/* <RedBullAnimation3 /> */}
      {/* <HeroSection /> */}
      {/* <AboutCan />
      <GridSection /> */}
      {/* <CirclePointSection /> */}
      {/* <SkyViewSection /> */}
      {/* <ImgDivider1 /> */}
      {/* <BannerDivider /> */}
      {/* <AboutRedBull1 />
      <AboutCan />
      <BungeeSection />
      <MountainAnimation />
      <SkydivingStartSection />
      <div className="h-dvh bg-amber-600"></div>
      <div className="h-dvh bg-blue-600"></div> */}
    </div>
  );
};

export default page;
