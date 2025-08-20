import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

// --- Configuration ---
// Set the total number of images in your sequence
const getTotalFrames = () => 70;

const getImageUrl = (frame) => {
  // Pad the frame number with leading zeros to a total of 4 digits.
  const paddedFrame = String(frame).padStart(4, "0");

  // This assumes your images are in the `public/intop_logo/` directory.
  return `/intop_logo/frame_${paddedFrame}-Photoroom.png`;
};

// --- Fallback Image ---
const fallbackImageUrl = "/images/Intop-logo.png"; // Path to your fallback logo

const IntopLogoAnimate = () => {
  const canvasRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // State to hold the aspect ratio of the loaded images
  const [imageAspectRatio, setImageAspectRatio] = useState(null);

  // --- 1. Image Preloading Effect ---
  useEffect(() => {
    const totalFrames = getTotalFrames();
    const urls = Array.from({ length: totalFrames }, (_, i) =>
      getImageUrl(i + 1)
    );
    const imagePromises = [];

    urls.forEach((url) => {
      const promise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.error(
            `Failed to load image: ${url}. Make sure it's in the public folder.`
          );
          resolve(null);
        };
        img.src = url;
      });
      imagePromises.push(promise);
    });

    Promise.all(imagePromises).then((images) => {
      const validImages = images.filter((img) => img !== null);
      setLoadedImages(validImages);

      // After loading, calculate the aspect ratio from the first image
      if (validImages.length > 0) {
        const firstImage = validImages[0];
        setImageAspectRatio(firstImage.naturalWidth / firstImage.naturalHeight);
      }
      setIsLoading(false);
    });
  }, []);

  // --- 2. Canvas Animation Effect ---
  useEffect(() => {
    // Wait until images are loaded.
    if (isLoading || loadedImages.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const frameState = { frame: 0 };
    const totalFrames = loadedImages.length;

    const render = () => {
      if (loadedImages.length === 0 || !canvas) return;

      const currentFrame = Math.floor(frameState.frame);
      const imageToDraw = loadedImages[currentFrame];

      if (imageToDraw) {
        const parent = canvas.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        // Clear the canvas
        context.clearRect(0, 0, parentWidth, parentHeight);

        // Draw the image to fit the canvas perfectly
        context.drawImage(imageToDraw, 0, 0, parentWidth, parentHeight);
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      context.scale(dpr, dpr);

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      render();
    };

    const tween = gsap.to(frameState, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      duration: totalFrames / 30,
      repeat: -1,
      onUpdate: render,
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      tween.kill();
    };
  }, [isLoading, loadedImages]);

  // Define the container style based on the calculated aspect ratio
  const containerStyle = {
    width: "200px",
    height: imageAspectRatio ? `${200 / imageAspectRatio}px` : "200px",
  };

  return (
    <div className="relative overflow-hidden" style={containerStyle}>
      {/* --- UPDATED SECTION --- */}
      {/* Show fallback image while loading */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800">
          <img
            src={fallbackImageUrl}
            alt="Loading Logo"
            className="max-w-full max-h-full"
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default IntopLogoAnimate;
