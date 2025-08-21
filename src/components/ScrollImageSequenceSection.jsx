// import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // Register the GSAP ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// const ScrollImageSequenceSection = () => {
//   const sectionRef = useRef(null);
//   const canvasRef = useRef(null);

//   // --- CONFIGURATION ---
//   const totalFrames = 200;
//   const imagePath = "/sky_to_space/"; // Folder in your `public` directory
//   const imageName = "sky to space trasnsition_00"; // Make sure the base name is correct
//   const imageExtension = ".jpg";

//   const [loadedImages, setLoadedImages] = useState([]);
//   const [imagesLoaded, setImagesLoaded] = useState(false);

//   // 1. Generate and preload all the images
//   useEffect(() => {
//     const framePaths = [];
//     // Loop from 1 to totalFrames to generate image paths
//     for (let i = 1; i <= totalFrames; i++) {
//       // Pad the frame number with leading zeros (e.g., 1 -> "001")
//       const frameNumber = String(i).padStart(3, "0");
//       framePaths.push(
//         `${imagePath}${imageName}${frameNumber}${imageExtension}`
//       );
//     }

//     const preloadImages = async () => {
//       const promises = framePaths.map((src) => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.src = src;
//           img.onload = () => resolve(img); // Resolve with the loaded image object
//           img.onerror = () => reject(`Failed to load image: ${src}`);
//         });
//       });

//       try {
//         const loaded = await Promise.all(promises);
//         setLoadedImages(loaded); // Store the actual image objects
//         setImagesLoaded(true);
//         console.log("All images loaded successfully!");
//       } catch (error) {
//         console.error("Error preloading images:", error);
//       }
//     };

//     preloadImages();
//   }, [totalFrames, imagePath, imageName, imageExtension]); // Dependencies for useEffect

//   // 2. Set up the GSAP animation once images are loaded
//   useLayoutEffect(() => {
//     // Ensure all necessary elements and data are ready before setting up the animation
//     if (
//       !imagesLoaded ||
//       !sectionRef.current ||
//       !canvasRef.current ||
//       loadedImages.length === 0
//     ) {
//       return;
//     }

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     canvas.width = 1920;
//     canvas.height = 1080;

//     // Draw the first frame on the canvas initially
//     context.drawImage(loadedImages[0], 0, 0);

//     // This object will be animated by GSAP to control the current frame
//     const frameData = { frame: 0 };

//     // Create the main GSAP timeline
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: sectionRef.current,
//         start: "top top", // Animation starts when the top of the section hits the top of the viewport
//         end: "+=4000", // The scroll distance over which the animation occurs
//         scrub: 0.8, // Smoothly links the animation progress to the scrollbar position
//         pin: true, // Pins the section while the animation is active
//       },
//     });

//     // Add the image sequence animation to the timeline
//     tl.to(frameData, {
//       frame: totalFrames - 1, // Animate from frame 0 to the last frame
//       snap: "frame", // Snaps to whole numbers to ensure we get valid frame indices
//       ease: "none",
//       onUpdate: () => {
//         // This function is called every time the animation updates
//         const currentFrame = Math.round(frameData.frame);
//         const image = loadedImages[currentFrame];
//         if (image) {
//           // Clear the canvas and draw the new frame
//           context.clearRect(0, 0, canvas.width, canvas.height);
//           context.drawImage(image, 0, 0);
//         }
//       },
//     });

//     // Cleanup function to kill the timeline and ScrollTrigger instance on component unmount
//     return () => {
//       if (tl) {
//         const st = tl.scrollTrigger;
//         if (st) st.kill();
//         tl.kill();
//       }
//     };
//   }, [imagesLoaded, loadedImages, totalFrames]); // Dependencies for useLayoutEffect

//   return (
//     <section
//       ref={sectionRef}
//       className="h-screen relative flex items-center justify-center"
//     >
//       {/* Loading Indicator */}
//       {!imagesLoaded && (
//         <div className="text-white text-2xl font-mono absolute z-20">
//           Loading Sequence...
//         </div>
//       )}

//       {/* Canvas for rendering the image sequence */}
//       <canvas
//         ref={canvasRef}
//         className="absolute top-0 left-0 w-full h-full"
//         style={{ visibility: imagesLoaded ? "visible" : "hidden" }}
//       />
//     </section>
//   );
// };

// export default ScrollImageSequenceSection;

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ScrollImageSequenceSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  // NEW: Ref for the text container
  const textContainerRef = useRef(null);

  // --- CONFIGURATION ---
  const totalFrames = 200;
  const imagePath = "/sky_transitin/"; // Folder in your `public` directory
  const imageName = "syy to space02g_00"; // Make sure the base name is correct
  const imageExtension = ".jpg";

  const [loadedImages, setLoadedImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 1. Preload all the images
  useEffect(() => {
    const framePaths = [];
    for (let i = 30; i <= totalFrames; i++) {
      const frameNumber = String(i).padStart(3, "0");
      framePaths.push(
        `${imagePath}${imageName}${frameNumber}${imageExtension}`
      );
    }

    const preloadImages = async () => {
      const promises = framePaths.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => reject(`Failed to load image: ${src}`);
        });
      });

      try {
        const loaded = await Promise.all(promises);
        setLoadedImages(loaded);
        setImagesLoaded(true);
        console.log("All images loaded successfully!");
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadImages();
  }, [totalFrames, imagePath, imageName, imageExtension]);

  // 2. Set up the GSAP animation once images are loaded
  useLayoutEffect(() => {
    if (
      !imagesLoaded ||
      !sectionRef.current ||
      !canvasRef.current ||
      !textContainerRef.current || // NEW: Ensure text container is ready
      loadedImages.length === 0
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 1920;
    canvas.height = 1080;

    context.drawImage(loadedImages[0], 0, 0);

    const frameData = { frame: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=4000",
        scrub: 0.8,
        pin: true,
      },
    });

    // Animate the image sequence and text together on update
    tl.to(frameData, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      onUpdate: () => {
        // 1. Draw the current image frame
        const currentFrame = Math.round(frameData.frame);
        const image = loadedImages[currentFrame];
        if (image) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0);
        }

        // --- NEW: FRAME-BASED TEXT ANIMATION ---

        // Define the frame ranges for the animation
        const appearStartFrame = 60; // Start animating in at frame 60
        const appearEndFrame = 80; // Fully visible at frame 80
        const disappearStartFrame = 81; // Start animating out at frame 81
        const disappearEndFrame = 105; // Fully hidden at frame 105

        let progress = 0;

        if (
          currentFrame >= appearStartFrame &&
          currentFrame <= appearEndFrame
        ) {
          // Calculate the progress of the "appear" animation (0 to 1)
          progress = gsap.utils.mapRange(
            appearStartFrame,
            appearEndFrame,
            0,
            1,
            currentFrame
          );
        } else if (
          currentFrame > appearEndFrame &&
          currentFrame < disappearStartFrame
        ) {
          // Hold the fully visible state
          progress = 1;
        } else if (
          currentFrame >= disappearStartFrame &&
          currentFrame <= disappearEndFrame
        ) {
          // Calculate the progress of the "disappear" animation (1 to 0)
          progress = gsap.utils.mapRange(
            disappearStartFrame,
            disappearEndFrame,
            1,
            0,
            currentFrame
          );
        }

        // Apply the animation to the text container using the calculated progress
        gsap.set(textContainerRef.current, {
          opacity: progress,
          scale: 0.5 + progress * 0.5, // Animate scale from 0.5 to 1 and back
        });
      },
    });

    return () => {
      if (tl) {
        const st = tl.scrollTrigger;
        if (st) st.kill();
        tl.kill();
      }
    };
  }, [imagesLoaded, loadedImages, totalFrames]);

  return (
    <section
      ref={sectionRef}
      className="h-screen relative flex items-center justify-center overflow-hidden"
    >
      {/* Loading Indicator */}
      {!imagesLoaded && (
        <div className="text-white text-2xl font-mono absolute z-20">
          Loading Sequence...
        </div>
      )}

      {/* Canvas for rendering the image sequence */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ visibility: imagesLoaded ? "visible" : "hidden" }}
      />

      {/* NEW: Text Container for Animation */}
      <div
        ref={textContainerRef}
        className="absolute z-10 flex flex-col items-center justify-center text-white font-bold opacity-0 text-5xl md:text-7xl text-3d-hero"
        style={{ willChange: "transform, opacity" }}
      >
        {/* This is the top line */}
        <h3 className="text-3d-hero">Click</h3>

        {/* This container holds the bottom line */}
        <div className="flex flex-row gap-x-4 md:gap-x-8 text-3d-hero">
          <span>Connect</span>
          <span>Convert</span>
        </div>
      </div>
    </section>
  );
};

export default ScrollImageSequenceSection;
