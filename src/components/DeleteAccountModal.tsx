"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp?: number;
  level?: number;
  sprintsCount?: number;
  badgesCount?: number;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  xp = 2480,
  level = 12,
  sprintsCount = 64,
  badgesCount = 8
}: DeleteAccountModalProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    setError("");

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/account-deleted");
    } catch {
      setError("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 animate-scale-up border border-white/20 my-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
          ⚠️
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            Delete your account?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            This permanently erases your account and everything in it. This action cannot be undone.
          </p>
        </div>

        {/* Impact List Card */}
        <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl text-left space-y-2.5 text-xs text-red-700">
          <div className="flex items-center gap-2.5">
            <span className="text-sm">⚡</span>
            <span className="font-bold">{xp.toLocaleString()} XP and Level {level} progress</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm">🏆</span>
            <span className="font-bold">{sprintsCount} sprints and {badgesCount} badges</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm">👑</span>
            <span className="font-bold">Your active Pro pass (no refund)</span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Confirmation Input */}
        <div className="space-y-1.5 text-left pt-1">
          <label className="block text-xs font-bold text-slate-700">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border-2 border-red-500 rounded-xl text-xs md:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all uppercase tracking-wider"
            placeholder="DELETE"
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <span>🗑</span>
            <span>{isDeleting ? "Deleting..." : "Delete account"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
