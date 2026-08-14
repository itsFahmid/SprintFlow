"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG ICONS ---
const MailIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      
      {/* --- LEFT SIDEBAR (BRANDING) --- */}
      <div className="w-full md:w-[40%] bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#3b82f6] text-white p-8 md:p-12 flex flex-col justify-between min-h-[360px] md:min-h-screen relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none"></div>
        
        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="30" width="20" height="6" rx="3" fill="#ffffff" fillOpacity="0.6"/>
              <rect x="15" y="46" width="25" height="6" rx="3" fill="#ffffff" fillOpacity="0.8"/>
              <rect x="10" y="62" width="20" height="6" rx="3" fill="#ffffff"/>
              <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#ffffff" />
            </svg>
            <span className="font-heading font-extrabold text-xl tracking-tight">SprintFlow</span>
          </Link>
        </div>

        {/* Brand Copywriting */}
        <div className="relative z-10 my-12 md:my-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider mb-6">
            ✦ AI-powered focus
          </div>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl leading-tight mb-4 max-w-sm">
            Turn your task list into focused sprints.
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-sm leading-relaxed">
            Paste your to-dos. SprintFlow's AI breaks them into Pomodoro sprints, plans your day, and rewards every focused minute.
          </p>
        </div>

        {/* Stats Row */}
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

      {/* --- RIGHT PANEL (FORM) --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(15,23,42,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_15px_50px_rgba(15,23,42,0.06)]">
          <div className="mb-8">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500">Log in to continue your focus streak.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="email-input">
                Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  id="email-input"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="password-input">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type="password"
                  id="password-input"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#7c3aed] border-slate-300 focus:ring-[#7c3aed] cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
            >
              Log in
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-xs md:text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
