"use client";

import React, { useState } from "react";

// --- SVG ICONS ---
const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const KeyIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-[#7c3aed]">
    <circle cx="7.5" cy="15.5" r="4.5"></circle>
    <path d="m21 3-9.5 9.5"></path>
    <path d="m15.5 7.5 3 3"></path>
    <path d="m18 5 2 2"></path>
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-600 transition-colors">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    )}
  </svg>
);

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasLetterAndNumber = /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const isDifferentFromCurrent = newPassword.length > 0 && newPassword !== currentPassword;
  const strengthScore = (hasMinLength ? 2 : 0) + (hasLetterAndNumber ? 1 : 0) + (newPassword.length >= 10 ? 1 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (!hasMinLength) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!hasLetterAndNumber) {
      setError("New password must contain at least one letter and one number.");
      return;
    }
    if (!isDifferentFromCurrent) {
      setError("New password must be different from your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword
        })
      });

      if (res.ok) {
        setSuccessMsg("Password updated successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-[440px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shadow-sm">
              <KeyIcon />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Change password</h3>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Current password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                <EyeIcon show={showCurrent} />
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">New password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-[#7c3aed] rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                <EyeIcon show={showNew} />
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="grid grid-cols-4 gap-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 1 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                  <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 2 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                  <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                  <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 block">
                  {strengthScore >= 3 ? "Strong — nice and secure" : strengthScore >= 2 ? "Medium strength" : "Weak password"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Confirm new password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                <EyeIcon show={showConfirm} />
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className={hasMinLength ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span>
              <span className={hasMinLength ? "text-slate-700 font-medium" : "text-slate-400"}>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={hasLetterAndNumber ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span>
              <span className={hasLetterAndNumber ? "text-slate-700 font-medium" : "text-slate-400"}>One number and one letter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={isDifferentFromCurrent ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span>
              <span className={isDifferentFromCurrent ? "text-slate-700 font-medium" : "text-slate-400"}>Different from your current password</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 h-10 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>✓</span>
              <span>Update password</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
