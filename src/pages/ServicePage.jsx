import React from "react";

import ShowService from "../components/ShowService";

const ServicePage = () => {
  return (
    <>
      <main className="bg-black text-white">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-6xl font-bold">Welcome</h1>
        </section>

        <ShowService />

        <section className="h-screen flex items-center justify-center">
          <h1 className="text-4xl">Next Page</h1>
        </section>
      </main>
    </>
  );
};

export default ServicePage;
