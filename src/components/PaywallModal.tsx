"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  usedCount?: number;
  totalLimit?: number;
}

export default function PaywallModal({
  isOpen,
  onClose,
  usedCount = 3,
  totalLimit = 3
}: PaywallModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_trial" })
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        router.push("/pricing");
      }
    } catch (err) {
      console.error("Paywall start trial error:", err);
      router.push("/pricing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-center border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Icon */}
        <div className="flex justify-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            You've hit today's free limit
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            You've used all 3 free sprints today. Go Pro for unlimited focus, or come back tomorrow.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 text-left bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">Free sprints today</span>
            <span className="text-orange-600">{usedCount} / {totalLimit} used</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Features Box */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-3">
            <span className="text-[#7c3aed] font-bold text-sm">∞</span>
            <span>Unlimited daily sprints</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#7c3aed] font-bold text-sm">✦</span>
            <span>AI deep-planning</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#7c3aed] font-bold text-sm">📊</span>
            <span>Full analytics & history</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleStartTrial}
            disabled={isSubmitting}
            className="w-full h-11 btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <span className="text-base font-bold">+</span>
            <span>{isSubmitting ? "Activating trial..." : "Start 3-day free trial"}</span>
          </button>

          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            See all plans
          </Link>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium pt-1 transition-colors cursor-pointer"
          >
            Maybe tomorrow
          </button>
        </div>
      </div>
    </div>
  );
}
