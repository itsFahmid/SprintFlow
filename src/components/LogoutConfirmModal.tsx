"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    if (onConfirm) {
      onConfirm();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-[380px] bg-white rounded-3xl p-8 text-center shadow-2xl space-y-6 animate-scale-up border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logout Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-2xl mx-auto shadow-inner">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            Log out of SprintFlow?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            You'll need to log in again to get back to your sprints, streak and plan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleLogout}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
          >
            <span>[→</span>
            <span>Log out</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Stay logged in
          </button>
        </div>

      </div>
    </div>
  );
}
