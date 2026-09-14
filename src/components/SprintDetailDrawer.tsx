"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DRAWER_RIGHT_VARIANT, MODAL_BACKDROP_VARIANT } from "@/lib/motion";

export interface SprintDetailData {
  id: string;
  sprintNumber: number;
  title: string;
  dateStr?: string;
  timeRange?: string;
  priority: "High" | "Medium" | "Low";
  xpEarned?: number;
  focusedTime?: string;
  plannedTime?: string;
  pauseCount?: number;
  distractionCount?: number;
  checklist?: string[];
  timeline?: { action: string; time: string; note?: string; icon: string }[];
}

interface SprintDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sprint?: SprintDetailData | null;
  onViewTask?: () => void;
  onRepeat?: () => void;
}

export default function SprintDetailDrawer({
  isOpen,
  onClose,
  sprint,
  onViewTask,
  onRepeat,
}: SprintDetailDrawerProps) {
  const currentSprint: SprintDetailData = sprint || {
    id: "sp-2",
    sprintNumber: 2,
    title: "Debug dashboard slow-load",
    dateStr: "Sat, Jun 27",
    timeRange: "9:30–10:00 AM",
    priority: "High",
    xpEarned: 45,
    focusedTime: "28:42",
    plannedTime: "30:00",
    pauseCount: 1,
    distractionCount: 0,
    checklist: [
      "Profile network waterfall",
      "Add skeleton loaders",
      "Cache the initial query",
    ],
    timeline: [
      { action: "Started sprint", time: "9:30 AM", icon: "▶" },
      { action: "Paused", time: "9:42 AM · 1m", icon: "⏸" },
      { action: "Resumed", time: "9:43 AM", icon: "▶" },
      { action: "Completed", time: "10:00 AM", icon: "✓" },
    ],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            variants={MODAL_BACKDROP_VARIANT}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              variants={DRAWER_RIGHT_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                    #{currentSprint.sprintNumber || 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Sprint Details
                    </span>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {currentSprint.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-300 flex items-center justify-center font-bold text-base transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FOCUSED TIME</span>
                    <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                      {currentSprint.focusedTime || "25:00"}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP REWARD</span>
                    <p className="text-base font-bold text-amber-500 mt-1">+{currentSprint.xpEarned || 40} XP</p>
                  </div>
                </div>

                {/* Checklist Section */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    CHECKLIST / SUBTASKS
                  </span>
                  <div className="space-y-2">
                    {(currentSprint.checklist || ["Complete core sprint objective"]).map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-medium"
                      >
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TIMELINE</span>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    {(currentSprint.timeline || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="text-slate-400 text-xs">{item.icon}</span>
                          <span>{item.action}</span>
                        </span>
                        <span className="text-slate-400">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex gap-2.5 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (onViewTask) onViewTask();
                    onClose();
                  }}
                  className="flex-1 h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <span>🗂</span>
                  <span>View task</span>
                </motion.button>

                <button
                  onClick={() => {
                    if (onRepeat) onRepeat();
                    onClose();
                  }}
                  className="h-11 px-4 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Repeat</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
