import AboutCan from "@/components/home/AboutCan";
import BannerDivider from "@/components/home/BannerDivider";
import CirclePointSection from "@/components/home/CirclePointSection";
import FirstSection from "@/components/home/FirstSection";
import GridSection from "@/components/home/GridSection";
import HeroSection from "@/components/home/HeroSection";
import RedBullAnimation3 from "@/components/home/RedBullAnimation3";
import SkydivingStartSection from "@/components/home/SkydivingStartSection";
import SkyViewSection from "@/components/home/SkyViewSection";
import React from "react";

const page = () => {
  return (
    <div className="relative">
      {/* <RedBullAnimation /> */}
      {/* <RedBullAnimtaion2 /> */}
      <FirstSection />
      {/* <RedBullAnimation3 /> */}
      {/* <HeroSection />
      <AboutCan />
      <GridSection />
      <CirclePointSection /> */}
      {/* <SkyViewSection /> */}
      <SkydivingStartSection />
      <BannerDivider />
      {/* <div className="h-dvh bg-amber-600"></div>
      <div className="h-dvh bg-blue-600"></div> */}
    </div>
  );
};

export default page;
