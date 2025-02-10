"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  // Configuration for Intersection Observers (DRY principle)
  const inViewOptions = {
    triggerOnce: true,
    threshold: 0.2, // Adjust as needed
  };

  const { ref: sectionRef, inView: sectionInView } = useInView(inViewOptions);
  const { ref: textRef, inView: textInView } = useInView({
    ...inViewOptions,
    threshold: 0.3,
  }); // Different threshold for text

  // Ref for tracking scroll
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Parallax Effects (Consider extracting to a separate object or function)
  const parallaxText = useTransform(scrollYProgress, [0, 1], ["0%", "-36%"]);
  const parallaxBg = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const parallaxHeadingY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-15%"],
  ); // Separate Y translation
  const parallaxHeadingOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]); // Fade Out

  // Animation Variants (Centralize for reusability and clarity)
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }, //Unified transition
  };
  const fadeInVariantsOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={scrollRef}>
      <main className="relative pointer-events-auto">
        <div style={{ transform: `translateY(${parallaxBg})` }}>
          <section className="relative top-48 w-full min-h-[100vh] flex flex-col items-center text-center bg-background overflow-hidden">
            <motion.h1
              style={{ y: parallaxHeadingY, opacity: parallaxHeadingOpacity }} // Apply opacity here
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.4 }}
              className="text-3xl sm:text-[75px] leading-[82%] tracking-tighter font-bold"
            >
              MANIFESTING YOUR VISION
              <br />
              <span className="text-primary">INTO VIVID EXPRESSION</span>
            </motion.h1>
            <motion.p
              style={{ opacity: fadeInVariantsOpacity }}
              variants={{ fadeInVariants }}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-2 text-regular text-sm text-muted-foreground max-w-xl"
            >
              Nothing is real, everything is simulation —
              <Link
                href="https://ifunny.co/picture/nothing-is-really-real-it-s-all-a-simulation-wAtezlS5C"
                target="_blank"
                className="hover:underline"
              >
                &quot;internet memes&quot;
              </Link>
            </motion.p>
          </section>
          <div className="sticky bottom-6 left-0 pointer-event">
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              animate={sectionInView ? "visible" : "hidden"}
              transition={{ duration: 0.8, delay: 0.3 }} //Removed redundant transition property, it's defined in variants
              className="text-xs font-regular w-[26.8vw] sm:w-[8.3vw] leading-[92%]"
            >
              screen printing techniques to discover the joy of achievable
              artistic surprises.
            </motion.h2>
          </div>
          <section
            ref={sectionRef}
            className="flex flex-col justify-between items-center min-h-[20vh]"
          >
            <div className="relative w-full ">
              <motion.div
                ref={textRef}
                style={{ y: parallaxText }}
                initial="hidden"
                animate={textInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
                }}
                className="absolute top-0 right-0 w-[62vw] sm:w-[82vw] z-10 "
              >
                <h3 className="text-sm md:text-[22.5px] leading-tight">
                  It is the process of transforming creative ideas into actual
                  designs. That is a transformation in the dynamic world of
                  screen printing. Artists and designers draw inspiration from
                  their visions and use screen printing techniques to realize
                  these concepts. Screen printing allows for vibrant colors and
                  intricate patterns, allowing for a clear representation of
                  artistic expression. By carefully selecting materials and
                  applying various techniques, creators can ensure that the
                  original vision is communicated clearly and effectively
                  through each print. The synergy between the artistry and
                  tactile properties of paper enhances the overall experience,
                  making each piece a unique manifestation of creativity.{" "}
                </h3>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
