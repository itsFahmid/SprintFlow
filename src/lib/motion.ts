import { Transition, Variants } from "motion/react";

/**
 * Standard Spring Physics Presets
 */
export const SPRING_TRANSITIONS = {
  // Snappy for buttons, micro-interactions, toggles
  snappy: { type: "spring", stiffness: 450, damping: 30 } as Transition,
  
  // Smooth for modals, dialogs, drawers, cards
  smooth: { type: "spring", stiffness: 320, damping: 26 } as Transition,
  
  // Gentle for page transitions, soft reveals, large surfaces
  gentle: { type: "spring", stiffness: 200, damping: 22 } as Transition,
  
  // Bouncy / Playful for rewards, achievements, celebratory toasts
  bouncy: { type: "spring", stiffness: 400, damping: 14, mass: 0.8 } as Transition,

  // Ease curves
  easeOutCubic: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } as Transition,
  easeInOutCubic: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } as Transition,
};

/**
 * Standard Animation Variants
 */
export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const STAGGER_FAST: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const FADE_UP_VARIANT: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const FADE_IN_VARIANT: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
};

export const SCALE_IN_VARIANT: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const MODAL_BACKDROP_VARIANT: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const DRAWER_RIGHT_VARIANT: Variants = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 320, damping: 30 },
  },
  exit: {
    x: "100%",
    opacity: 0.8,
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
};
