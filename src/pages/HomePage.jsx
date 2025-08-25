import React from "react";
import ScrollImageSequenceSection from "../components/ScrollImageSequenceSection";

import ServicePage from "./ServicePage";
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      {/* <ScrollImageSequenceSection /> */}
      <div className="w-full h-[100vh] bg-blue-300">
        <h1>this is next page</h1>
      </div>
      <ServicePage />
    </>
  );
};

export default HomePage;
