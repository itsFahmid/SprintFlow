"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG ICONS ---
const CrownIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-green-500 shrink-0">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const TasksIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const PlannerIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SprintsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const RewardsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
    <path d="M12 2a7 7 0 0 1 7 7c0 2.6-1.5 4.8-3.6 5.8l-.4.2H7l-.4-.2C4.5 13.8 3 11.6 3 9a7 7 0 0 1 7-7z"></path>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoSVG = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGrad)" />
    <defs>
      <linearGradient id="logoGrad" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [selectedPlan, setSelectedPlan] = useState<"3_months" | "1_month">("3_months");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name);
        if (data.user.subscription?.plan) {
          setCurrentPlan(data.user.subscription.plan);
        }
        setLoading(false);
      } catch (err) {
        console.error("Pricing fetch error:", err);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleStartTrial = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_trial" })
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        router.push(`/checkout?plan=${selectedPlan}`);
      }
    } catch (err) {
      console.error("Start trial error:", err);
      router.push(`/checkout?plan=${selectedPlan}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationLinks = (
    <ul className="space-y-1.5 list-none p-0">
      <li>
        <Link href="/dashboard" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <DashboardIcon />
          Dashboard
        </Link>
      </li>
      <li>
        <Link href="/tasks" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <TasksIcon />
          Tasks
        </Link>
      </li>
      <li>
        <Link href="/planner" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <PlannerIcon />
          Planner
        </Link>
      </li>
      <li>
        <Link href="/sprints" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <SprintsIcon />
          Sprints
        </Link>
      </li>
      <li>
        <Link href="/rewards" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <RewardsIcon />
          Rewards
        </Link>
      </li>
      <li>
        <Link href="/analytics" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <AnalyticsIcon />
          Analytics
        </Link>
      </li>
    </ul>
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    router.push("/login");
  };

  const footerBlock = (
    <div className="space-y-6">
      {/* User Profile Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase select-none">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentPlan === "Pro" ? "Level 12 · Pro" : "Level 1 · Free"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <SettingsIcon />
          <button onClick={handleLogout} className="p-1 rounded-lg hover:bg-red-50 transition-colors group" aria-label="Log out" title="Log out">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 group-hover:text-red-500 transition-colors">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="relative w-16 h-16 flex items-center justify-center select-none">
          <div className="absolute inset-0 bg-[#7c3aed]/5 backdrop-blur-md rounded-full border border-[#7c3aed]/10 animate-pulse"></div>
          <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-200/60 p-6 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoSVG />
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">SprintFlow</span>
          </Link>
          <nav>{navigationLinks}</nav>
        </div>
        {footerBlock}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Row */}
        <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div>
            <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Upgrade to Pro</h1>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Unlimited focus, deeper AI planning and full insights</p>
          </div>
          
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Pricing Container */}
        <div className="p-6 md:p-10 space-y-10 max-w-[1100px] w-full mx-auto animate-fade-in">
          
          {/* Hero Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200/60 rounded-full text-[10px] font-extrabold text-[#7c3aed] uppercase tracking-wider shadow-sm">
              <CrownIcon />
              SPRINTFLOW PRO
            </span>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl text-slate-900 leading-tight">
              Do your best focus work
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              Start with a 3-day free trial — no payment needed. Keep Free forever at 3 sprints a day.
            </p>
          </div>

          {/* Pricing Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            
            {/* Free Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-7 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900">Free</h3>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">
                    Current plan
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-extrabold text-4xl text-slate-900">0</span>
                    <span className="text-xs text-slate-400 font-semibold">BDT / forever</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <CheckIcon />
                    <span>3 focus sprints per day</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <CheckIcon />
                    <span>Basic AI task breakdown</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <CheckIcon />
                    <span>This-week analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <CheckIcon />
                    <span>1 daily goal & streak</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled
                  className="w-full h-12 bg-slate-100 text-slate-400 rounded-2xl text-xs md:text-sm font-bold cursor-not-allowed"
                >
                  Your current plan
                </button>
              </div>
            </div>

            {/* Pro Card */}
            <div className="bg-white border-2 border-[#7c3aed] rounded-3xl p-7 md:p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-purple-500/10 relative overflow-hidden">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center shadow-sm">
                      <CrownIcon />
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900">Pro</h3>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-[#7c3aed] rounded-full text-[10px] font-extrabold tracking-wide">
                    3-day free trial
                  </span>
                </div>

                {/* Plan Options Selector */}
                <div className="space-y-3 pt-2">
                  
                  {/* Option 1: 3 Months */}
                  <label 
                    onClick={() => setSelectedPlan("3_months")}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === "3_months"
                        ? "border-[#7c3aed] bg-purple-50/50 shadow-sm"
                        : "border-slate-200/80 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "3_months" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                      }`}>
                        {selectedPlan === "3_months" && <span className="text-[10px]">✓</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 leading-tight">3 Months</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[9px] font-extrabold uppercase">
                            SAVE 16%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">166 BDT/mo · billed quarterly</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-extrabold text-lg text-slate-900">499</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">BDT</span>
                    </div>
                  </label>

                  {/* Option 2: 1 Month */}
                  <label 
                    onClick={() => setSelectedPlan("1_month")}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === "1_month"
                        ? "border-[#7c3aed] bg-purple-50/50 shadow-sm"
                        : "border-slate-200/80 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "1_month" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                      }`}>
                        {selectedPlan === "1_month" && <span className="text-[10px]">✓</span>}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 leading-tight">1 Month</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Billed monthly</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-extrabold text-lg text-slate-900">199</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">BDT</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleStartTrial}
                  disabled={isSubmitting}
                  className="w-full h-12 btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
                >
                  <span className="text-base font-black">+</span>
                  <span>{isSubmitting ? "Activating..." : "Start 3-day free trial"}</span>
                </button>
                
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  {selectedPlan === "3_months"
                    ? "No payment needed now · then 499 BDT for 3 months"
                    : "No payment needed now · then 199 BDT for 1 month"}
                </p>

                <div className="text-center pt-1">
                  <Link
                    href={`/checkout?plan=${selectedPlan}`}
                    className="text-xs font-bold text-[#7c3aed] hover:underline"
                  >
                    Skip trial — buy Pro pass now
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Compare Plans Section */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Compare plans</h3>
              <div className="flex items-center gap-12 text-xs font-bold pr-4">
                <span className="text-slate-400">Free</span>
                <span className="text-[#7c3aed] flex items-center gap-1">
                  <CrownIcon /> Pro
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm">
              
              {/* Feature 1 */}
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-[#7c3aed] font-bold text-base">∞</span>
                  <span className="font-semibold text-slate-800">Daily focus sprints</span>
                </div>
                <div className="flex items-center gap-14 pr-4">
                  <span className="text-slate-500 font-medium">3 / day</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    ✓ Unlimited
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-[#7c3aed] font-bold text-base">✦</span>
                  <span className="font-semibold text-slate-800">AI sprint planning</span>
                </div>
                <div className="flex items-center gap-14 pr-4">
                  <span className="text-slate-500 font-medium">Basic</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    ✓ Deep planning
                  </span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#7c3aed] font-bold text-base">📊</span>
                  <span className="font-semibold text-slate-800">Analytics</span>
                </div>
                <div className="flex items-center gap-10 pr-4">
                  <span className="text-slate-500 font-medium">This week</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    ✓ Monthly + trends + history
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
