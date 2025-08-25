// import React, { useRef, useEffect } from "react";
// import { gsap } from "gsap";

// const videoUrl = "/video/sky_loop.mp4";

// const HeroSection = () => {
//   const videoRef = useRef(null);
//   const containerRef = useRef(null);
//   const textRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     const video = videoRef.current;
//     const text = textRef.current;

//     if (!container || !video || !text) return;

//     const handleMouseMove = (e) => {
//       const { clientX, clientY } = e;
//       const { offsetWidth, offsetHeight } = container;

//       const xPercent = (clientX / offsetWidth - 0.5) * 2;
//       const yPercent = (clientY / offsetHeight - 0.5) * 2;

//       // Animate the VIDEO
//       gsap.to(video, {
//         x: -xPercent * 30,
//         y: -yPercent * 30,
//         duration: 0.8,
//         ease: "power3.out",
//       });

//       // Animate the TEXT
//       gsap.to(text, {
//         x: -xPercent * 50,
//         y: -yPercent * 50,
//         duration: 0.8,
//         ease: "power3.out",
//       });
//     };

//     container.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       container.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center font-sans"
//     >
//       {/* Video Background */}
//       <video
//         ref={videoRef}
//         src={videoUrl}
//         autoPlay
//         loop
//         muted
//         playsInline
//         // THE FIX: Increased size and adjusted position to guarantee full coverage
//         className="absolute  w-[110%] h-[110%] object-cover "
//         onError={(e) => console.error("Video failed to load:", e)}
//       >
//         Your browser does not support the video tag.
//       </video>

//       {/* Dark Overlay */}
//       {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}

//       {/* Text Overlay */}
//       <div ref={textRef} className="relative z-10 text-center text-white p-4">
//         <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
//           <span className="block drop-shadow-lg">Click.</span>
//           <span className="block drop-shadow-lg mt-2 md:mt-4">Connect.</span>
//           <span className="block drop-shadow-lg mt-2 md:mt-4 text-cyan-400">
//             Convert.
//           </span>
//         </h1>
//         <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-300 drop-shadow-md">
//           Engage your audience with interactive video experiences.
//         </p>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const videoUrl = "/video/sky_loop.mp4";

const HeroSection = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const text = textRef.current;

    if (!container || !video || !text) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = container;

      const xPercent = (clientX / offsetWidth - 0.5) * 2;
      const yPercent = (clientY / offsetHeight - 0.5) * 2;

      // Animate the VIDEO (translate + scale)
      gsap.to(video, {
        x: -xPercent * 40,
        y: -yPercent * 40,
        scale: 1.2, // zoom in to always cover edges
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate the TEXT
      gsap.to(text, {
        x: -xPercent * 50,
        y: -yPercent * 50,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center font-sans"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-[130%] h-[130%] object-cover" // extra size for coverage
        onError={(e) => console.error("Video failed to load:", e)}
      >
        Your browser does not support the video tag.
      </video>

      {/* Text Content */}
      <div ref={textRef} className="relative z-10 text-center text-white p-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="block drop-shadow-lg">Click.</span>
          <span className="block drop-shadow-lg mt-2 md:mt-4">Connect.</span>
          <span className="block drop-shadow-lg mt-2 md:mt-4 text-cyan-400">
            Convert.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-300 drop-shadow-md">
          Engage your audience with interactive video experiences.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
