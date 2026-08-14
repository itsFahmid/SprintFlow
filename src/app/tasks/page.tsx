"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG NAVIGATION & ACTION ICONS ---
const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const TasksIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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

const RefreshIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

interface BreakdownSprint {
  id: string;
  title: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  approved: boolean;
  subtasks: string[];
}

export default function TasksPage() {
  const router = useRouter();

  // --- STATE ---
  const [viewState, setViewState] = useState<"input" | "loading" | "breakdown">("input");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [taskText, setTaskText] = useState(
    `- Implement OAuth login flow with Google + email\n- Fix dashboard loading bug on slow connections\n- Write Q3 product update email to customers\n- Review Sara's PR #218 and leave comments\n- Design onboarding empty states + illustrations\n- Plan next sprint and groom the backlog`
  );

  // Sprints state for AI Breakdown
  const [sprints, setSprints] = useState<BreakdownSprint[]>([
    {
      id: "01",
      title: "Set up OAuth providers & routes",
      duration: 25,
      priority: "High",
      approved: true,
      subtasks: ["Configure Google OAuth client", "Add email/password fallback", "Wire up redirect routes"]
    },
    {
      id: "02",
      title: "Debug dashboard slow-load",
      duration: 30,
      priority: "High",
      approved: false,
      subtasks: ["Profile network waterfall", "Add skeleton loaders", "Cache initial query"]
    },
    {
      id: "03",
      title: "Draft Q3 product update email",
      duration: 20,
      priority: "Medium",
      approved: false,
      subtasks: ["Outline 3 key updates", "Write first draft", "Add CTA + screenshots"]
    }
  ]);

  // Derived tasks count
  const detectedTasksCount = taskText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0).length;

  const handleAnalyze = () => {
    if (detectedTasksCount === 0) return;
    setViewState("loading");
    setTimeout(() => {
      setViewState("breakdown");
    }, 1400);
  };

  const handleToggleApprove = (id: string) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, approved: !s.approved } : s));
  };

  const handleGeneratePlan = () => {
    // Navigate back to dashboard on daily plan creation success
    router.push("/dashboard");
  };

  // Sidebar Layout parts (shared)
  const navigationLinks = (
    <ul className="space-y-1.5 list-none p-0">
      <li>
        <Link href="/dashboard" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <DashboardIcon />
          Dashboard
        </Link>
      </li>
      <li>
        <Link href="/tasks" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
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

      {/* Profile Footer */}
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
            
            {/* Dynamic Header Titles based on States */}
            {viewState === "input" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">New Tasks</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Paste your to-do list — AI turns it into focused sprints</p>
              </div>
            )}
            {viewState === "loading" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">AI Planning Underway</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Analyzing efforts, priorities, and Pomodoro structures...</p>
              </div>
            )}
            {viewState === "breakdown" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">AI Sprint Breakdown</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">6 tasks • 8 sprints • ~3h 20m total focus</p>
              </div>
            )}
          </div>

          {/* Action buttons on Header (only for Breakdown view) */}
          {viewState === "breakdown" && (
            <div className="flex items-center gap-3">
              <button 
                className="h-10 px-4 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => { setViewState("input"); }}
              >
                Regenerate all
              </button>
              <button 
                className="btn btn-primary h-10 px-4 md:px-5 text-xs md:text-sm font-bold gap-2"
                onClick={handleGeneratePlan}
              >
                Generate Daily Plan
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-start">
          
          {/* --- STATE 1: TASK INPUT VIEW --- */}
          {viewState === "input" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              
              {/* Left Column: Input text area */}
              <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">Paste your tasks</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">One task per line. Be as messy as you like.</p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    className="w-full h-72 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-mono leading-relaxed resize-none"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="- Task 1&#10;- Task 2"
                  ></textarea>
                </div>

                {/* Status pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-green-50 border border-green-200/30 text-green-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {detectedTasksCount} tasks detected
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/20 text-slate-500 font-semibold">
                    ⏱ Sprint length: 25 min
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/20 text-slate-500 font-semibold">
                    ⚡ Priority: Auto
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button 
                    className="btn btn-primary h-12 px-8 text-sm font-bold gap-2"
                    onClick={handleAnalyze}
                    disabled={detectedTasksCount === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
                    Analyze Tasks
                  </button>
                  <button 
                    className="h-12 px-6 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setTaskText("")}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Right Column: How it works info */}
              <div className="lg:col-span-4 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">How it works</h3>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">AI reads your list</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Understands context, effort & priority.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">Splits into sprints</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Each sprint is a 15–30 min focus block.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">You stay in control</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Edit, approve, or regenerate any sprint.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-3 text-purple-600 text-xs font-semibold">
                  <span>⚡</span>
                  Avg. plan ready in ~3 seconds
                </div>
              </div>

            </div>
          )}

          {/* --- STATE 2: LOADING ANALYZER STATE --- */}
          {viewState === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 w-full">
              <div className="w-16 h-16 border-4 border-purple-100 border-t-[#7c3aed] rounded-full animate-spin mb-6"></div>
              <h2 className="font-heading font-extrabold text-lg text-slate-900 mb-2">Analyzing your tasks...</h2>
              <p className="text-sm text-slate-400 font-medium max-w-sm text-center leading-relaxed">
                Our model is categorizing complexity, calculating energy curves, and mapping your list into optimized focus sprints.
              </p>
            </div>
          )}

          {/* --- STATE 3: SPRINT BREAKDOWN VIEW --- */}
          {viewState === "breakdown" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              
              {/* Left Column: Parsed tasks with priority bullets */}
              <div className="lg:col-span-5 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Your tasks</h3>
                
                <ul className="space-y-4 list-none p-0 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Implement OAuth login flow</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Fix dashboard loading bug</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Write Q3 product update email</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Review Sara's PR #218</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Design onboarding empty states</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span>
                    <span className="font-semibold text-slate-700">Plan next sprint & groom backlog</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: AI Grouped Sprints */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Purple header alert banner */}
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
                  <div className="text-xl leading-none pt-0.5">✦</div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#7c3aed] mb-1">AI grouped your tasks into 8 focused sprints</h4>
                    <p className="text-xs text-[#7c3aed]/80 leading-relaxed font-medium">
                      Ordered by priority and energy. Tweak anything before generating your day.
                    </p>
                  </div>
                </div>

                {/* Sprints List Container */}
                <div className="space-y-4">
                  {sprints.map((sprint) => (
                    <div 
                      key={sprint.id} 
                      className={`bg-white border rounded-2xl p-6 transition-all duration-200 ${
                        sprint.approved ? "border-purple-200 shadow-sm" : "border-slate-200/50"
                      }`}
                    >
                      
                      {/* Sprint Card Header */}
                      <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-4">
                          {/* Circle badge identifier */}
                          <div className="w-10 h-10 bg-purple-50 text-[#7c3aed] font-heading font-extrabold rounded-xl flex items-center justify-center shrink-0">
                            {sprint.id}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-900 leading-tight">{sprint.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                              <span>⏱ {sprint.duration} min</span>
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                              <span className={`font-semibold uppercase tracking-wider text-[10px] ${
                                sprint.priority === "High" ? "text-red-500" :
                                sprint.priority === "Medium" ? "text-orange-500" : "text-green-500"
                              }`}>{sprint.priority} priority</span>
                            </p>
                          </div>
                        </div>

                        {/* Inline Actions */}
                        <div className="flex items-center gap-3.5">
                          <button aria-label="Refresh sprint"><RefreshIcon /></button>
                          <button aria-label="Edit sprint"><EditIcon /></button>
                          
                          <button 
                            className={`btn h-9 px-4 text-xs font-bold transition-all border ${
                              sprint.approved 
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-sm" 
                                : "bg-transparent border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                            onClick={() => handleToggleApprove(sprint.id)}
                          >
                            ✓ {sprint.approved ? "Approved" : "Approve"}
                          </button>
                        </div>
                      </div>

                      {/* Sprint Card Checklists */}
                      <div className="space-y-3">
                        {sprint.subtasks.map((taskName, subidx) => (
                          <label key={subidx} className="flex items-center gap-3 cursor-pointer text-xs md:text-sm">
                            <input 
                              type="checkbox"
                              className="w-4 h-4 rounded text-[#7c3aed] border-slate-300 focus:ring-[#7c3aed]"
                              defaultChecked={sprint.approved && subidx === 0} // For visual variation
                            />
                            <span className="text-slate-600 font-medium">{taskName}</span>
                          </label>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
