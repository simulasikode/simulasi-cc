"use client";
import { LucideArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

const PrePress: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
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
        staggerChildren: 0.15, // Reduced for a faster cascade
        delayChildren: 0.2, // Initial delay
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

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const listItems = [
    { href: "/prepress/all", text: "All," },
    { href: "/prepress/color", text: "Color," },
    { href: "/prepress/paper", text: "Paper," },
    { href: "/prepress/printing", text: "Printing," },
    { href: "/prepress/tips-and-tricks", text: "Tips & Trick" },
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
              className="text-[9.25px] uppercase"
              variants={linkVariants}
            >
              02
            </motion.p>
            <Link
              href={"/"}
              className="uppercase text-[9.25px] flex group relative"
            >
              <motion.p className="pr-1 relative z-20" variants={linkVariants}>
                View ALL
              </motion.p>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300"></span>
              <motion.span variants={linkVariants}>
                <LucideArrowUpRight size={14} />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
      <div className=" w-[calc(51vw-15px)] ml-[calc(50vw-5px)] mb-[150px] mt-[32px]">
        <motion.h3
          className="text-[51px] sm:text-[60px] md:text-[70px] lg:text-[90px] font-bold leading-[82%]"
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          Prepress
        </motion.h3>
        <motion.ul
          className="flex justify-start space-x-1 mt-[30px] text-[12px]"
          variants={titleVariants} // Apply titleVariants to the ul for stagger effect
          initial="hidden"
          animate={controls}
        >
          {listItems.map((item, index) => (
            <ListItem
              key={index}
              href={item.href}
              text={item.text}
              variants={listItemVariants}
            />
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

interface ListItemProps {
  href: string;
  text: string;
  variants: Variants;
}

const ListItem: React.FC<ListItemProps> = ({ href, text, variants }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.li
      ref={ref}
      className="group relative inline-block"
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <Link href={href} className="relative z-20 group-hover:text-primary">
        {text}
        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300"></span>
      </Link>
    </motion.li>
  );
};

export default PrePress;
