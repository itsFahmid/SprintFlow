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
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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

const CupIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="2" x2="6" y2="4"></line>
    <line x1="10" y1="2" x2="10" y2="4"></line>
    <line x1="14" y1="2" x2="14" y2="4"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const WorkIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" className="text-green-200 fill-green-50"></circle>
    <polyline points="16 9 11 14 8 11" className="text-green-600" strokeLinecap="round" strokeLinejoin="round"></polyline>
  </svg>
);

export default function PlannerPage() {
  const router = useRouter();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [completedSprints, setCompletedSprints] = useState(1);
  const [totalPlannedSprints, setTotalPlannedSprints] = useState(5);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch me on mount
  useEffect(() => {
    const initPlanner = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name);
        setCompletedSprints(data.user.planner.completedSprintsCount || 0);
        setTotalPlannedSprints(data.user.settings.dailyGoal || 5);
        setLoading(false);
      } catch (err) {
        console.error("Planner load error:", err);
        router.push("/login");
      }
    };
    initPlanner();
  }, []);

  const progressRatio = completedSprints / totalPlannedSprints;

  // SVG Circular Stats Ring
  const ringCircumference = 282.74; // 2 * PI * 45
  const ringOffset = ringCircumference * (1 - progressRatio);

  const handleStartDay = () => {
    router.push("/sprints");
  };

  // Sidebar navigation lists
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
        <Link href="/planner" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
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

      {/* Profile Footer */}
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
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading workspace...</p>
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
            {/* Hamburger button on Mobile */}
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
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Daily Plan</h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Saturday, June 27 • {totalPlannedSprints} sprints • 1h 55m focus</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Date selection controls */}
            <div className="inline-flex items-center bg-white border border-slate-200/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm select-none">
              <span className="cursor-pointer hover:text-slate-900 px-1">◀</span>
              <span className="px-3">Today</span>
              <span className="cursor-pointer hover:text-slate-900 px-1">▶</span>
            </div>

            {/* Start Day button */}
            <button 
              className="btn btn-primary h-10 px-5 text-xs md:text-sm font-bold gap-2"
              onClick={handleStartDay}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"></polygon></svg>
              Start Day
            </button>
          </div>
        </header>

        {/* Daily Planner Workspace */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Timeline list */}
            <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-purple-600">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <h2 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Today's Timeline</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7c3aed] text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
                  Now - 9:18 AM
                </span>
              </div>

              {/* Timeline Flow */}
              <div className="relative border-l border-slate-100 ml-4 pl-8 space-y-6">
                
                {/* 1. Work Sprint 1 - 9:00 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-1.5 bg-slate-50 border border-slate-100 p-0.5 rounded-full z-10">
                    <CheckCircleIcon />
                  </div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    9:00
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                        <WorkIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-500 line-through">Work Sprint 1 — OAuth setup</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">25 min • High priority</p>
                      </div>
                    </div>
                    <span className="text-green-600 text-xs font-bold uppercase tracking-wider mr-2 select-none">✓ Done</span>
                  </div>
                </div>

                {/* 2. Break 1 - 9:25 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-1.5 bg-slate-50 border border-slate-100 p-0.5 rounded-full z-10">
                    <CheckCircleIcon />
                  </div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    9:25
                  </div>
                  
                  <div className="bg-green-50/30 border border-green-100/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <CupIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-500 line-through">Short Break</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">5 min • Stretch & water</p>
                      </div>
                    </div>
                    <span className="text-green-600 text-xs font-bold uppercase tracking-wider mr-2 select-none">✓ Done</span>
                  </div>
                </div>

                {/* 3. Work Sprint 2 - 9:30 */}
                <div className="relative">
                  <div className="absolute -left-[38px] top-2 w-4 h-4 bg-purple-200 border-2 border-white rounded-full z-10 shadow-[0_0_8px_#a78bfa]"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-extrabold text-[#7c3aed] text-right w-14">
                    9:30
                  </div>
                  
                  <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                    completedSprints === 1 
                      ? "border-[#7c3aed] bg-[#fdfcff] shadow-sm shadow-purple-500/5" 
                      : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        completedSprints === 1 ? "bg-purple-100 text-[#7c3aed]" : "bg-purple-50 text-slate-400"
                      }`}>
                        <WorkIcon />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-xs md:text-sm ${
                          completedSprints > 1 ? "text-slate-500 line-through" : "text-slate-900"
                        }`}>Work Sprint 2 — Debug dashboard</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">30 min • High priority</p>
                      </div>
                    </div>

                    {completedSprints === 1 ? (
                      <button 
                        className="btn btn-primary h-9 px-5 text-xs font-bold gap-2 w-full sm:w-auto shadow-sm"
                        onClick={handleStartDay}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"></polygon></svg>
                        Resume
                      </button>
                    ) : (
                      <span className="text-green-600 text-xs font-bold uppercase tracking-wider mr-2 select-none">✓ Done</span>
                    )}
                  </div>
                </div>

                {/* 4. Break 2 - 10:00 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    10:00
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <CupIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-400">Short Break</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">5 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Work Sprint 3 - 10:05 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    10:05
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <WorkIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-400">Work Sprint 3 — Q3 update email</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">20 min • Medium priority</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Break 3 - 10:25 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    10:25
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <CupIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-400">Short Break</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">5 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Work Sprint 4 - 10:30 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    10:30
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <WorkIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-400">Work Sprint 4 — Review PR #218</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">15 min • Medium priority</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Long Break - 10:45 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    10:45
                  </div>
                  
                  <div className="bg-orange-50/20 border border-orange-100/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <MoonIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-orange-500">Long Break</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">15 min • Recharge</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. Work Sprint 5 - 11:00 */}
                <div className="relative">
                  <div className="absolute -left-[36px] top-2.5 w-3 h-3 bg-slate-200 border-2 border-white rounded-full z-10"></div>
                  <div className="absolute -left-[96px] top-2.5 text-[11px] font-bold text-slate-400 text-right w-14">
                    11:00
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <WorkIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-400">Work Sprint 5 — Onboarding states</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1">25 min • Low priority</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Stats and tips */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Today at a Glance Stats */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Today at a glance</h3>
                
                {/* Circular progress stat */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-36 h-36 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-slate-100" cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="6"></circle>
                      <circle 
                        className="text-[#7c3aed] transition-all duration-500" 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="6.5"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                        strokeLinecap="round"
                      ></circle>
                    </svg>
                    <div className="absolute text-center">
                      <div className="font-heading font-extrabold text-2xl text-slate-900">{completedSprints}/{totalPlannedSprints}</div>
                      <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">sprints done</div>
                    </div>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-4 pt-2 border-t border-slate-50">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        ⏱
                      </div>
                      <span className="font-medium text-slate-500">Total focus</span>
                    </div>
                    <span className="font-bold text-slate-900">1h 55m</span>
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center">
                        ⚡
                      </div>
                      <span className="font-medium text-slate-500">Work sprints</span>
                    </div>
                    <span className="font-bold text-slate-900">{totalPlannedSprints} sprints</span>
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        🍵
                      </div>
                      <span className="font-medium text-slate-500">Breaks</span>
                    </div>
                    <span className="font-bold text-slate-900">4 breaks</span>
                  </div>
                </div>

              </div>

              {/* Focus Tip Advice */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-[#7c3aed] text-sm font-bold">
                  <span>⚡</span>
                  <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900">Focus tip</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Your peak focus is mid-morning. We front-loaded your hardest sprints before 10:30 AM.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
