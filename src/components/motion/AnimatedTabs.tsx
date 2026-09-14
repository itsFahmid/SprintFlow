"use client";

import React from "react";
import { motion } from "motion/react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
  layoutId?: string;
  pillColorClass?: string;
}

export function AnimatedTabs({
  tabs,
  activeId,
  onChange,
  className = "",
  tabClassName = "",
  layoutId = "animated-tab-pill",
  pillColorClass = "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700/80",
}: AnimatedTabsProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-xl backdrop-blur-md ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            } ${tabClassName}`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 rounded-lg ${pillColorClass}`}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {tab.icon && <span className="relative z-10">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="relative z-10 px-1.5 py-0.5 text-[10px] rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
export default AnimatedTabs;
