"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG NAVIGATION & WIDGET ICONS ---
const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
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

const LightningIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const ClockOutlineIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckOutlineIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

interface FilterData {
  focusTime: string;
  focusChange: string;
  sprintsCount: string;
  sprintsChange: string;
  tasksCompleted: string;
  tasksChange: string;
  avgProductivity: string;
  productivityChange: string;
  weeklyProductivity: number[];
  donutPercent: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasSprints, setHasSprints] = useState(false);
  const [viewMode, setViewMode] = useState<"empty" | "insights">("empty");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name);
        const sprintCount = data.user.planner?.completedSprintsCount || 0;
        setHasSprints(sprintCount > 0);
        setViewMode(sprintCount > 0 ? "insights" : "empty");
        setLoading(false);
      } catch (err) {
        console.error("Analytics auth check error:", err);
        router.push("/login");
      }
    };
    checkAuth();
  }, []);

  // Dynamic values mapped to active filter tab
  const filterMocks: Record<"week" | "month" | "year", FilterData> = {
    week: {
      focusTime: "28h 40m",
      focusChange: "+ 12%",
      sprintsCount: "64",
      sprintsChange: "+ 8%",
      tasksCompleted: "41",
      tasksChange: "+ 15%",
      avgProductivity: "87%",
      productivityChange: "- 2%",
      weeklyProductivity: [62, 88, 74, 120, 96, 40, 108],
      donutPercent: 78
    },
    month: {
      focusTime: "118h 20m",
      focusChange: "+ 16%",
      sprintsCount: "276",
      sprintsChange: "+ 10%",
      tasksCompleted: "182",
      tasksChange: "+ 18%",
      avgProductivity: "89%",
      productivityChange: "+ 1%",
      weeklyProductivity: [80, 110, 95, 120, 115, 60, 100],
      donutPercent: 84
    },
    year: {
      focusTime: "1,248h 15m",
      focusChange: "+ 24%",
      sprintsCount: "2,840",
      sprintsChange: "+ 14%",
      tasksCompleted: "1,942",
      tasksChange: "+ 22%",
      avgProductivity: "91%",
      productivityChange: "+ 3%",
      weeklyProductivity: [90, 100, 105, 120, 110, 85, 115],
      donutPercent: 92
    }
  };

  const activeMock = filterMocks[timeFilter];

  // SVG Circular progress for Donut chart
  const donutCircumference = 282.74; // 2 * PI * 45 (Radius 45)
  const donutOffset = donutCircumference * (1 - (activeMock.donutPercent / 100));

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
        <Link href="/analytics" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
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
      {/* Go Pro Card */}
      <div className="bg-gradient-to-br from-[#7c3aed] to-[#6366f1] rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <h4 className="font-heading font-extrabold text-sm mb-1 uppercase tracking-wider text-white/90">Go Pro</h4>
        <p className="text-[11px] leading-normal text-white/80 mb-4">
          Unlock AI deep-planning & insights.
        </p>
        <Link href="/pricing" className="block w-full bg-white text-[#7c3aed] hover:bg-slate-50 font-semibold py-2 px-4 rounded-xl text-center text-xs shadow-sm transition-colors">
          Upgrade
        </Link>
      </div>

      {/* User Profile Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase select-none">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">Level 1 · Free</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/settings" className="p-1 rounded-lg hover:bg-slate-100 transition-colors" title="Settings">
            <SettingsIcon />
          </Link>
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
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
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

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <aside 
          className={`w-[260px] max-w-[80vw] bg-white h-full p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <LogoSVG />
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">SprintFlow</span>
              </Link>
              <button 
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <nav onClick={() => setIsMobileMenuOpen(false)}>{navigationLinks}</nav>
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>{footerBlock}</div>
        </aside>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Row */}
        <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            
            <div>
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Analytics</h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Your focus, productivity and progress over time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View switcher toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl shadow-inner text-xs font-semibold">
              <button 
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "empty" ? "bg-white text-[#7c3aed] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setViewMode("empty")}
              >
                Empty
              </button>
              <button 
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "insights" ? "bg-white text-[#7c3aed] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setViewMode("insights")}
              >
                Insights
              </button>
            </div>

            {/* Timeframe selector header buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner select-none text-xs font-semibold">
              <button 
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === "week" ? "bg-white text-[#7c3aed] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setTimeFilter("week")}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === "month" ? "bg-white text-[#7c3aed] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setTimeFilter("month")}
              >
                Month
              </button>
              <button 
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === "year" ? "bg-white text-[#7c3aed] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setTimeFilter("year")}
              >
                Year
              </button>
            </div>
          </div>
        </header>

        {/* Analytics Dashboard Grid */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {/* ========================================================================= */}
          {/* --- EMPTY ANALYTICS (SCREEN 19 · EMPTY — ANALYTICS) --- */}
          {/* ========================================================================= */}
          {viewMode === "empty" ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* 4 Metric Cards showing "—" */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Focus time */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <ClockOutlineIcon />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">—</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Focus time</p>
                </div>

                {/* Sprints done */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mb-4">
                    <LightningIcon />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">—</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Sprints done</p>
                </div>

                {/* Tasks completed */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                    <CheckOutlineIcon />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">—</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Tasks completed</p>
                </div>

                {/* Avg productivity */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                    <TargetIcon />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">—</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Avg productivity</p>
                </div>

              </div>

              {/* Large Empty Insights Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                
                {/* Stylized Bar Chart Illustration */}
                <div className="flex items-end justify-center gap-2 h-20 mb-1 select-none">
                  <div className="w-3.5 h-8 bg-slate-100 rounded-full"></div>
                  <div className="w-3.5 h-16 bg-slate-100/90 rounded-full"></div>
                  <div className="w-3.5 h-12 bg-slate-200/80 rounded-full"></div>
                  <div className="w-3.5 h-20 bg-slate-200/90 rounded-full"></div>
                  <div className="w-3.5 h-14 bg-slate-100/90 rounded-full"></div>
                  <div className="w-3.5 h-9 bg-slate-100 rounded-full"></div>
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900">No insights yet</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                    Complete your first focus sprint and your productivity trends, focus time and XP history will show up here.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sprints"
                    className="btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-7 py-3.5 rounded-xl text-xs md:text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    Start a sprint
                  </Link>
                </div>

              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* --- POPULATED INSIGHTS STATE --- */
            /* ========================================================================= */
            <div className="space-y-6 animate-fade-in">
              {/* 1. Stat cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Focus time */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ClockOutlineIcon />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] rounded-full">
                      ▲ {activeMock.focusChange}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 leading-none">{activeMock.focusTime}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Focus time</p>
                </div>

                {/* Sprints completed */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center">
                      <LightningIcon />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] rounded-full">
                      ▲ {activeMock.sprintsChange}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 leading-none">{activeMock.sprintsCount}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Sprints completed</p>
                </div>

                {/* Tasks completed */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <CheckOutlineIcon />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] rounded-full">
                      ▲ {activeMock.tasksChange}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 leading-none">{activeMock.tasksCompleted}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Tasks completed</p>
                </div>

                {/* Avg productivity */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                      <TargetIcon />
                    </div>
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 font-bold text-[10px] rounded-full ${
                      activeMock.productivityChange.startsWith("-") 
                        ? "bg-red-50 text-red-500" 
                        : "bg-green-50 text-green-600"
                    }`}>
                      {activeMock.productivityChange.startsWith("-") ? "▼" : "▲"} {activeMock.productivityChange.replace("- ", "").replace("+ ", "")}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl md:text-2xl text-slate-900 leading-none">{activeMock.avgProductivity}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Avg productivity</p>
                </div>

              </div>

              {/* 2. Charts Layout grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Charts Column */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Weekly Productivity Bar Chart */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Weekly productivity</h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                        Focus minutes
                      </span>
                    </div>

                    {/* Vector Bar Heights */}
                    <div className="flex items-end justify-between h-48 px-2">
                      {activeMock.weeklyProductivity.map((val, idx) => {
                        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                        const isThursday = idx === 3;
                        const percentHeight = Math.min(100, (val / 120) * 100);
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2.5 flex-1">
                            <div className="w-full flex flex-col justify-end h-36 items-center px-1.5 md:px-3.5 relative group">
                              {/* Hover value tooltip */}
                              <div className="absolute -top-6 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none z-10">
                                {val}m
                              </div>
                              
                              <div 
                                className={`w-full rounded-md transition-all duration-500 ${
                                  isThursday ? "bg-[#7c3aed] shadow-lg shadow-purple-500/20" : "bg-purple-100 hover:bg-purple-200"
                                }`}
                                style={{ height: `${percentHeight}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-slate-400">{days[idx]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monthly Focus Trend Line Chart */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Monthly focus trend</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 border border-green-200/30 text-green-600 font-bold px-2 py-0.5 rounded-full">
                        ↗ +18% vs last month
                      </span>
                    </div>

                    {/* SVG Curve line graph */}
                    <div className="relative h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        {/* Fill Area */}
                        <path 
                          d="M 0 150 L 0 120 Q 80 110 100 100 T 200 80 T 300 70 T 400 45 T 500 20 L 500 150 Z" 
                          fill="url(#areaGrad)"
                        ></path>
                        {/* Stroke Curve Line */}
                        <path 
                          d="M 0 120 Q 80 110 100 100 T 200 80 T 300 70 T 400 45 T 500 20" 
                          fill="none" 
                          stroke="#7c3aed" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        ></path>
                        {/* Data Point nodes */}
                        <circle cx="0" cy="120" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                        <circle cx="100" cy="100" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                        <circle cx="200" cy="80" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                        <circle cx="300" cy="70" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                        <circle cx="400" cy="45" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                        <circle cx="500" cy="20" r="4.5" fill="#7c3aed" stroke="white" strokeWidth="1.5"></circle>
                      </svg>
                      
                      {/* Labels Row */}
                      <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 mt-2 select-none">
                        <span>W1</span>
                        <span>W2</span>
                        <span>W3</span>
                        <span>W4</span>
                        <span>W5</span>
                        <span>W6</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Charts Column */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Task Completion Donut Ring */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-5">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Task completion</h3>
                    
                    <div className="flex items-center justify-center py-2">
                      <div className="relative w-36 h-36 flex items-center justify-center select-none">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-slate-100" cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="10"></circle>
                          <circle 
                            className="text-[#7c3aed] transition-all duration-500" 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="transparent" 
                            stroke="currentColor" 
                            strokeWidth="10.5"
                            strokeDasharray={donutCircumference}
                            strokeDashoffset={donutOffset}
                            strokeLinecap="round"
                          ></circle>
                        </svg>
                        <div className="absolute text-center">
                          <div className="font-heading font-extrabold text-2xl text-slate-900">{activeMock.donutPercent}%</div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">completed</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                          <span className="text-slate-500">Completed</span>
                        </div>
                        <span className="text-slate-900 font-bold">{timeFilter === "week" ? "41 tasks" : timeFilter === "month" ? "182 tasks" : "1,942 tasks"}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                          <span className="text-slate-500">Remaining</span>
                        </div>
                        <span className="text-slate-900 font-bold">{timeFilter === "week" ? "12 tasks" : timeFilter === "month" ? "35 tasks" : "158 tasks"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Streak History contribution grid */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-4">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Streak history</h3>
                    
                    {/* Purple grid blocks */}
                    <div className="grid grid-cols-8 gap-1.5 max-w-[240px] mx-auto pt-2 select-none">
                      {Array.from({ length: 32 }).map((_, blockIdx) => {
                        const shades = ["bg-purple-100", "bg-purple-300", "bg-purple-400", "bg-purple-600", "bg-[#7c3aed]"];
                        const shade = shades[blockIdx % 5];
                        return (
                          <div 
                            key={blockIdx} 
                            className={`w-6 h-6 rounded-md ${shade} shadow-sm shadow-purple-500/5`}
                          ></div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-2">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-purple-100"></span>
                        <span className="w-2.5 h-2.5 rounded bg-purple-300"></span>
                        <span className="w-2.5 h-2.5 rounded bg-purple-400"></span>
                        <span className="w-2.5 h-2.5 rounded bg-[#7c3aed]"></span>
                      </div>
                      <span>More</span>
                    </div>

                    {/* Footer reward summaries */}
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#7c3aed]">
                        <LightningIcon />
                        <span>2,480 XP this month</span>
                      </div>
                      <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed font-semibold pl-6">
                        Best month yet — keep going!
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
