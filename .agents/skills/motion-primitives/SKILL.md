---
name: motion-primitives
description: Use when designing, building, animating, or polishing interactive UI components using Motion Primitives, Framer Motion (motion/react), and Tailwind CSS. Covers component catalog (Text Roll, Morphing Dialog, Spotlight, Tilt, Tabs, Magnetic, etc.), animation tokens, spring physics, layout animations, gestures, performance optimization, and accessibility.
version: 1.0.0
license: MIT
---

# Motion Primitives Skill

This skill provides comprehensive instructions, patterns, and component recipes for building agency-grade, fluid, accessible, and high-performance animated UI interfaces with **Motion Primitives**, **Framer Motion** (`motion/react`), and **Tailwind CSS**.

---

## 1. Core Principles

1. **Purpose-Driven Motion**:
   - Animation must serve a UX purpose: explain hierarchy, provide tactile feedback, guide attention, or maintain spatial continuity.
   - Avoid gratuitous, noisy animations that distract or cause cognitive overload.

2. **Performance First**:
   - Only animate compositor properties (`transform`: `scale`, `translate`, `rotate` and `opacity`).
   - Never animate layout properties continuously (`width`, `height`, `top`, `left`, `margin`, `padding`).
   - Restrict blur filters to small values ($\le 8\text{px}$) and short, one-time transitions.
   - Clean up event listeners and intervals; use `will-change` sparingly and only during active transitions.

3. **Restraint & Polish**:
   - Use natural spring physics with gentle damping rather than exaggerated bounce for serious product UI.
   - Keep interaction responses fast ($120\text{ms} - 250\text{ms}$).

4. **Accessibility (`prefers-reduced-motion`)**:
   - Always honor user motion preferences. Provide zero-duration or instant opacity-only transitions when `useReducedMotion()` is active.

---

## 2. Quick Setup & Installation

### Dependency Installation
For modern React 19 / Next.js 15+ projects:
```bash
npm install motion
# or
npm install framer-motion clsx tailwind-merge
```

### CLI Component Adder
Add official Motion Primitives components directly via CLI:
```bash
npx motion-primitives@latest add <component-name>
# Examples:
# npx motion-primitives@latest add dialog
# npx motion-primitives@latest add text-roll
# npx motion-primitives@latest add spotlight
# npx motion-primitives@latest add magnetic
# npx motion-primitives@latest add accordion
```

---

## 3. Standard Motion Tokens & Physics

### Spring Presets
```typescript
export const TRANSITION_PRESETS = {
  // Snappy for buttons, toggles, micro-interactions
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  
  // Smooth for modals, cards, drawers, popovers
  smooth: { type: "spring", stiffness: 300, damping: 25 },
  
  // Gentle for page transitions, hero elements, soft reveals
  gentle: { type: "spring", stiffness: 200, damping: 20 },
  
  // Bouncy for celebratory or playful micro-moments
  playful: { type: "spring", stiffness: 400, damping: 15, mass: 0.8 },
  
  // Standard ease curves
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  anticipate: [0.38, 0, 0.24, 1],
} as const;
```

### Durations
- **Micro (hover/active/tap)**: `120ms - 180ms`
- **UI State (toggle, accordion, tab switch)**: `200ms - 280ms`
- **Overlays (dialog, drawer, toast)**: `280ms - 380ms`
- **Section/Page Reveal**: `400ms - 700ms` (with `50ms - 80ms` stagger)

---

## 4. Component Catalog & Implementation Recipes

### A. Morphing Shared Layout (e.g. Tabs / Segmented Control)
Use `layoutId` to animate active indicator across items smoothly without manual bounding box calculation.

```tsx
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

interface Tab {
  id: string;
  label: string;
}

export function AnimatedTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-neutral-800 border border-neutral-700/60 rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

---

### B. Morphing Dialog / Expanding Card
Expands a compact card into a rich dialog smoothly using `AnimatePresence` and `layoutId`.

```tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function MorphingCardDialog({
  id,
  title,
  subtitle,
  content,
}: {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        layoutId={`card-${id}`}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-5 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors shadow-lg"
      >
        <motion.h3 layoutId={`title-${id}`} className="text-lg font-semibold text-white">
          {title}
        </motion.h3>
        <motion.p layoutId={`subtitle-${id}`} className="text-sm text-neutral-400 mt-1">
          {subtitle}
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${id}`}
              className="relative z-10 w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              <motion.h3 layoutId={`title-${id}`} className="text-2xl font-bold text-white">
                {title}
              </motion.h3>
              <motion.p layoutId={`subtitle-${id}`} className="text-sm text-neutral-400 mt-1">
                {subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-4 text-neutral-300 text-sm leading-relaxed"
              >
                {content}
              </motion.div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

### C. Spotlight Glow Effect
Interactive dynamic gradient spotlight following cursor movement on hover.

```tsx
"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(120, 119, 198, 0.15)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function onMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

---

### D. Text Roll Animation (Kinetic Typography)
Characters or words rolling into place with staggered letter animations.

```tsx
"use client";
import React from "react";
import { motion } from "motion/react";

export function TextRoll({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const letters = Array.from(text);

  return (
    <span className={`inline-flex overflow-hidden font-bold ${className}`}>
      {letters.map((letter, index) => (
        <span key={index} className="relative inline-block overflow-hidden">
          <motion.span
            initial={{ y: 0 }}
            whileHover={{ y: "-100%" }}
            transition={{
              duration: 0.35,
              ease: [0.33, 1, 0.68, 1],
              delay: index * 0.02,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
          <motion.span
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.33, 1, 0.68, 1],
              delay: index * 0.02,
            }}
            className="absolute left-0 top-0 inline-block text-emerald-400"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

---

### E. Magnetic Hover Button
Softly pulls towards cursor within boundary proximity.

```tsx
"use client";
import React, { useRef } from "react";
import { motion, useSpring } from "motion/react";

export function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 350, damping: 20 });
  const y = useSpring(0, { stiffness: 350, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}
```

---

### F. Scroll-Triggered InView Stagger Container
Reveals children sequentially as they enter the viewport.

```tsx
"use client";
import React from "react";
import { motion } from "motion/react";

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const FADE_UP_ITEM = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function StaggerList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Accessibility & Reduced Motion Checklist

1. **Check for preference:**
   ```tsx
   import { useReducedMotion } from "motion/react";
   
   const shouldReduceMotion = useReducedMotion();
   const transition = shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 };
   ```
2. **CSS Media Query:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```

---

## 6. Verification & Quality Checklist

Before finalizing any animated component:
- [ ] Check frame rates and GPU layer usage in Chrome DevTools Performance panel (zero layout thrashing).
- [ ] Test on mobile touch devices (touch interaction vs. hover states).
- [ ] Ensure dark mode and light mode contrast remain compliant across animation states.
- [ ] Verify clean unmounting and no memory leaks with `AnimatePresence`.
