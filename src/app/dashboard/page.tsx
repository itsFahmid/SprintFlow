"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- SVG NAVIGATION & WIDGET ICONS ---
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

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-600">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LightningIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

// Logo SVG component
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

interface TaskItem {
  id: number;
  name: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export default function DashboardPage() {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, name: "Review PR #218 from Sara", duration: "15 min • 1 sprint", priority: "Medium", completed: false },
    { id: 2, name: "Write sprint retro notes", duration: "20 min • 1 sprint", priority: "Low", completed: false },
    { id: 3, name: "Prep design handoff", duration: "30 min • 1 sprint", priority: "High", completed: false }
  ]);

  const [isSprintActive, setIsSprintActive] = useState(false);
  const [sprintTimeRemaining, setSprintTimeRemaining] = useState(25 * 60);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Goal progress based on completed tasks
  const baseCompletedSprints = 3;
  const totalPlannedSprints = 5;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const currentCompletedSprints = Math.min(totalPlannedSprints, baseCompletedSprints + completedTasksCount);
  const progressRatio = currentCompletedSprints / totalPlannedSprints;

  // SVG circular properties
  const circleCircumference = 314.16; // 2 * PI * 50 (Radius 50)
  const circleOffset = circleCircumference * (1 - progressRatio);

  // Task Completion handler
  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSprintActive && sprintTimeRemaining > 0) {
      interval = setInterval(() => {
        setSprintTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (sprintTimeRemaining === 0 && isSprintActive) {
      setIsSprintActive(false);
      setSprintTimeRemaining(25 * 60);
      alert("Sprint completed! Good job!");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSprintActive, sprintTimeRemaining]);

  const formatTimer = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Navigation menu shared JSX
  const navigationLinks = (
    <ul className="space-y-1.5 list-none p-0">
      <li>
        <Link href="/dashboard" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
          <DashboardIcon />
          Dashboard
        </Link>
      </li>
      <li>
        <a href="#" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <TasksIcon />
          Tasks
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <PlannerIcon />
          Planner
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <SprintsIcon />
          Sprints
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <RewardsIcon />
          Rewards
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <AnalyticsIcon />
          Analytics
        </a>
      </li>
    </ul>
  );

  // Upgrade banner & profile block shared JSX
  const footerBlock = (
    <div className="space-y-6">
      {/* Go Pro Card */}
      <div className="bg-gradient-to-br from-[#7c3aed] to-[#6366f1] rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <h4 className="font-heading font-extrabold text-sm mb-1 uppercase tracking-wider text-white/90">Go Pro</h4>
        <p className="text-[11px] leading-normal text-white/80 mb-4">
          Unlock AI deep-planning & insights.
        </p>
        <Link href="/signup" className="block w-full bg-white text-[#7c3aed] hover:bg-slate-50 font-semibold py-2 px-4 rounded-xl text-center text-xs shadow-sm transition-colors">
          Upgrade
        </Link>
      </div>

      {/* User Profile */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-sm border border-indigo-100">
            FS
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">Fahim Siddique</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">Level 12 • Pro</p>
          </div>
        </div>
        <SettingsIcon />
      </div>
    </div>
  );

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

      {/* --- MOBILE NAVIGATION DRAWER (ACCESSIBILITY FIX) --- */}
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
            {/* Hamburger Button on Mobile */}
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
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Good morning, Fahim 👋</h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Saturday, June 27 • You have {totalPlannedSprints} sprints planned today</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-[180px] xl:w-[240px] pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>

            {/* Notification bell */}
            <button className="w-10 h-10 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors relative" aria-label="Notifications">
              <BellIcon />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Start Focus Button */}
            <button 
              className={`btn btn-primary h-10 px-4 md:px-5 text-xs md:text-sm gap-2 font-bold ${isSprintActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/10" : ""}`}
              onClick={() => setIsSprintActive(!isSprintActive)}
            >
              <LightningIcon />
              <span className="hidden sm:inline">{isSprintActive ? "Pause Focus" : "Start Focus"}</span>
              <span className="sm:hidden">{isSprintActive ? "Pause" : "Focus"}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid Area */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Grid Widgets */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Today's Goal Card */}
              <div className="bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-lg border border-purple-500/10">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Circle Progress SVG */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center select-none">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle className="text-white/10" cx="60" cy="60" r="50" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
                    <circle 
                      className="text-white transition-all duration-500" 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="8"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={circleOffset}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute text-center">
                    <div className="font-heading font-extrabold text-xl leading-none">{currentCompletedSprints}/{totalPlannedSprints}</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-85 mt-1">sprints</div>
                  </div>
                </div>

                {/* Card copy */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Today's Goal</span>
                  <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-none">Finish 5 focus sprints</h2>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-md">
                    You're {Math.round(progressRatio * 100)}% there — 2h 5m of focused work logged. Keep the streak alive!
                  </p>
                  
                  {/* Linear Progress Bar */}
                  <div className="pt-2">
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        style={{ width: `${progressRatio * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* XP */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mb-4">
                    <LightningIcon />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">2,480</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Total XP</p>
                </div>

                {/* Focus Time */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0284c7] flex items-center justify-center mb-4">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">4h 25m</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Focus Time</p>
                </div>

                {/* Coins */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center mb-4">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">340</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Coins</p>
                </div>

                {/* Productivity */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-green-50 text-[#16a34a] flex items-center justify-center mb-4">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">87%</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Productivity</p>
                </div>
              </div>

              {/* Current Sprint */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Current Sprint</h3>
                  <a href="#" className="text-xs text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">View plan ➔</a>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {isSprintActive ? `Ticking: ${formatTimer(sprintTimeRemaining)}` : "Sprint 4 • Implement auth flow"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>⏱ 25 min</span>
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        <span className="text-red-500 font-semibold uppercase tracking-wider text-[10px]">High priority</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    className={`btn btn-primary h-10 px-6 text-xs font-bold gap-2 w-full sm:w-auto shadow-sm ${isSprintActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/10" : ""}`}
                    onClick={() => setIsSprintActive(!isSprintActive)}
                  >
                    {isSprintActive ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"></polygon></svg>
                        Start
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Upcoming Tasks</h3>
                  <a href="#" className="text-xs text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">See all ➔</a>
                </div>

                <div className="divide-y divide-slate-100">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded text-[#7c3aed] border-slate-300 focus:ring-[#7c3aed] cursor-pointer"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                        />
                        <div>
                          <p className={`text-sm font-semibold leading-tight transition-all duration-300 ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {task.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">{task.duration}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        task.priority === "High" ? "bg-red-50 border-red-200 text-red-500" : 
                        task.priority === "Medium" ? "bg-orange-50 border-orange-200 text-orange-500" : 
                        "bg-green-50 border-green-200 text-green-500"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Level Card */}
              <div className="bg-[#5c28e2] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-purple-600/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white text-[#5c28e2] font-heading font-extrabold text-xl rounded-full flex items-center justify-center shadow-md">
                    12
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base leading-tight">Level 12 • Focus Architect</h3>
                    <p className="text-xs text-white/70 mt-0.5">520 XP to Level 13</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50 pt-1">
                    <span>2,480 XP</span>
                    <span>3,000 XP</span>
                  </div>
                </div>
              </div>

              {/* Streak Widget */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">Streak</h3>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-orange-50 text-[#ea580c] text-2xl rounded-2xl flex items-center justify-center">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">7 days</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Longest streak: 14 days</p>
                  </div>
                </div>

                {/* Weekday check bubbles */}
                <div className="grid grid-cols-7 gap-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                    const isChecked = idx < 6;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isChecked ? "bg-[#7c3aed] text-white shadow-sm shadow-purple-500/10" : "bg-slate-100 text-slate-400 border border-slate-200/40"
                        }`}>
                          {isChecked ? "✓" : ""}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Focus */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Weekly Focus</h3>
                  <a href="#" className="text-xs text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">Details ➔</a>
                </div>

                {/* Bar chart mockup */}
                <div className="flex items-end justify-between h-36 px-2">
                  {[
                    { day: "M", val: 24 },
                    { day: "T", val: 48 },
                    { day: "W", val: 36 },
                    { day: "T", val: 80, active: true },
                    { day: "F", val: 62 },
                    { day: "S", val: 18 },
                    { day: "S", val: 56 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full flex justify-center h-28 items-end px-1.5">
                        <div 
                          className={`w-full rounded-md transition-all duration-500 ${
                            bar.active ? "bg-[#7c3aed] shadow-lg shadow-purple-500/20" : "bg-purple-100"
                          }`}
                          style={{ height: `${bar.val}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
