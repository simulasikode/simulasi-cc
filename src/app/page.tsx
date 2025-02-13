"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const CaseStudies = dynamic(() => import("@/components/CaseStudies"), {
  ssr: false,
});

const PrePress = dynamic(() => import("@/components/PrePress"), {
  ssr: false,
});

// Custom hook for intersection observer
const useSectionInView = (threshold = 0.5) => {
  // Removed console logs for brevity
  if (threshold < 0 || threshold > 1 || isNaN(threshold)) {
    console.error("Invalid threshold value:", threshold);
    threshold = 0.5;
  }

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  });

  return { ref, inView };
};

// Custom hook for parallax effect
const useParallax = (inputRange = [0, 1], outputRange = ["0%", "-10%"]) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const parallaxValue = useTransform(scrollYProgress, inputRange, outputRange);

  return { ref, parallaxValue };
};

// Reusable Hero Section Component
const HeroSection = () => {
  const { ref: heroRef, parallaxValue: parallaxHeadingY } = useParallax(
    [0, 1],
    ["0%", "-15%"],
  );
  const { parallaxValue: parallaxHeadingOpacity } = useParallax(
    [0, 0.5],
    ["1", "0"],
  );
  const { ref: parallaxRef, parallaxValue: parallaxBg } = useParallax();

  return (
    <div ref={parallaxRef} style={{ transform: `translateY(${parallaxBg})` }}>
      <section className="relative top-48 w-full min-h-[100vh] flex flex-col items-center text-center bg-background overflow-hidden px-4 md:px-8 lg:px-16">
        <motion.h1
          ref={heroRef}
          style={{ y: parallaxHeadingY, opacity: parallaxHeadingOpacity }}
          // Removed initial and animate, relying on style for initial state
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[75px] leading-[82%] tracking-tighter font-bold"
        >
          MANIFESTING YOUR VISION
          <br />
          <span className="text-primary">INTO VIVID EXPRESSION</span>
        </motion.h1>
        <motion.p
          style={{ opacity: parallaxHeadingOpacity }}
          // Removed initial and animate
          className="mt-2 text-regular text-sm text-muted-foreground max-w-xl"
        >
          Nothing is real, everything is simulation —
          <Link
            href="https://ifunny.co/picture/nothing-is-really-real-it-s-all-a-simulation-wAtezlS5C"
            target="_blank"
            className="hover:underline"
          >
            &qout;internet memes&quot;
          </Link>
        </motion.p>
      </section>
    </div>
  );
};

// Reusable Text Section Component
const TextSection = () => {
  const { ref: textSectionRef, inView: textSectionInView } =
    useSectionInView(0.3);
  const { ref: textRef, parallaxValue: parallaxText } = useParallax(
    [0, 1],
    ["0%", "-36%"],
  );

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section
      ref={textSectionRef}
      className="flex flex-col justify-between items-center min-h-[38vh] px-4 md:px-8 lg:px-16"
    >
      <div className="relative w-full">
        <motion.div
          ref={textRef}
          style={{ y: parallaxText }}
          initial="hidden"
          animate={textSectionInView ? "visible" : "hidden"}
          variants={fadeInVariants}
          className="absolute top-0 right-0 w-[67vw] sm:w-[60vw] md:w-[72vw] lg:w-[50vw] xl:w-[78vw] z-10"
        >
          <h3 className="text-sm md:text-lg lg:text-xl leading-tight">
            It is the process of transforming creative ideas into actual
            designs. That is a transformation in the dynamic world of screen
            printing. Artists and designers draw inspiration from their visions
            and use screen printing techniques to realize these concepts. Screen
            printing allows for vibrant colors and intricate patterns, allowing
            for a clear representation of artistic expression. By carefully
            selecting materials and applying various techniques, creators can
            ensure that the original vision is communicated clearly and
            effectively through each print. The synergy between the artistry and
            tactile properties of paper enhances the overall experience, making
            each piece a unique manifestation of creativity.{" "}
          </h3>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  const { ref: scrollRef } = useSectionInView(0.1);
  const { ref: screenPrintingTextRef, inView: screenPrintingTextInView } =
    useSectionInView(0.4);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div ref={scrollRef}>
      <main className="relative pointer-events-auto">
        <HeroSection />
        <div className="sticky bottom-6 left-0 pointer-event">
          <motion.h2
            ref={screenPrintingTextRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={screenPrintingTextInView ? "visible" : "hidden"}
            className="text-xs font-regular w-[20.4vw] sm:w-[7.3vw] leading-[92%]"
          >
            screen printing techniques to discover the joy of achievable
            artistic surprises.
          </motion.h2>
        </div>
        <TextSection />
        {/* Keep your other components as needed */}
        <CaseStudies />
        <PrePress />
      </main>
    </div>
  );
}
