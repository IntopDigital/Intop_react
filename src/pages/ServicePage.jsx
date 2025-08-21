import React from "react";

import Services from "../components/Services";
// import displacementMap from "/images/noise-texture.png";
const ServicePage = () => {
  return (
    <>
      <main className="bg-black text-white">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-6xl font-bold">Welcome</h1>
        </section>

        <Services />

        <section className="h-screen flex items-center justify-center">
          <h1 className="text-4xl">Next Page</h1>
        </section>
      </main>
    </>
  );
};

export default ServicePage;
