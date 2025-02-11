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
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
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

  return (
    <div ref={ref} className="relative mb-[150px]">
      <div className="mt-[150px]">
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
              Case Studies
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
      <div className="absolute w-[calc(50vw-15px)] ml-[calc(50vw-5px)] mb-[150px]">
        <motion.h1
          className="text-[90px] font-bold leading-[82%]"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          Case Studies
        </motion.h1>
      </div>
    </div>
  );
};

export default CaseStudies;
