"use client";

import React from "react";
import { motion, Variants } from "motion/react";
import { FADE_UP_VARIANT, STAGGER_CONTAINER } from "@/lib/motion";

interface InViewRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  viewportMargin?: string;
  once?: boolean;
}

export function InViewReveal({
  children,
  className = "",
  delay = 0,
  variants = FADE_UP_VARIANT,
  viewportMargin = "-50px",
  once = true,
}: InViewRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function InViewStagger({
  children,
  className = "",
  viewportMargin = "-50px",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      variants={STAGGER_CONTAINER}
      className={className}
    >
      {children}
    </motion.div>
  );
}
export default InViewReveal;
