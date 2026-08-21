"use client";

import React from "react";

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
  onRepeat
}: SprintDetailDrawerProps) {
  if (!isOpen) return null;

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
      "Cache the initial query"
    ],
    timeline: [
      { action: "Started sprint", time: "9:30 AM", icon: "▶" },
      { action: "Paused", time: "9:42 AM · 1m", icon: "⏸" },
      { action: "Resumed", time: "9:43 AM", icon: "▶" },
      { action: "Completed", time: "10:00 AM", icon: "✓" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-[#0f0e26]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
          
          {/* Main Top / Body */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Top Header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  SPRINT {currentSprint.sprintNumber} · TODAY
                </span>
              </div>

              <button 
                onClick={() => alert("Sprint options menu")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ⋮
              </button>
            </div>

            {/* Title & Badges */}
            <div className="space-y-3">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                {currentSprint.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Completed</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-purple-50 text-[#7c3aed] border border-purple-100">
                  <span>⚡</span>
                  <span>+{currentSprint.xpEarned || 45} XP</span>
                </span>
              </div>

              {/* Timestamp Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1.5"><span>📅</span> {currentSprint.dateStr || "Sat, Jun 27"}</span>
                <span className="flex items-center gap-1.5"><span>🕒</span> {currentSprint.timeRange || "9:30–10:00 AM"}</span>
                <span className="flex items-center gap-1.5 text-red-600 font-bold"><span>●</span> {currentSprint.priority}</span>
              </div>
            </div>

            {/* Session 4-Box KPI Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                SESSION
              </span>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="block font-heading font-extrabold text-base text-slate-900 leading-tight">
                    {currentSprint.focusedTime || "28:42"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Focused</span>
                </div>
                
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="block font-heading font-extrabold text-base text-slate-900 leading-tight">
                    {currentSprint.plannedTime || "30:00"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Planned</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="block font-heading font-extrabold text-base text-slate-900 leading-tight">
                    {currentSprint.pauseCount ?? 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Pause</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="block font-heading font-extrabold text-base text-slate-900 leading-tight">
                    {currentSprint.distractionCount ?? 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Distractions</span>
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                CHECKLIST · {currentSprint.checklist?.length || 3} OF {currentSprint.checklist?.length || 3} DONE
              </span>

              <div className="space-y-2">
                {(currentSprint.checklist || ["Profile network waterfall", "Add skeleton loaders", "Cache the initial query"]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-700">
                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                TIMELINE
              </span>

              <div className="space-y-2.5 text-xs text-slate-600">
                {(currentSprint.timeline || [
                  { action: "Started sprint", time: "9:30 AM", icon: "▶" },
                  { action: "Paused", time: "9:42 AM · 1m", icon: "⏸" },
                  { action: "Resumed", time: "9:43 AM", icon: "▶" },
                  { action: "Completed", time: "10:00 AM", icon: "✓" }
                ]).map((item, idx) => (
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

          {/* Sticky Bottom Actions */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (onViewTask) onViewTask();
                onClose();
              }}
              className="flex-1 h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <span>🗂</span>
              <span>View task</span>
            </button>
            
            <button
              onClick={() => {
                if (onRepeat) onRepeat();
                onClose();
              }}
              className="h-11 px-4 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>🔄</span>
              <span>Repeat</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
