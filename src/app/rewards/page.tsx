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
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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

const LightningIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const CoinOutlineIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
  </svg>
);

const LockIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function RewardsPage() {
  const router = useRouter();
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [xp, setXp] = useState(2480);
  const [coins, setCoins] = useState(240);
  const [streak, setStreak] = useState(5);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [completedSprints, setCompletedSprints] = useState(1);
  const [totalPlannedSprints, setTotalPlannedSprints] = useState(5);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

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
        setXp(data.user.rewards.xp);
        setCoins(data.user.rewards.coins);
        setStreak(data.user.rewards.streak);
        setUnlockedAchievements(data.user.rewards.achievements || []);
        setHistory(data.user.rewards.history || []);
        setCompletedSprints(data.user.planner.completedSprintsCount || 0);
        setTotalPlannedSprints(data.user.settings.dailyGoal || 5);
        setLoading(false);
      } catch (err) {
        console.error("Fetch rewards stats error:", err);
        router.push("/login");
      }
    };
    fetchMe();
  }, []);

  const currentCompletedCount = Math.min(totalPlannedSprints, completedSprints);
  const progressRatio = currentCompletedCount / totalPlannedSprints;

  const ringCircumference = 282.74; // 2 * PI * 45
  const ringOffset = ringCircumference * (1 - progressRatio);

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
        <Link href="/rewards" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
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
        <Link href="/signup" className="block w-full bg-white text-[#7c3aed] hover:bg-slate-50 font-semibold py-2 px-4 rounded-xl text-center text-xs shadow-sm transition-colors">
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
              <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Rewards</h1>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Level up by staying focused — earn XP, coins & badges</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Coins Counter badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-200 bg-orange-50/50 text-orange-600 rounded-xl text-xs md:text-sm font-bold shadow-sm">
              <CoinOutlineIcon />
              <span>{coins} coins</span>
            </div>
          </div>
        </header>

        {/* Rewards grid area */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1400px] w-full mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column widgets */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Level Progress Widget Card */}
              <div className="bg-[#4f46e5] text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-lg relative overflow-hidden border border-indigo-500/10">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-16 h-16 bg-white text-[#4f46e5] font-heading font-extrabold text-2xl rounded-full flex items-center justify-center shadow-md shrink-0 select-none">
                    12
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg md:text-xl leading-tight flex items-center gap-2 flex-wrap">
                      Level 12
                      <span className="bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">👑 Focus Architect</span>
                    </h3>
                    <p className="text-xs text-white/80 mt-1 leading-normal">{3000 - xp} XP until Level 13 — about {Math.ceil((3000 - xp) / 120)} more sprints</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(xp / 3000) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50 pt-1 font-semibold">
                    <span>{xp} XP</span>
                    <span>3,000 XP</span>
                  </div>
                </div>

                {/* Substats block inside Level card */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-white/85 text-xs font-semibold">
                      <LightningIcon />
                      <span>{xp}</span>
                    </div>
                    <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Total XP</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-white/85 text-xs font-semibold">
                      <span>🪙</span>
                      <span>{coins}</span>
                    </div>
                    <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Coins</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-white/85 text-xs font-semibold">
                      <span>🔥</span>
                      <span>{streak}</span>
                    </div>
                    <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Day streak</p>
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Achievements</h3>
                  <a href="#" className="text-xs text-[#7c3aed] font-semibold hover:text-[#6d28d9] transition-colors">8 of 24 unlocked ➔</a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Achievement 1 */}
                  <div 
                    className={`border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                      selectedAchievement === "streak-starter" ? "border-purple-500 bg-purple-50/20" : ""
                    }`}
                    onClick={() => setSelectedAchievement("streak-starter")}
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xl shadow-sm">🔥</div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Streak Starter</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">7-day streak</p>
                    </div>
                  </div>

                  {/* Achievement 2 */}
                  <div 
                    className={`border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                      selectedAchievement === "power-hour" ? "border-purple-500 bg-purple-50/20" : ""
                    }`}
                    onClick={() => setSelectedAchievement("power-hour")}
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xl shadow-sm">⚡</div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Power Hour</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">10 sprints/day</p>
                    </div>
                  </div>

                  {/* Achievement 3 */}
                  <div 
                    className={`border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                      selectedAchievement === "sharp-shooter" ? "border-purple-500 bg-purple-50/20" : ""
                    }`}
                    onClick={() => setSelectedAchievement("sharp-shooter")}
                  >
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-xl shadow-sm">🎯</div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Sharp Shooter</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">90% productivity</p>
                    </div>
                  </div>

                  {/* Achievement 4 */}
                  <div 
                    className={`border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                      selectedAchievement === "early-bird" ? "border-purple-500 bg-purple-50/20" : ""
                    }`}
                    onClick={() => setSelectedAchievement("early-bird")}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl shadow-sm">🌅</div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Early Bird</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Focus before 8am</p>
                    </div>
                  </div>

                  {/* Achievement 5 */}
                  <div 
                    className={`border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                      selectedAchievement === "centurion" ? "border-purple-500 bg-purple-50/20" : ""
                    }`}
                    onClick={() => setSelectedAchievement("centurion")}
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl shadow-sm">🏆</div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Centurion</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">100 sprints done</p>
                    </div>
                  </div>

                  {/* Locked Achievement 6 */}
                  <div className="border border-slate-100 bg-slate-50/50 opacity-60 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 relative select-none">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm shadow-sm">
                      <LockIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-400 leading-tight">Perfect Week</h4>
                      <p className="text-[10px] text-slate-300 mt-1 font-medium">7 days, all goals</p>
                    </div>
                  </div>

                  {/* Locked Achievement 7 */}
                  <div className="border border-slate-100 bg-slate-50/50 opacity-60 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 relative select-none">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm shadow-sm">
                      <LockIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-400 leading-tight">Grandmaster</h4>
                      <p className="text-[10px] text-slate-300 mt-1 font-medium">Reach Level 20</p>
                    </div>
                  </div>

                  {/* Locked Achievement 8 */}
                  <div className="border border-slate-100 bg-slate-50/50 opacity-60 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 relative select-none">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm shadow-sm">
                      <LockIcon />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-400 leading-tight">Night Owl</h4>
                      <p className="text-[10px] text-slate-300 mt-1 font-medium">Focus after 10pm</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column widgets */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Daily Goal Progress Card */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-5">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Daily Goal</h3>
                
                <div className="flex items-center justify-center py-2">
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
                      <div className="font-heading font-extrabold text-2xl text-slate-900">{Math.round(progressRatio * 100)}%</div>
                      <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">{currentCompletedCount} / {totalPlannedSprints} sprints</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100/50 rounded-xl p-3 flex items-center gap-2.5 text-[11px] font-bold text-green-600">
                  <span>⚡</span>
                  <span>+50 coins when you hit 100%</span>
                </div>
              </div>

              {/* Streak info */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">7-day streak 🔥</h3>
                
                <p className="text-[11px] text-slate-400 font-semibold mb-4 leading-none">Best: 14 days</p>

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

              {/* Recent Rewards Feed */}
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Recent Rewards</h3>
                
                <div className="space-y-4 animate-fade-in">
                  {history.length > 0 ? (
                    history.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs md:text-sm font-semibold">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs">
                            {item.text.toLowerCase().includes("badge") ? "👑" : item.text.toLowerCase().includes("sprint") ? "⚡" : "🪙"}
                          </div>
                          <span className="text-slate-600 line-clamp-1">{item.text}</span>
                        </div>
                        <span className="text-[#7c3aed] font-bold">+{item.xp} XP</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[10px] text-slate-400 py-4 font-bold uppercase tracking-wider">No reward history logged.</div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
