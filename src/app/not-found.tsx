"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    // Fade-in animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    );

    // Bounce effect for the icon
    gsap.fromTo(
      iconRef.current,
      { y: -10 },
      { y: 10, repeat: -1, yoyo: true, duration: 0.8, ease: "power1.inOut" },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <div className="text-center max-w-md w-full space-y-6">
        <div className="flex justify-center mb-4">
          <AlertTriangle
            ref={iconRef}
            className="w-24 h-24 text-destructive"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-12">
          Oops! The page you are looking for seems to have wandered off into the
          digital wilderness.
        </p>
        <Link href="/" className="mt-6">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
