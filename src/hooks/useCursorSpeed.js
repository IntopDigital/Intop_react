// /src/hooks/useCursorSpeed.js

import { useState, useEffect, useRef } from "react";

export const useCursorSpeed = () => {
  const [speed, setSpeed] = useState(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const animationFrameId = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      cancelAnimationFrame(animationFrameId.current);

      animationFrameId.current = requestAnimationFrame(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime.current;

        if (deltaTime > 16) {
          // Update roughly every frame
          const currentPosition = { x: event.clientX, y: event.clientY };
          const deltaX = currentPosition.x - lastPosition.current.x;
          const deltaY = currentPosition.y - lastPosition.current.y;

          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const currentSpeed = distance / deltaTime;

          // Use a clamp and some smoothing
          const smoothedSpeed = Math.min(Math.max(currentSpeed * 10, 0), 20);
          setSpeed(smoothedSpeed);

          lastPosition.current = currentPosition;
          lastTime.current = currentTime;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return speed;
};
