"use client";

import React from "react";

interface ExitFocusModalProps {
  isOpen: boolean;
  onKeepFocusing: () => void;
  onExitSession: () => void;
}

export default function ExitFocusModal({ isOpen, onKeepFocusing, onExitSession }: ExitFocusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-[380px] bg-white rounded-3xl p-8 text-center shadow-2xl space-y-6 animate-scale-up border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pause Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xl mx-auto shadow-inner">
          <div className="flex gap-1">
            <div className="w-1.5 h-5 bg-[#7c3aed] rounded-full"></div>
            <div className="w-1.5 h-5 bg-[#7c3aed] rounded-full"></div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">
            Exit focus session?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Your progress on this sprint will be saved. You can resume right where you left off.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onKeepFocusing}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 transition-all cursor-pointer"
          >
            Keep focusing
          </button>
          
          <button
            onClick={onExitSession}
            className="w-full h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Exit session
          </button>
        </div>

      </div>
    </div>
  );
}
