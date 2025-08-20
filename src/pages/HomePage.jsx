import React from "react";
import ScrollImageSequenceSection from "../components/ScrollImageSequenceSection";
import LiquidTextEffect from "../components/LiquidTextEffect";

const HomePage = () => {
  return (
    <>
      <ScrollImageSequenceSection />
      <div className="w-full h-[100vh] bg-blue-300">
        <h1>this is next page</h1>
        <LiquidTextEffect />
      </div>
    </>
  );
};

export default HomePage;
