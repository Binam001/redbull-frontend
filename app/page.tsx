import AboutCan from "@/components/home/AboutCan";
import AboutRedBull1 from "@/components/home/AboutRedBull1";
import BannerDivider from "@/components/home/BannerDivider";
import BungeeSection from "@/components/home/BungeeSection";
import CirclePointSection from "@/components/home/CirclePointSection";
import FirstSection from "@/components/home/FirstSection";
import GridSection from "@/components/home/GridSection";
import HeroSection from "@/components/home/HeroSection";
import ImgDivider1 from "@/components/home/ImgDivider1";
import MountainAnimation from "@/components/home/MountainAnimation";
import RedBullAnimation3 from "@/components/home/RedBullAnimation3";
import SkydivingStartSection from "@/components/home/SkydivingStartSection";
import ParagraphReveal from "@/components/shared/ParagraphReveal";
import SecondSection from "@/components/home/SecondSection";
import React from "react";

const page = () => {
  return (
    <div className="relative">
      {/* <RedBullAnimation /> */}
      {/* <RedBullAnimtaion2 /> */}
      <HeroSection />
      {/* <ParagraphReveal
        text="Red Bull vitalizes body and mind. Engineered for those who relentlessly defy limits, break records, and master their craft. Fuel your daily triumphs and unleash your full potential with pure, uncompromising energy."
        className="bg-[#000712] bg-linear-to-r from-[#010208] to-transparent"
      /> */}
      <SecondSection />
      {/* <RedBullAnimation3 /> */}
      {/* <HeroSection />
      <AboutCan />
      <GridSection />
      <CirclePointSection /> */}
      {/* <SkyViewSection /> */}
      {/* <ImgDivider1 /> */}
      {/* <BannerDivider /> */}
      <AboutRedBull1 />
      {/* <AboutCan /> */}
      {/* <BungeeSection /> */}
      <MountainAnimation />
      <SkydivingStartSection />
      {/* <div className="h-dvh bg-amber-600"></div>
      <div className="h-dvh bg-blue-600"></div> */}
    </div>
  );
};

export default page;
