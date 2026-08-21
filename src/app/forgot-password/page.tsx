"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG ICONS ---
const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const KeyIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-[#7c3aed]">
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

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: "forgot" (Screen 34) | "check_email" (Screen 35) | "reset" (Screen 36) | "success" (Screen 37)
  const [step, setStep] = useState<"forgot" | "check_email" | "reset" | "success">("forgot");

  const [email, setEmail] = useState("fahimsahmed01@gmail.com");
  const [password, setPassword] = useState("Password123!");
  const [confirmPassword, setConfirmPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("check_email");
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 600);
  };

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  const strengthScore = (hasMinLength ? 2 : 0) + (hasLetterAndNumber ? 1 : 0) + (password.length >= 10 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#7c3aed] selection:text-white">
      
      {/* --- LEFT PANEL: BRANDING --- */}
      <div className="w-full md:w-1/2 lg:w-[48%] bg-gradient-to-br from-[#4f46e5] to-[#2563eb] text-white p-8 md:p-14 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Abstract Glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="30" width="20" height="6" rx="3" fill="#ffffff" fillOpacity="0.6"/>
                <rect x="15" y="46" width="25" height="6" rx="3" fill="#ffffff" fillOpacity="0.8"/>
                <rect x="10" y="62" width="20" height="6" rx="3" fill="#ffffff"/>
                <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#ffffff" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">sprintflow</span>
          </Link>
        </div>

        {/* Center Copy */}
        <div className="relative z-10 my-12 md:my-0 space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold tracking-wide">
            <span>🔒</span>
            <span>Secure account recovery</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight">
            Back to focus in no time.
          </h1>

          <p className="text-white/85 text-sm md:text-base leading-relaxed">
            Reset your password securely and pick up your sprints, streaks and XP right where you left off.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
          <div>
            <h4 className="font-heading font-extrabold text-xl md:text-2xl leading-none">2.4M+</h4>
            <p className="text-[10px] md:text-xs text-white/70 mt-1 uppercase tracking-wider">Sprints done</p>
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-xl md:text-2xl leading-none">94%</h4>
            <p className="text-[10px] md:text-xs text-white/70 mt-1 uppercase tracking-wider">Stay focused</p>
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-xl md:text-2xl leading-none">4.9★</h4>
            <p className="text-[10px] md:text-xs text-white/70 mt-1 uppercase tracking-wider">User rating</p>
          </div>
        </div>

      </div>

      {/* --- RIGHT PANEL: INTERACTIVE FLOW --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        
        {/* ========================================================================= */}
        {/* --- SCREEN 34: FORGOT PASSWORD FORM --- */}
        {/* ========================================================================= */}
        {step === "forgot" && (
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 animate-scale-up">
            
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span>←</span>
              <span>Back to login</span>
            </Link>

            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shadow-sm">
              <KeyIcon />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                Forgot your password?
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                Enter the email linked to your account and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSendReset} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#7c3aed] rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer"
              >
                <span>Send reset link</span>
                <span>→</span>
              </button>

              <div className="text-center text-xs text-slate-500 font-medium pt-1">
                Remembered it?{" "}
                <Link href="/login" className="text-[#7c3aed] hover:underline font-bold">
                  Log in
                </Link>
              </div>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* --- SCREEN 35: CHECK EMAIL --- */}
        {/* ========================================================================= */}
        {step === "check_email" && (
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 animate-scale-up">
            
            <button 
              onClick={() => setStep("forgot")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span>←</span>
              <span>Back to login</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center text-xl shadow-sm">
              ✉️
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                Check your inbox
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                We sent a password reset link to <strong className="text-slate-800 font-bold block mt-1">{email}</strong>
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="text-slate-400">🔄</span>
              <span>The link expires in 30 minutes.</span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setStep("reset")}
                className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer"
              >
                Open email app
              </button>

              <div className="text-center text-xs text-slate-500 font-medium">
                Didn't get it?{" "}
                <button 
                  onClick={() => alert(`A fresh reset link has been re-sent to ${email}!`)}
                  className="text-[#7c3aed] hover:underline font-bold cursor-pointer"
                >
                  Resend link
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* --- SCREEN 36: RESET PASSWORD --- */}
        {/* ========================================================================= */}
        {step === "reset" && (
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 animate-scale-up">
            
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xl shadow-sm">
              🔒
            </div>

            <div className="space-y-1.5">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                Set a new password
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                Create a strong password you don't use elsewhere.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-5">
              
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">New password</label>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                  >
                    <EyeIcon show={showPassword} />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 1 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                    <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 2 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                    <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                    <div className={`h-1.5 rounded-full transition-all ${strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 block">
                    {strengthScore >= 3 ? "Strong password" : strengthScore >= 2 ? "Medium password" : "Weak password"}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Confirm password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                  >
                    <EyeIcon show={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className={hasMinLength ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span>
                  <span className={hasMinLength ? "text-slate-700 font-medium" : "text-slate-400"}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={hasLetterAndNumber ? "text-emerald-500 font-bold" : "text-slate-300"}>✓</span>
                  <span className={hasLetterAndNumber ? "text-slate-700 font-medium" : "text-slate-400"}>One number and one letter</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer"
              >
                Reset password
              </button>

            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* --- SCREEN 37: RESET SUCCESS --- */}
        {/* ========================================================================= */}
        {step === "success" && (
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-6 animate-scale-up">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/30 font-bold">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                Password reset
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                Your password has been updated. Log in with your new password to keep focusing.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer"
              >
                <span>Continue to login</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
