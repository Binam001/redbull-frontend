import Divider from "@/components/landing/Divider";
import GooeyReveal from "@/components/landing/GoeyReveal";
import HeroCarousel from "@/components/landing/HeroCarousel";
import HeroTry from "@/components/landing/HeroTry";
import Intro from "@/components/landing/Intro";
import Products from "@/components/landing/Products";
import SvgPathHoverEffect from "@/components/landing/SvgPathHoverCardGrid";

const page = () => {
  return (
    <div className="relative">
      {/* <HeroSection /> */}
      <HeroCarousel /> 
      <Intro />
      <HeroTry />
      <Products />
      <Divider />
      <SvgPathHoverEffect />
      <GooeyReveal />
      {/* <RedBullAnimation /> */}
      {/* <RedBullAnimtaion2 /> */}
      {/* <ParagraphReveal
        text="Red Bull vitalizes body and mind. Engineered for those who relentlessly defy limits, break records, and master their craft. Fuel your daily triumphs and unleash your full potential with pure, uncompromising energy."
        className="bg-[#000712] bg-linear-to-r from-[#010208] to-transparent"
      /> */}
      {/* <SecondSection /> */}
      {/* <RedBullAnimation3 /> */}
      {/* <HeroSection />
      <AboutCan />
      <GridSection />
      <CirclePointSection /> */}
      {/* <SkyViewSection /> */}
      {/* <ImgDivider1 /> */}
      {/* <BannerDivider /> */}
      {/* <AboutRedBull1 /> */}
      {/* <AboutCan /> */}
      {/* <BungeeSection /> */}
      {/* <MountainAnimation /> */}
      {/* <SkydivingStartSection /> */}
      {/* <div className="h-dvh bg-amber-600"></div>
      <div className="h-dvh bg-blue-600"></div> */}
    </div>
  );
};

export default page;
