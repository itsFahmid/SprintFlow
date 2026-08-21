"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// --- SVG ICONS ---
const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  userName?: string;
  userEmail?: string;
  onSuccess?: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onClose,
  userName = "Fahim Siddique",
  userEmail = "fahimsahmed01@gmail.com",
  onSuccess
}: SessionExpiredModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password })
      });

      if (res.ok) {
        if (onSuccess) {
          onSuccess();
        } else if (onClose) {
          onClose();
        }
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDifferentAccount = () => {
    if (onClose) onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-[400px] bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl space-y-5 animate-scale-up border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clock Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
          🕒
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            Your session expired
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            For your security you were signed out after a period of inactivity. Log back in to continue.
          </p>
        </div>

        {/* User Identity Card */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-left">
          <div className="w-10 h-10 rounded-full bg-[#6366f1] text-white font-bold flex items-center justify-center text-xs shadow-sm uppercase shrink-0">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-slate-900 leading-tight truncate">{userName}</h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{userEmail}</p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#7c3aed] rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Switch Account */}
        <div className="pt-1 text-center">
          <button
            onClick={handleDifferentAccount}
            className="text-xs text-[#7c3aed] hover:underline font-bold transition-colors cursor-pointer"
          >
            Sign in to a different account
          </button>
        </div>

      </div>
    </div>
  );
}
