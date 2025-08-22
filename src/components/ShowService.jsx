import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceThreeCard } from "./ServiceThreeCard"; // <-- IMPORT THE NEW COMPONENT

// ----- IMPORT YOUR ASSETS -----
import thumb1 from "/images/service1.png";
import thumb2 from "/images/service1.png";
import thumb3 from "/images/service1.png";
import thumb4 from "/images/service1.png";

// ----- SERVICE DATA -----
const servicesData = [
  {
    id: 1,
    title: "Hiring Calculator",
    subtitle: "Gamified Digital Experience",
    thumbnail: thumb1,
    link: "/services/hiring-calculator",
  },
  {
    id: 2,
    title: "RobCo",
    subtitle: "3D Motion",
    thumbnail: thumb2,
    link: "/services/robco",
  },
  {
    id: 3,
    title: "KIKK 2024",
    subtitle: "Branding & Website",
    thumbnail: thumb3,
    link: "/services/kikk-2024",
  },
  {
    id: 4,
    title: "Nikolas Type",
    subtitle: "Website",
    thumbnail: thumb4,
    link: "/services/nikolas-type",
  },
];

gsap.registerPlugin(ScrollTrigger);

const ShowService = () => {
  const componentRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const wrappers = gsap.utils.toArray(".service-card-wrapper");

      gsap.set(wrappers.slice(2), {
        opacity: 0,
        scale: 0,
        yPercent: 100,
      });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: componentRef.current,
          start: "top top",
          end: `+=${(wrappers.length / 2 - 1) * 100}%`,
          pin: true,
          scrub: 1,
          markers: false,
        },
      });

      for (let i = 0; i < wrappers.length; i += 2) {
        const pairToExit = [wrappers[i], wrappers[i + 1]];
        const pairToEnter = [wrappers[i + 2], wrappers[i + 3]];

        if (!pairToEnter[0]) break;

        masterTimeline.to(
          pairToExit,
          {
            yPercent: -100,
            xPercent: (idx) => (idx === 0 ? 55 : -55),
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          i / 2
        );

        masterTimeline.fromTo(
          pairToEnter,
          {
            yPercent: 100,
            scale: 0,
            opacity: 0,
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          i / 2
        );
      }
    }, componentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={componentRef}
      style={{ height: `${(servicesData.length / 2) * 100}vh` }}
    >
      <div className="relative w-screen h-screen overflow-hidden bg-[#c8c3c3] flex justify-center items-end">
        {servicesData.map((service, index) => (
          <div
            key={service.id}
            className="service-card-wrapper absolute"
            style={{
              left: "50%",
              transform: `translateX(${index % 2 === 0 ? "-105%" : "5%"})`,
            }}
          >
            {/* --- USE THE NEW 3D CARD COMPONENT --- */}
            <ServiceThreeCard
              id={service.id}
              title={service.title}
              subtitle={service.subtitle}
              thumbnail={service.thumbnail}
              link={service.link}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowService;
