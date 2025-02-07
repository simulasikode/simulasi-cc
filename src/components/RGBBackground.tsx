"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { throttle } from "lodash";
import gsap from "gsap";

const MOUSE_THROTTLE = 40;
const MAX_MOVEMENT = 60;

const calculateRGBValues = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const xRatio = x / width;
  const yRatio = y / height;

  return {
    red: Math.min(255, Math.abs(yRatio * 300)),
    green: Math.min(255, Math.abs((1 - yRatio) * 300)),
    blue: Math.min(255, Math.abs(xRatio * 300)),
  };
};

const RGBBackground = () => {
  const rgbRef = useRef<SVGSVGElement | null>(null);
  const latestPosition = useRef({ x: 0, y: 0 });
  const windowSize = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rgbValues = useMemo(
    () =>
      calculateRGBValues(
        mousePosition.x,
        mousePosition.y,
        windowSize.current.width,
        windowSize.current.height,
      ),
    [mousePosition],
  );

  const throttledMouseMove = useMemo(
    () =>
      throttle((event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });

        if (rgbRef.current) {
          const dx = (event.clientX - windowSize.current.width / 2) * 0.03;
          const dy = (event.clientY - windowSize.current.height / 2) * 0.03;

          latestPosition.current.x = Math.max(
            -MAX_MOVEMENT,
            Math.min(MAX_MOVEMENT, latestPosition.current.x + dx),
          );
          latestPosition.current.y = Math.max(
            -MAX_MOVEMENT,
            Math.min(MAX_MOVEMENT, latestPosition.current.y + dy),
          );

          gsap.to(rgbRef.current, {
            x: latestPosition.current.x,
            y: latestPosition.current.y,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      }, MOUSE_THROTTLE),
    [],
  );
  useEffect(() => {
    window.addEventListener("mousemove", throttledMouseMove);
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [throttledMouseMove]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none blur-3xl">
      <svg
        ref={rgbRef}
        className="relative inset-0 w-full h-full"
        viewBox="-50 -50 700 700"
        aria-hidden="true"
        style={{ willChange: "transform" }}
      >
        <circle
          cx="150"
          cy="250"
          r="250"
          fill={`rgb(${rgbValues.red}, 100, 100)`}
          opacity="0.7"
          style={{ mixBlendMode: "screen" }}
        />
        <circle
          cx="400"
          cy="250"
          r="250"
          fill={`rgb(100, ${rgbValues.green}, 100)`}
          opacity="0.7"
          style={{ mixBlendMode: "screen" }}
        />
        <circle
          cx="275"
          cy="400"
          r="250"
          fill={`rgb(100, 100, ${rgbValues.blue})`}
          opacity="0.7"
          style={{ mixBlendMode: "screen" }}
        />
      </svg>
    </div>
  );
};

export default RGBBackground;
