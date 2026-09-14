"use client";

import React from "react";
import { motion } from "motion/react";

interface TextRollProps {
  text: string;
  className?: string;
  highlightClassName?: string;
}

export function TextRoll({
  text,
  className = "",
  highlightClassName = "text-violet-600 dark:text-violet-400",
}: TextRollProps) {
  const letters = Array.from(text);

  return (
    <span className={`inline-flex overflow-hidden cursor-default ${className}`}>
      {letters.map((letter, index) => (
        <span key={index} className="relative inline-block overflow-hidden">
          <motion.span
            initial={{ y: 0 }}
            whileHover={{ y: "-100%" }}
            transition={{
              duration: 0.3,
              ease: [0.33, 1, 0.68, 1],
              delay: index * 0.015,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.33, 1, 0.68, 1],
              delay: index * 0.015,
            }}
            className={`absolute left-0 top-0 inline-block font-bold ${highlightClassName}`}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
export default TextRoll;
