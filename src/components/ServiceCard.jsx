// import React, { useRef, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import * as PIXI from "pixi.js";
// import { gsap } from "gsap";

// // For the desired effect, a smoother, more subtle noise texture works best.
// // You can search for "perlin noise" or "simplex noise" textures.
// import displacementMap from "/images/noise-texture.png";

// export const ServiceCard = ({
//   id,
//   title,
//   subtitle,
//   thumbnail,
//   video, // Video is kept for potential future use, but not played on hover now
//   link,
//   position,
// }) => {
//   const pixiContainer = useRef(null);
//   const cardLinkRef = useRef(null);
//   const appRef = useRef(null);
//   const imageSpriteRef = useRef(null);

//   useEffect(() => {
//     if (appRef.current || !pixiContainer.current) {
//       return;
//     }

//     const container = pixiContainer.current;
//     const cardLink = cardLinkRef.current;
//     let handleMouseMove = null;

//     const initPixi = async () => {
//       const app = new PIXI.Application();
//       await app.init({
//         width: 600, // Adjusted for a more modern aspect ratio
//         height: 400,
//         backgroundColor: 0x111111,
//         autoStart: false,
//       });

//       appRef.current = app;
//       container.appendChild(app.canvas);

//       // --- Main Image Sprite ---
//       const texture = PIXI.Texture.from(thumbnail);
//       const imageSprite = new PIXI.Sprite(texture);
//       imageSprite.width = app.screen.width * 1.1; // Make image slightly larger for parallax
//       imageSprite.height = app.screen.height * 1.1;
//       imageSprite.anchor.set(0.5);
//       imageSprite.position.set(app.screen.width / 2, app.screen.height / 2);
//       app.stage.addChild(imageSprite);
//       imageSpriteRef.current = imageSprite; // Store ref for parallax effect

//       // --- Subtle Continuous Distortion ---
//       const displacementSprite = PIXI.Sprite.from(displacementMap);
//       displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
//       const displacementFilter = new PIXI.DisplacementFilter(
//         displacementSprite
//       );
//       displacementFilter.padding = 10;
//       // Set a small, constant scale for a gentle, continuous warp
//       displacementFilter.scale.x = 10;
//       displacementFilter.scale.y = 10;
//       app.stage.addChild(displacementSprite);
//       app.stage.filters = [displacementFilter];

//       // --- Parallax Hover Effect ---
//       handleMouseMove = (e) => {
//         const rect = cardLink.getBoundingClientRect();
//         // Calculate mouse position from -1 to 1 relative to the card's center
//         const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
//         const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

//         // Animate the image sprite for parallax
//         gsap.to(imageSpriteRef.current.position, {
//           duration: 1,
//           x: app.screen.width / 2 - x * 20, // Move image opposite to cursor
//           y: app.screen.height / 2 - y * 20,
//           ease: "power2.out",
//         });

//         // Animate the whole card for a subtle lift effect
//         gsap.to(cardLink, {
//           duration: 1,
//           rotationY: x * 5, // Tilt based on mouse position
//           rotationX: -y * 5,
//           ease: "power2.out",
//         });
//       };

//       const handleMouseLeave = () => {
//         // Animate back to center on mouse leave
//         gsap.to(imageSpriteRef.current.position, {
//           duration: 1,
//           x: app.screen.width / 2,
//           y: app.screen.height / 2,
//           ease: "power2.out",
//         });
//         gsap.to(cardLink, {
//           duration: 1,
//           rotationY: 0,
//           rotationX: 0,
//           ease: "power2.out",
//         });
//       };

//       cardLink.addEventListener("mousemove", handleMouseMove);
//       cardLink.addEventListener("mouseleave", handleMouseLeave);

//       app.ticker.add(() => {
//         // Slowly move the displacement map for a constant gentle ripple
//         displacementSprite.x += 0.5;
//         displacementSprite.y += 0.5;
//       });

//       app.start();
//     };

//     initPixi();

//     return () => {
//       if (cardLink && handleMouseMove) {
//         cardLink.removeEventListener("mousemove", handleMouseMove);
//       }
//       if (appRef.current) {
//         appRef.current.destroy(true, {
//           children: true,
//           texture: true,
//           baseTexture: true,
//         });
//         appRef.current = null;
//       }
//     };
//   }, [thumbnail]);

//   return (
//     <div
//       id={`service-card-${id}`}
//       className="absolute opacity-0" // Initial state is invisible, GSAP will handle entry
//       style={{ willChange: "transform" }}
//     >
//       <Link
//         ref={cardLinkRef}
//         to={link}
//         className="group block"
//         style={{ transformStyle: "preserve-3d" }} // Necessary for 3D rotations
//       >
//         <div
//           className="rounded-lg overflow-hidden relative shadow-2xl w-[600px] h-[400px]"
//           ref={pixiContainer}
//         ></div>
//         <div className="mt-4">
//           <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
//           <p className="text-gray-400">{subtitle}</p>
//         </div>
//       </Link>
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export const ServiceCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  video,
  link,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // This effect handles playing and pausing the video
  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to the start
    }
  }, [isHovered]);

  return (
    <div id={`service-card-${id}`} className="w-[650px] flex-shrink-0">
      <Link
        to={link}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Container for the media (image and video) */}
        <div className="w-full h-[350px] rounded-lg overflow-hidden relative bg-gray-800">
          {/* Thumbnail Image */}
          <img
            src={thumbnail}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Video */}
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {/* Text content below the media */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
          <p className="text-gray-400">{subtitle}</p>
        </div>
      </Link>
    </div>
  );
};
