"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [userEmail, setUserEmail] = useState("fahim@sprintflow.io");
  const [xp, setXp] = useState(2480);
  const [coins, setCoins] = useState(240);
  const [streak, setStreak] = useState(5);
  const [streakDays, setStreakDays] = useState<boolean[]>([true, true, true, true, true, false]);
  const [completedSprintsCount, setCompletedSprintsCount] = useState(1);
  const [totalPlannedSprints, setTotalPlannedSprints] = useState(5);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, name: "Review PR #218 from Sara", duration: "15 min • 1 sprint", priority: "Medium", completed: false },
    { id: 2, name: "Write sprint retro notes", duration: "20 min • 1 sprint", priority: "Low", completed: false },
    { id: 3, name: "Prep design handoff", duration: "30 min • 1 sprint", priority: "High", completed: false }
  ]);

  const [isSprintActive, setIsSprintActive] = useState(false);
  const [sprintTimeRemaining, setSprintTimeRemaining] = useState(25 * 60);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSummaryView, setShowSummaryView] = useState(false);

  // Fetch me on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name);
        setUserEmail(data.user.email);
        setTasks(data.user.tasks || []);
        setXp(data.user.rewards.xp);
        setCoins(data.user.rewards.coins);
        setStreak(data.user.rewards.streak);
        setStreakDays(data.user.rewards.streakDays || [true, true, true, true, true, false]);
        setCompletedSprintsCount(data.user.planner.completedSprintsCount);
        setTotalPlannedSprints(data.user.settings.dailyGoal || 5);
        setLoading(false);
      } catch (err) {
        console.error("Fetch me error:", err);
        router.push("/login");
      }
    };
    fetchMe();
  }, []);

  // Goal progress based on completed tasks
  const baseCompletedSprints = Math.max(0, totalPlannedSprints - 2);
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const currentCompletedSprints = Math.min(totalPlannedSprints, baseCompletedSprints + completedTasksCount);
  const progressRatio = currentCompletedSprints / totalPlannedSprints;

  // Auto transition to summary view if 100% sprints done (5/5)
  useEffect(() => {
    if (currentCompletedSprints >= totalPlannedSprints && !loading) {
      setShowSummaryView(true);
    }
  }, [currentCompletedSprints, loading, totalPlannedSprints]);

  // SVG circular properties for active goals
  const circleCircumference = 314.16; // 2 * PI * 50 (Radius 50)
  const circleOffset = circleCircumference * (1 - progressRatio);

  // SVG circular properties for recap banner
  const ringCircumference = 282.74; // 2 * PI * 45 (Radius 45)
  const ringOffset = ringCircumference * (1 - 1.0); // 100% complete for summary view

  // Task Completion handler
  const handleToggleTask = async (id: number) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });
    } catch (err) {
      console.error("Save tasks error:", err);
    }
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

  // Render Loader if active
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
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase select-none">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">Level 12 • Pro</p>
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

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans relative">
      
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
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">
                {showSummaryView ? "Daily Summary" : `Good morning, ${userName.split(" ")[0]} 👋`}
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">
                {showSummaryView 
                  ? "Saturday, June 27 · End of day recap" 
                  : `Saturday, June 27 • You have ${totalPlannedSprints} sprints planned today`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Visual preview toggle button */}
            <button 
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showSummaryView 
                  ? "bg-purple-100 border-purple-200 text-[#7c3aed]" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setShowSummaryView(!showSummaryView)}
            >
              {showSummaryView ? "👁 View Goals" : "🎉 View Recap"}
            </button>

            {showSummaryView ? (
              <button 
                className="h-10 px-4 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer bg-white"
                onClick={() => alert("Daily recap shared successfully!")}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span className="hidden sm:inline">Share recap</span>
                <span className="sm:hidden">Share</span>
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </header>

        {/* Dashboard Grid Area */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {showSummaryView ? (
            /* ========================================================================= */
            /* --- STATE B: DAILY SUMMARY END-OF-DAY RECAP STATE --- */
            /* ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
              
              {/* Left Column widgets */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. Day Complete Banner Card */}
                <div className="bg-[#4f46e5] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg border border-purple-500/10">
                  {/* Floating Tilted Confetti Highlights */}
                  <div className="absolute top-8 left-[60%] w-2.5 h-5 bg-yellow-400 transform rotate-12 opacity-80 rounded-sm"></div>
                  <div className="absolute top-20 left-[75%] w-2 h-3.5 bg-blue-300 transform -rotate-45 opacity-60 rounded-sm"></div>
                  <div className="absolute bottom-12 left-[62%] w-3 h-3 bg-purple-300 rounded-full opacity-70"></div>
                  <div className="absolute top-10 left-[68%] w-2.5 h-2.5 bg-green-400 transform rotate-45 opacity-75"></div>
                  <div className="absolute bottom-16 left-[80%] w-2 h-5 bg-pink-400 transform rotate-12 opacity-85 rounded-sm"></div>
                  <div className="absolute top-16 left-[82%] w-3 h-3 bg-[#818cf8] transform rotate-12 opacity-60"></div>

                  <div className="space-y-4 md:max-w-[70%]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                      🏆 Goal achieved · 100%
                    </span>
                    <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-tight">
                      Day complete. Brilliant work! 🎉
                    </h2>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
                      You finished all 5 sprints and logged 2h 5m of deep focus. Your streak is now 8 days strong.
                    </p>
                    
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white select-none">
                        ⚡ +320 XP
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white select-none">
                        🪙 +45 coins
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white select-none">
                        🔥 Streak +1
                      </span>
                    </div>
                  </div>

                  {/* Fully completed progress ring */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center select-none bg-white/5 rounded-full p-2 border border-white/5">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-white/10" cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="6"></circle>
                      <circle 
                        className="text-white" 
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
                    <div className="absolute text-center text-white">
                      <div className="font-heading font-extrabold text-2xl">5/5</div>
                      <div className="text-[8px] uppercase font-bold tracking-widest text-white/60 mt-0.5">sprints</div>
                    </div>
                  </div>
                </div>

                {/* 2. Stats cards row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* Focus Time */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <ClockOutlineIcon />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-none">2h 05m</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Focus time</p>
                  </div>

                  {/* Sprints Done */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mb-4">
                      <LightningIcon />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-none">5 / 5</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Sprints done</p>
                  </div>

                  {/* Tasks Completed */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                      <CheckOutlineIcon />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-none">6</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Tasks completed</p>
                  </div>

                  {/* Avg Productivity */}
                  <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                      <TargetIcon />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-none">87%</h3>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium">Productivity</p>
                  </div>

                </div>

                {/* 3. Completed Sprints Cards */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Completed sprints</h3>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-50 border border-green-200/30 text-green-600 text-xs font-bold">
                      ✓ 5 done
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 leading-tight">OAuth providers & routes</h4>
                          <p className="text-[10px] text-slate-400 mt-1">9:00 AM · 25 min</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-bold">
                        ⚡ +40 XP
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 leading-tight">Debug dashboard slow-load</h4>
                          <p className="text-[10px] text-slate-400 mt-1">9:30 AM · 30 min</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-bold">
                        ⚡ +45 XP
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 leading-tight">Q3 product update email</h4>
                          <p className="text-[10px] text-slate-400 mt-1">10:05 AM · 20 min</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-bold">
                        ⚡ +35 XP
                      </span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 leading-tight">Review Sara's PR #218</h4>
                          <p className="text-[10px] text-slate-400 mt-1">10:30 AM · 15 min</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-bold">
                        ⚡ +30 XP
                      </span>
                    </div>

                    {/* Item 5 */}
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800 leading-tight">Onboarding empty states</h4>
                          <p className="text-[10px] text-slate-400 mt-1">11:00 AM · 25 min</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-[#7c3aed] text-xs font-bold">
                        ⚡ +40 XP
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column widgets */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Level Card */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#7c3aed] text-white font-heading font-extrabold flex items-center justify-center select-none shadow-sm">
                      12
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Level 12</h4>
                      <p className="text-[10px] text-green-500 font-bold mt-0.5">+320 XP earned today</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7c3aed] rounded-full transition-all duration-500" style={{ width: "80%" }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                      <span>2,480 XP</span>
                      <span>520 to Lvl 13</span>
                    </div>
                  </div>
                </div>

                {/* Tomorrow's Preview Card */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-5">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Tomorrow's preview</h3>
                  
                  <div className="bg-slate-50 border border-slate-200/40 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0 text-xs">
                      📅
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-slate-800 leading-tight">4 sprints queued</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">Starts 9:00 AM · ~1h 40m focus</p>
                    </div>
                  </div>

                  <button 
                    className="w-full btn btn-primary h-11 text-xs md:text-sm font-bold shadow-sm"
                    onClick={() => {
                      alert("Tomorrow's focus backlog imported!");
                      router.push("/tasks");
                    }}
                  >
                    Plan tomorrow ➔
                  </button>
                </div>

              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* --- STATE A: ORIGINAL ACTIVE SPRINT/TASKS STATE --- */
            /* ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Grid Widgets */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Today's Goal Card */}
                <div className="bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-lg border border-purple-500/10">
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  {/* Circle Progress SVG */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center select-none bg-white/5 rounded-full p-2 border border-white/5">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle className="text-white/10" cx="60" cy="60" r="50" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
                      <circle 
                        className="text-white transition-all duration-500" 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8.5"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleOffset}
                        strokeLinecap="round"
                      ></circle>
                    </svg>
                    <div className="absolute text-center">
                      <div className="font-heading font-extrabold text-xl">{Math.round(progressRatio * 100)}%</div>
                      <div className="text-[7px] uppercase font-bold tracking-widest text-white/70 mt-0.5">completed</div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-center md:text-left">
                    <h2 className="font-heading font-extrabold text-lg md:text-xl leading-tight">Today's Focus Goal</h2>
                    <p className="text-xs text-white/80 leading-relaxed max-w-md font-medium">
                      Complete {totalPlannedSprints} sprints to hit 100%. Checking off upcoming tasks reactively boosts your progress metrics.
                    </p>
                    
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] text-white/60 font-bold uppercase tracking-wider">
                        <span>Daily Progress</span>
                        <span>{currentCompletedSprints} / {totalPlannedSprints} Sprints</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressRatio * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sprints checklist Widget */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-6">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Upcoming Tasks</h3>
                  
                  <div className="space-y-3.5">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-1">
                        <label className="flex items-center gap-3.5 cursor-pointer text-xs md:text-sm font-medium">
                          <input 
                            type="checkbox" 
                            className="w-4.5 h-4.5 rounded text-[#7c3aed] border-slate-300 focus:ring-[#7c3aed] transition-colors"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                          />
                          <span className={`text-slate-700 select-none font-semibold transition-all ${task.completed ? "line-through text-slate-400" : ""}`}>
                            {task.name}
                          </span>
                        </label>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] md:text-xs text-slate-400 font-medium">{task.duration}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === "High" ? "bg-red-50 text-red-500 border border-red-100/40" :
                            task.priority === "Medium" ? "bg-orange-50 text-orange-500 border border-orange-100/40" :
                            "bg-green-50 text-green-500 border border-green-100/40"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Grid Widgets */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Sprint Timer Widget */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Current Sprint</h3>
                    <span className={`w-2.5 h-2.5 rounded-full ${isSprintActive ? "bg-red-500 animate-ping" : "bg-slate-300"}`}></span>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-5 text-center space-y-3">
                    <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-tight">OAuth Provider Integrations</h4>
                    <p className="font-mono font-bold text-3xl md:text-4xl text-[#7c3aed] leading-none py-2 tracking-tight">
                      {isSprintActive ? `Ticking: ${formatTimer(sprintTimeRemaining)}` : "25:00"}
                    </p>
                    
                    <button 
                      className={`w-full btn h-11 text-xs md:text-sm font-extrabold gap-2 border transition-all ${
                        isSprintActive 
                          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100/60" 
                          : "bg-purple-600 border-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/10"
                      }`}
                      onClick={() => setIsSprintActive(!isSprintActive)}
                    >
                      {isSprintActive ? "Pause Sprint" : "Start Sprint"}
                    </button>
                  </div>
                </div>

                {/* Level Up widget */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#7c3aed] text-white font-heading font-extrabold flex items-center justify-center select-none shadow-sm">
                      12
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Level 12</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{3000 - xp} XP until Level 13</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: `${(xp / 3000) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                      <span>{xp} XP</span>
                      <span>3,000 XP</span>
                    </div>
                  </div>
                </div>

                {/* Streak widget */}
                <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">7-day streak 🔥</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {["M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          streakDays[idx] ? "bg-[#7c3aed] text-white shadow-sm" : "bg-slate-100 text-slate-400 border border-slate-200/40"
                        }`}>
                          {streakDays[idx] ? "✓" : ""}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{day}</span>
                      </div>
                    ))}
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
