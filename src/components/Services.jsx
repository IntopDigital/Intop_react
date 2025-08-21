import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceCard } from "./ServiceCard";

// ----- IMPORT YOUR ASSETS -----
import thumb1 from "/images/service1.png";
import video1 from "/video/effortel.mp4";
import thumb2 from "/images/service1.png";
import video2 from "/video/effortel.mp4";
import thumb3 from "/images/service1.png";
import video3 from "/video/effortel.mp4";
import thumb4 from "/images/service1.png";
import video4 from "/video/effortel.mp4";

// ----- SERVICE DATA -----
const servicesData = [
  {
    id: 1,
    title: "Hiring Calculator",
    subtitle: "Gamified Digital Experience",
    thumbnail: thumb1,
    video: video1,
    link: "/services/hiring-calculator",
  },
  {
    id: 2,
    title: "RobCo",
    subtitle: "3D Motion",
    thumbnail: thumb2,
    video: video2,
    link: "/services/robco",
  },
  {
    id: 3,
    title: "KIKK 2024",
    subtitle: "Branding & Website",
    thumbnail: thumb3,
    video: video3,
    link: "/services/kikk-2024",
  },
  {
    id: 4,
    title: "Nikolas Type",
    subtitle: "Website",
    thumbnail: thumb4,
    video: video4,
    link: "/services/nikolas-type",
  },
  // Add more pairs here for a longer animation
];

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const componentRef = useRef(null);

  useEffect(() => {
    // Set up the GSAP context for safe cleanup
    let ctx = gsap.context(() => {
      // Use GSAP's utility function to select all the card wrappers
      const wrappers = gsap.utils.toArray(".service-card-wrapper");

      // Set initial state for all wrappers except the first pair
      gsap.set(wrappers.slice(2), {
        opacity: 0,
        scale: 0,
        yPercent: 100,
      });

      // Create a master timeline that is controlled by the scrollbar
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: componentRef.current,
          start: "top top",
          // Calculate end based on the number of transitions
          end: `+=${(wrappers.length / 2 - 1) * 100}%`,
          pin: true,
          scrub: 1, // Smoothly links the animation to the scrollbar
          markers: true, // Set to false for production
        },
      });

      // Loop through each pair to create the animation sequence
      for (let i = 0; i < wrappers.length; i += 2) {
        const pairToExit = [wrappers[i], wrappers[i + 1]];
        const pairToEnter = [wrappers[i + 2], wrappers[i + 3]];

        // Stop if there's no next pair to animate in
        if (!pairToEnter[0]) break;

        // --- EXIT ANIMATION ---
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
          i / 2 // Position in the master timeline
        );

        // --- ENTER ANIMATION ---
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
          i / 2 // Start at the same time as the exit animation
        );
      }
    }, componentRef);

    // Cleanup function to revert all GSAP animations
    return () => ctx.revert();
  }, []);

  return (
    // The trigger element needs to have enough height to accommodate the scroll
    <div
      ref={componentRef}
      style={{ height: `${(servicesData.length / 2) * 100}vh` }}
    >
      <div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a] flex justify-center items-end">
        {servicesData.map((service, index) => (
          <div
            key={service.id}
            // This is the wrapper that we are now targeting correctly
            className="service-card-wrapper absolute"
            style={{
              left: "50%",
              // This sets the initial side-by-side position
              transform: `translateX(${index % 2 === 0 ? "-105%" : "5%"})`,
            }}
          >
            <ServiceCard
              id={service.id}
              title={service.title}
              subtitle={service.subtitle}
              thumbnail={service.thumbnail}
              video={service.video}
              link={service.link}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
