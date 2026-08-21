"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExitFocusModal from "@/components/ExitFocusModal";
import NotificationCenter from "@/components/NotificationCenter";
import SprintInterruptedModal from "@/components/SprintInterruptedModal";
import SprintDetailDrawer, { SprintDetailData } from "@/components/SprintDetailDrawer";
import CarryOverModal from "@/components/CarryOverModal";

// --- SVG ICONS ---
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
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const RewardsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
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
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-600 transition-colors">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoSVG = () => (
  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#7c3aed" fillOpacity="0.6"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#7c3aed" fillOpacity="0.8"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#7c3aed"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#7c3aed" />
  </svg>
);

const WhiteLogoSVG = () => (
  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#ffffff" fillOpacity="0.6"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#ffffff" fillOpacity="0.8"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#ffffff"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#ffffff" />
  </svg>
);

const StretchIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-emerald-400">
    <circle cx="12" cy="5" r="1"></circle>
    <path d="m9 22 1-6 1-4 2-2 1 1v4h2"></path>
    <path d="m14 10-1-1-3-1-3 2"></path>
  </svg>
);

const HydrateIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-emerald-400">
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>
  </svg>
);

export default function SprintsPage() {
  const router = useRouter();

  // Mode: "history" (Screen 44: Sprints History) | "timer" (Screen 20/21/45: Focus Clock)
  const [pageMode, setPageMode] = useState<"history" | "timer">("history");
  const [historyTab, setHistoryTab] = useState<"week" | "month" | "all">("week");

  // --- TIMER STATES ---
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(1);
  const [sprintState, setSprintState] = useState<"focus" | "break">("focus");
  
  // Timer countdowns
  const [focusTime, setFocusTime] = useState(18 * 60 + 24); // 18:24 for paused demo
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [focusMaxSecs, setFocusMaxSecs] = useState(25 * 60);
  const [breakMaxSecs, setBreakMaxSecs] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Paused state by default for Screen 45
  
  // Modals & Drawers
  const [showExitModal, setShowExitModal] = useState(false);
  const [showInterruptedModal, setShowInterruptedModal] = useState(false);
  const [selectedSprintDetail, setSelectedSprintDetail] = useState<SprintDetailData | null>(null);
  const [showCarryOverModal, setShowCarryOverModal] = useState(false);

  // User Profile & Metrics
  const [userName, setUserName] = useState("Fahim Siddique");
  const [xp, setXp] = useState(2480);
  const [coins, setCoins] = useState(240);
  const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
  const [sprintTitles, setSprintTitles] = useState<string[]>([
    "Sprint 1 · OAuth providers & routes",
    "Debug dashboard slow-load",
    "Sprint 3 · Q3 product update email",
    "Sprint 4 · Review Sara's PR #218",
    "Sprint 5 · Plan next sprint & groom backlog"
  ]);

  // Fetch metrics on mount
  useEffect(() => {
    const initSprints = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name || "Fahim Siddique");
        
        const sprintCount = data.user.planner.completedSprintsCount || 0;
        setCompletedCount(sprintCount);
        localStorage.setItem("sprintflow_completed_sprints", sprintCount.toString());

        const fLength = (data.user.settings?.sprintLength || 25) * 60;
        const bLength = (data.user.settings?.breakLength || 5) * 60;
        setFocusMaxSecs(fLength);
        setBreakTime(bLength);
        setBreakMaxSecs(bLength);

        setXp(data.user.rewards.xp);
        setCoins(data.user.rewards.coins);
        setRewardsHistory(data.user.rewards.history || []);

        try {
          const sprintsRes = await fetch("/api/sprints");
          if (sprintsRes.ok) {
            const sprintsData = await sprintsRes.json();
            if (sprintsData?.sprints?.length > 0) {
              setSprintTitles(sprintsData.sprints.map((s: any) => s.title || "Focus sprint"));
            }
          }
        } catch (_) {}

        setLoading(false);
      } catch (err) {
        console.error("Sprint clock init error:", err);
        router.push("/login");
      }
    };
    initSprints();
  }, [router]);

  // Timer interval hook
  useEffect(() => {
    if (pageMode !== "timer") return;
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (sprintState === "focus") {
          setFocusTime((prev) => {
            if (prev <= 1) {
              handleFocusComplete();
              return focusMaxSecs;
            }
            return prev - 1;
          });
        } else {
          setBreakTime((prev) => {
            if (prev <= 1) {
              handleResumeFocus();
              return breakMaxSecs;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pageMode, isTimerRunning, sprintState, focusMaxSecs, breakMaxSecs]);

  const reportSprintCompletion = async (nextCompletedCount: number) => {
    try {
      await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedSprintsCount: nextCompletedCount,
          isCompleted: nextCompletedCount >= 5
        })
      });

      const updatedXp = xp + 40;
      const updatedCoins = coins + 5;
      const updatedHistory = [
        {
          id: `rew-${Date.now()}`,
          title: `Completed Sprint ${nextCompletedCount}`,
          time: "Just now",
          xp: 40,
          coins: 5
        },
        ...rewardsHistory
      ];

      setXp(updatedXp);
      setCoins(updatedCoins);
      setRewardsHistory(updatedHistory);

      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rewards: {
            xp: updatedXp,
            coins: updatedCoins,
            history: updatedHistory
          }
        })
      });
    } catch (err) {
      console.error("Sprint completion reporting failed:", err);
    }
  };

  const handleFocusComplete = async () => {
    const nextCompleted = completedCount + 1;
    setCompletedCount(nextCompleted);
    localStorage.setItem("sprintflow_completed_sprints", nextCompleted.toString());
    
    setSprintState("break");
    setIsTimerRunning(true);

    await reportSprintCompletion(nextCompleted);
  };

  const handleResumeFocus = () => {
    setSprintState("focus");
    setIsTimerRunning(true);
  };

  const handleExitFocus = () => {
    setShowExitModal(true);
  };

  const handleAddNote = () => {
    const note = prompt("Add a quick note or distraction log for this sprint:");
    if (note) alert(`Note saved: "${note}"`);
  };

  // Helper formatting min:sec
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Circumferences
  const focusCircumference = 565.48;
  const focusOffset = focusCircumference * (1 - (focusTime / (focusMaxSecs || 1)));
  const breakCircumference = 565.48;
  const breakOffset = breakCircumference * (1 - (breakTime / (breakMaxSecs || 1)));

  // Navigation Links for Screen 44 History
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
        <button
          onClick={() => setPageMode("history")}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150 text-left"
        >
          <SprintsIcon />
          Sprints
        </button>
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

  const footerBlock = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6366f1] text-white font-bold flex items-center justify-center text-xs shadow-md border-2 border-indigo-100 uppercase select-none">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">Level 12 · Pro</p>
          </div>
        </div>
        <Link href="/settings" className="p-1 rounded-lg hover:bg-slate-100 transition-colors" title="Settings">
          <SettingsIcon />
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading sprints...</p>
      </div>
    );
  }

  // =========================================================================
  // --- SCREEN 44: SPRINTS HISTORY VIEW ---
  // =========================================================================
  if (pageMode === "history") {
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
          
          {/* Header */}
          <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
            <div>
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Sprints</h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Every focus session you've logged</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl shadow-inner text-xs font-bold">
                {(["week", "month", "all"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setHistoryTab(tab)}
                    className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                      historyTab === tab
                        ? "bg-[#7c3aed] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowCarryOverModal(true)}
                className="h-10 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>📅</span>
                <span>Wrap up day</span>
              </button>

              <button
                onClick={() => setPageMode("timer")}
                className="h-10 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <span>⚡ Start Sprint</span>
                <span>➔</span>
              </button>

              <NotificationCenter />
            </div>
          </header>

          {/* Sprints History Content */}
          <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto animate-fade-in">
            
            {/* Top 4 KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-base">
                  ⚡
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">64</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Total sprints</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center text-base">
                  🕒
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">28h 40m</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Focus time</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                  🎯
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">92%</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Completion rate</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-base">
                  🔥
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-slate-900 leading-none">7 days</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Current streak</p>
                </div>
              </div>

            </div>

            {/* Main 2-Column Sprints Feed & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Sprints Logged by Day */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Day 1: Today */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900">Today</h3>
                      <span className="text-xs text-slate-400 font-medium">Sat, Jun 27 · 3 done · 1h 05m focus</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Sprint 1 */}
                    <div 
                      onClick={() => setSelectedSprintDetail({
                        id: "sp-1",
                        sprintNumber: 1,
                        title: "OAuth providers & routes",
                        dateStr: "Sat, Jun 27",
                        timeRange: "9:00–9:25 AM",
                        priority: "High",
                        xpEarned: 40,
                        focusedTime: "25:00",
                        plannedTime: "25:00",
                        pauseCount: 0,
                        distractionCount: 0,
                        checklist: ["Wire up Google provider", "Configure redirect routes", "Test authentication session"],
                        timeline: [
                          { action: "Started sprint", time: "9:00 AM", icon: "▶" },
                          { action: "Completed", time: "9:25 AM", icon: "✓" }
                        ]
                      })}
                      className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 1 · OAuth providers & routes</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>9:00 AM · 25 min</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-red-500 font-bold">● High</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">
                        ⚡ +40 XP
                      </span>
                    </div>

                    {/* Sprint 2 */}
                    <div 
                      onClick={() => setSelectedSprintDetail({
                        id: "sp-2",
                        sprintNumber: 2,
                        title: "Debug dashboard slow-load",
                        dateStr: "Sat, Jun 27",
                        timeRange: "9:30–10:00 AM",
                        priority: "High",
                        xpEarned: 45,
                        focusedTime: "28:42",
                        plannedTime: "30:00",
                        pauseCount: 1,
                        distractionCount: 0,
                        checklist: ["Profile network waterfall", "Add skeleton loaders", "Cache the initial query"],
                        timeline: [
                          { action: "Started sprint", time: "9:30 AM", icon: "▶" },
                          { action: "Paused", time: "9:42 AM · 1m", icon: "⏸" },
                          { action: "Resumed", time: "9:43 AM", icon: "▶" },
                          { action: "Completed", time: "10:00 AM", icon: "✓" }
                        ]
                      })}
                      className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 2 · Debug dashboard slow-load</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>9:30 AM · 30 min</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-red-500 font-bold">● High</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">
                        ⚡ +45 XP
                      </span>
                    </div>

                    {/* Sprint 3 (Skipped) */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-2xl opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                          ✕
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-600 line-through">Sprint 3 · Q3 product update email</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>10:05 AM · 20 min</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-amber-500 font-bold">● Medium</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                        Skipped
                      </span>
                    </div>

                    {/* Sprint 4 */}
                    <div 
                      onClick={() => setSelectedSprintDetail({
                        id: "sp-4",
                        sprintNumber: 4,
                        title: "Review Sara's PR #218",
                        dateStr: "Sat, Jun 27",
                        timeRange: "10:30–10:45 AM",
                        priority: "Medium",
                        xpEarned: 30,
                        focusedTime: "15:00",
                        plannedTime: "15:00",
                        pauseCount: 0,
                        distractionCount: 0,
                        checklist: ["Review diff", "Leave comments", "Approve PR"],
                        timeline: [
                          { action: "Started sprint", time: "10:30 AM", icon: "▶" },
                          { action: "Completed", time: "10:45 AM", icon: "✓" }
                        ]
                      })}
                      className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 4 · Review Sara's PR #218</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>10:30 AM · 15 min</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-amber-500 font-bold">● Medium</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">
                        ⚡ +30 XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day 2: Yesterday */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900">Yesterday</h3>
                      <span className="text-xs text-slate-400 font-medium">Fri, Jun 26 · 5 done · 2h 10m focus</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 1 · Refactor timer state machine</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">9:15 AM · 30 min · <span className="text-red-500 font-bold">● High</span></p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">⚡ +45 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 2 · Write release notes v2.1</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">9:50 AM · 25 min · <span className="text-emerald-500 font-bold">● Low</span></p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">⚡ +40 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 3 · Fix sign-up validation bug</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">10:25 AM · 20 min · <span className="text-amber-500 font-bold">● Medium</span></p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">⚡ +35 XP</span>
                    </div>
                  </div>
                </div>

                {/* Day 3: Thu, Jun 25 */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900">Thu, Jun 25</h3>
                      <span className="text-xs text-slate-400 font-medium">4 done · 1h 40m focus</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 1 · Design onboarding states</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">9:00 AM · 30 min · <span className="text-emerald-500 font-bold">● Low</span></p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">⚡ +40 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="font-semibold text-xs md:text-sm text-slate-900">Sprint 2 · Set up CI pipeline</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">9:40 AM · 25 min · <span className="text-amber-500 font-bold">● Medium</span></p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-full text-[10px] font-bold">⚡ +40 XP</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Weekly Breakdown & Highlights */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* This Week Chart Card */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">This week</h4>
                    <span className="text-xs font-bold text-[#7c3aed]">23 sprints</span>
                  </div>

                  {/* 7 Days Bar Chart */}
                  <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
                    {[
                      { day: "M", height: "60%", active: false },
                      { day: "T", height: "80%", active: false },
                      { day: "W", height: "70%", active: false },
                      { day: "T", height: "95%", active: true },
                      { day: "F", height: "40%", active: false },
                      { day: "S", height: "15%", active: false },
                      { day: "S", height: "75%", active: false }
                    ].map((col, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full bg-purple-50 rounded-lg flex items-end h-full p-0.5">
                          <div
                            className={`w-full rounded-md transition-all ${
                              col.active ? "bg-[#7c3aed] shadow-sm shadow-purple-500/20" : "bg-purple-200/60"
                            }`}
                            style={{ height: col.height }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{col.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streak Card */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shrink-0">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">7-day streak</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Best: 14 days</p>
                  </div>
                </div>

                {/* Most Focused Day */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">Thursday</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">7 sprints · 2h 55m focus</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>

        {/* Sprint Detail Drawer (Screen 48) */}
        <SprintDetailDrawer
          isOpen={!!selectedSprintDetail}
          onClose={() => setSelectedSprintDetail(null)}
          sprint={selectedSprintDetail}
          onViewTask={() => router.push("/tasks")}
          onRepeat={() => {
            setSelectedSprintDetail(null);
            setPageMode("timer");
            setIsTimerRunning(true);
          }}
        />

        {/* Carry Over Modal (Screen 49) */}
        <CarryOverModal
          isOpen={showCarryOverModal}
          onClose={() => setShowCarryOverModal(false)}
          onConfirm={(dest, tasks) => {
            alert(`Moved ${tasks.length} unfinished tasks to ${dest}.`);
          }}
        />

      </div>
    );
  }

  // =========================================================================
  // --- SCREEN 20, 21 & SCREEN 45: LIVE SPRINT TIMER VIEW ---
  // =========================================================================
  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-500 overflow-x-hidden ${
      sprintState === "focus" 
        ? "bg-[#120024] text-white" 
        : "bg-gradient-to-br from-[#115e59] to-[#022c22] text-white"
    }`}>
      
      {/* --- TOP HEADER ROW --- */}
      <header className="w-full flex items-center justify-between p-6 max-w-6xl mx-auto shrink-0 select-none">
        
        {/* Left Side Branding/Metadata */}
        <div className="flex items-center gap-3">
          {sprintState === "focus" ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold tracking-wide">
              ⚡ Sprint {completedCount + 1} of 5
            </span>
          ) : (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-semibold cursor-pointer"
              onClick={handleExitFocus}
            >
              ✕ Exit focus
            </button>
          )}
        </div>

        {/* Right Side Exit */}
        <div>
          {sprintState === "focus" ? (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-semibold cursor-pointer"
              onClick={handleExitFocus}
            >
              ✕ Exit focus
            </button>
          ) : (
            <button 
              className="flex items-center gap-1.5 hover:translate-x-1.5 transition-all text-xs font-bold uppercase tracking-widest text-emerald-400 cursor-pointer"
              onClick={handleResumeFocus}
            >
              Skip break ➔
            </button>
          )}
        </div>

      </header>

      {/* --- CENTER SECTION (TIMER) --- */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 text-center max-w-2xl mx-auto w-full select-none">
        
        {sprintState === "focus" ? (
          <div className="space-y-6 flex flex-col items-center animate-fade-in w-full">
            
            {/* Screen 45: Paused Badge */}
            {!isTimerRunning && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold tracking-wider uppercase shadow-inner">
                <span>⏸</span>
                <span>PAUSED</span>
              </div>
            )}

            {/* Circular Progress Gauge */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className={`transition-all duration-1000 ease-linear ${
                    isTimerRunning ? "stroke-purple-500" : "stroke-amber-400"
                  }`}
                  strokeWidth="8"
                  strokeDasharray={focusCircumference}
                  strokeDashoffset={focusOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-heading font-extrabold text-5xl md:text-6xl tracking-tight text-white font-mono">
                  {formatTimer(focusTime)}
                </span>
                <span className={`text-xs uppercase tracking-widest font-bold mt-2 flex items-center gap-1.5 ${
                  isTimerRunning ? "text-purple-300" : "text-amber-300"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTimerRunning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                  {isTimerRunning ? "Deep Focus" : "paused"}
                </span>
              </div>
            </div>

            {/* Active Sprint Name & Subtitle */}
            <div className="space-y-1 max-w-md">
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight">
                {sprintTitles[completedCount] || "Debug dashboard slow-load"}
              </h2>
              <p className="text-xs text-purple-300/80 font-medium">
                {!isTimerRunning
                  ? "Paused 1m 32s ago · take a breath and come back when you're ready."
                  : "Stay in the zone. One task at a time."}
              </p>
            </div>

            {/* Timer Controls Row (Screen 45: End sprint, Resume, Add note) */}
            <div className="flex items-center gap-6 pt-2">
              
              {/* End Sprint Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={handleFocusComplete}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-white/10 flex items-center justify-center text-sm transition-all cursor-pointer"
                  title="End sprint"
                >
                  ■
                </button>
                <span className="text-[11px] text-white/50 font-medium">End sprint</span>
              </div>

              {/* Resume / Play Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-16 h-16 rounded-full bg-white text-[#7c3aed] flex items-center justify-center text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
                  title={isTimerRunning ? "Pause sprint" : "Resume sprint"}
                >
                  {isTimerRunning ? "⏸" : "▶"}
                </button>
                <span className="text-xs text-white font-bold">{isTimerRunning ? "Pause" : "Resume"}</span>
              </div>

              {/* Add Note Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={handleAddNote}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 flex items-center justify-center text-sm transition-all cursor-pointer"
                  title="Add note"
                >
                  ✏️
                </button>
                <span className="text-[11px] text-white/50 font-medium">Add note</span>
              </div>

            </div>

          </div>
        ) : (
          <div className="space-y-8 flex flex-col items-center animate-fade-in w-full">
            
            {/* Rest Break Name */}
            <div className="space-y-2 max-w-md">
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-emerald-100 tracking-tight">
                Rest & Recharge Break
              </h2>
              <p className="text-xs text-emerald-200/80 font-medium">
                Step away from the screen, stretch and grab water.
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={breakCircumference}
                  strokeDashoffset={breakOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-heading font-extrabold text-5xl md:text-6xl tracking-tight text-white font-mono">
                  {formatTimer(breakTime)}
                </span>
                <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Break Time
                </span>
              </div>
            </div>

            {/* Health Nudges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs font-semibold">
                <StretchIcon />
                <span>Stretch your neck & shoulders</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs font-semibold">
                <HydrateIcon />
                <span>Drink a glass of water</span>
              </div>
            </div>

            <button
              onClick={handleResumeFocus}
              className="px-8 h-12 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Resume next sprint
            </button>

          </div>
        )}

      </div>

      {/* --- BOTTOM FOOTER: DAILY PROGRESS SEGMENT BAR --- */}
      <footer className="w-full p-6 max-w-2xl mx-auto shrink-0 select-none space-y-3">
        <div className="flex items-center justify-between text-xs text-white/70 font-semibold">
          <span>Daily progress</span>
          <span>{completedCount} of 5 sprints · {Math.max(0, 5 - completedCount)} to go</span>
        </div>

        <div className="grid grid-cols-5 gap-2 h-2">
          {[0, 1, 2, 3, 4].map((segIndex) => {
            const isFilled = segIndex < completedCount;
            return (
              <div
                key={segIndex}
                className={`h-full rounded-full transition-all duration-500 ${
                  isFilled
                    ? (sprintState === "focus" ? "bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]" : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]")
                    : "bg-white/20"
                }`}
              ></div>
            );
          })}
        </div>
      </footer>

      {/* Modals */}
      <ExitFocusModal
        isOpen={showExitModal}
        onKeepFocusing={() => setShowExitModal(false)}
        onExitSession={() => {
          setShowExitModal(false);
          setPageMode("history");
        }}
      />

      <SprintInterruptedModal
        isOpen={showInterruptedModal}
        onClose={() => setShowInterruptedModal(false)}
        onResume={() => {
          setShowInterruptedModal(false);
          setIsTimerRunning(true);
        }}
        onEndSprint={() => {
          setShowInterruptedModal(false);
          setPageMode("history");
        }}
      />

    </div>
  );
}
