"use client";
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const missionVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="ml-[calc(calc(16.6666666667vw-11.6666666667px)+10px)]">
      <motion.div
        className="pt-[50px]"
        variants={missionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mt-[50px] mb-[100px] border-b border-primary">
          <h1 className="w-[calc(58.3333333333vw-15.8333333333px)] text-[51px] sm:text-[60px] md:text-[70px] lg:text-[90px] font-bold">
            About us
          </h1>
        </div>
      </motion.div>
      <div>
        <h2 className="text-[50px] font-bold mb-[18px]">Studio</h2>
        <div className="mb-[50px] columns-2 gap-8 w-[calc(50vw-15px)]">
          <p className="text-ellipsis leading-tight">
            Understanding screen printing techniques as a vital form of artistic
            expression, studio simulation focuses on innovative and creative
            printing methods. This approach allows artists to explore various
            substrates, inks, and techniques, such as photopolymer and stencil
            methods, to produce unique, high-quality prints. By simulating
            different printing environments and materials, artists can
            experiment with layering colors, textures, and patterns, thereby
            enhancing their creative process and expanding their artistic
            repertoire.
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-[50px] font-bold mb-[18px]">Vision & Mission</h2>
        <div className="mb-[50px] gap-8 w-[calc(50vw-15px)]">
          <p className="leading-tight">
            Understanding screen printing techniques as a vital form of artistic
            expression, studio simulation focuses on innovative and creative
            printing methods. This approach allows artists to explore various
            substrates, inks, and techniques, such as photopolymer and stencil
            methods, to produce unique, high-quality prints. By simulating
            different printing environments and materials, artists can
            experiment with layering colors, textures, and patterns, thereby
            enhancing their creative process and expanding their artistic
            repertoire.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
