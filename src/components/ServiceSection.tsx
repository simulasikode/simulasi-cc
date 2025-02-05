"use client"; // Required for GSAP in Next.js App Router

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    title: "Custom Screen Printing",
    description:
      "High-quality prints on paper, fabric, and specialty surfaces.",
    icon: "🎨",
  },
  {
    title: "Limited Edition Prints",
    description: "Exclusive artist collaborations and fine art editions.",
    icon: "🖼️",
  },
  {
    title: "Merch Production",
    description:
      "Screen-printed apparel and branded merchandise for businesses.",
    icon: "👕",
  },
];

const ServiceSection = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!cardRefs.current.length) return;

    cardRefs.current.forEach((card) => {
      if (!card) return; // Ensure the element exists

      gsap.set(card, { scale: 1 });

      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });

    return () => {
      // Clean up event listeners
      cardRefs.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mouseenter", () => {});
          card.removeEventListener("mouseleave", () => {});
        }
      });
    };
  }, []);

  return (
    <section className="w-full py-12 px-6 sm:px-12 bg-background">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Our Services
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-2">
          High-quality screen printing, custom prints, and limited edition
          artwork for artists, brands, and businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className="p-6 bg-card rounded-lg shadow-md flex flex-col items-start cursor-pointer transition-all"
          >
            <div className="text-primary text-4xl">{service.icon}</div>
            <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/contact"
          className="px-6 py-3 text-lg font-medium bg-primary text-background rounded-lg hover:opacity-90 transition"
        >
          Get a Custom Print
        </Link>
      </div>
    </section>
  );
};

export default ServiceSection;
