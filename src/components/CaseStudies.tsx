import { LucideArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

const CaseStudies: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  const caseStudyTitles = [
    "Project Dragon of sathar: CMYKOGV Screen Printing with waterbase ink — 2024",
    "Project 65lpi Halftone: One color testing screen printing — 2024",
  ];

  return (
    <div ref={ref} className="relative mt-[64px]">
      <div>
        <motion.div
          className="border-t border-primary w-[calc(100vw-20px)] z-2 top-0"
          variants={linkVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="flex justify-between py-2 items-center">
            <motion.p
              className="text-[8.25px] uppercase"
              variants={linkVariants}
            >
              01
            </motion.p>
            <Link
              href={"/"}
              className="uppercase text-[8.25px] flex group relative"
            >
              <motion.p className="pr-1 relative z-20" variants={linkVariants}>
                View ALL
              </motion.p>
              {/* Underline with Tailwind CSS */}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300"></span>
              <motion.span variants={linkVariants}>
                <LucideArrowUpRight size={14} />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
      {/* Removed 'absolute' class and adjusted ml/mr for relative positioning */}
      <div className="w-[calc(50vw-15px)] ml-[calc(50vw-5px)] relative mb-[32px] mt-[32px]">
        <motion.h3
          className="text-[50px] sm:text-[60px] md:text-[70px] lg:text-[90px] font-bold leading-[82%]"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          Case Studies
        </motion.h3>
        <motion.ul
          className="mt-[30px] text-[16px]"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          {caseStudyTitles.map((title, index) => (
            <motion.li
              key={index}
              variants={listItemVariants}
              className="mb-2 text-[12px] leading-tight" // Added margin-bottom for spacing between list items
            >
              {title}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default CaseStudies;
