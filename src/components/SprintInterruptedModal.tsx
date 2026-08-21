"use client";

import React, { useState, useEffect } from "react";

interface SprintInterruptedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  onEndSprint: () => void;
  onLogDistraction?: () => void;
}

export default function SprintInterruptedModal({
  isOpen,
  onClose,
  onResume,
  onEndSprint,
  onLogDistraction
}: SprintInterruptedModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(298); // 4:58

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-[400px] bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl space-y-5 animate-scale-up border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Eye Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
          👁
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            Still focusing?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            We paused your sprint when you switched away. Your timer is safe — jump back in to keep your streak alive.
          </p>
        </div>

        {/* Auto-End Warning Pill */}
        <div className="flex items-center justify-center gap-2 p-3 bg-amber-50/80 border border-amber-200/80 text-amber-900 rounded-2xl text-xs font-semibold">
          <span>⏸</span>
          <span>Auto-ends in {timeFormatted} if you don't return</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onResume}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
          >
            <span>▶</span>
            <span>Resume sprint</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onLogDistraction || onResume}
              className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>⚑</span>
              <span>Log distraction</span>
            </button>

            <button
              onClick={onEndSprint}
              className="flex-1 h-10 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>■</span>
              <span>End sprint</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
