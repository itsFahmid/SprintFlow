"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// --- SVG ICONS ---
const SkipArrowIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-white">
    <polygon points="5 4 15 12 5 20"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

const PauseLinesIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-[#1e1b4b]">
    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
  </svg>
);

const PlayArrowIcon = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-[#1e1b4b]">
    <polygon points="5,3 19,12 5,21"></polygon>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-white">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const LogoSVG = () => (
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

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(1);
  const [sprintState, setSprintState] = useState<"focus" | "break">("focus");
  
  // Timer countdowns
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [focusMaxSecs, setFocusMaxSecs] = useState(25 * 60);
  const [breakMaxSecs, setBreakMaxSecs] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Score states
  const [xp, setXp] = useState(2480);
  const [coins, setCoins] = useState(240);
  const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
  const [sprintTitles, setSprintTitles] = useState<string[]>([]);

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
        
        const sprintCount = data.user.planner.completedSprintsCount || 0;
        setCompletedCount(sprintCount);
        localStorage.setItem("sprintflow_completed_sprints", sprintCount.toString());

        const fLength = (data.user.settings.sprintLength || 25) * 60;
        const bLength = (data.user.settings.breakLength || 5) * 60;
        setFocusTime(fLength);
        setFocusMaxSecs(fLength);
        setBreakTime(bLength);
        setBreakMaxSecs(bLength);

        setXp(data.user.rewards.xp);
        setCoins(data.user.rewards.coins);
        setRewardsHistory(data.user.rewards.history || []);

        // Fetch sprint titles
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
  }, []);

  // Timer Tick Side Effects
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && !loading) {
      timerInterval = setInterval(() => {
        if (sprintState === "focus") {
          setFocusTime(prev => {
            if (prev <= 1) {
              handleFocusComplete();
              return 25 * 60;
            }
            return prev - 1;
          });
        } else {
          setBreakTime(prev => {
            if (prev <= 1) {
              handleResumeFocus();
              return 5 * 60;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, sprintState, loading]);

  // Actions
  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSkipSprint = () => {
    setSprintState("break");
    setIsTimerRunning(true);
  };

  const reportSprintCompletion = async (nextCompleted: number) => {
    try {
      await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planner: { completedSprintsCount: nextCompleted } })
      });

      const updatedXp = xp + 40;
      const updatedCoins = coins + 10;
      const newHistoryLog = {
        id: "h-" + Math.random().toString(36).substring(2, 9),
        text: `Sprint ${nextCompleted} completed focus block`,
        xp: 40,
        coins: 10,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newHistoryLog, ...rewardsHistory];

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
    router.push("/planner");
  };

  // Helper formatting min:sec
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Circumferences
  const focusCircumference = 565.48; // 2 * PI * 90 (Radius 90)
  const focusOffset = focusCircumference * (1 - (focusTime / (focusMaxSecs || 1)));

  const breakCircumference = 565.48;
  const breakOffset = breakCircumference * (1 - (breakTime / (breakMaxSecs || 1)));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120024] flex flex-col items-center justify-center font-sans text-white">
        <div className="relative w-16 h-16 flex items-center justify-center select-none">
          <div className="absolute inset-0 bg-[#7c3aed]/5 backdrop-blur-md rounded-full border border-[#7c3aed]/10 animate-pulse"></div>
          <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        </div>
        <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Entering focus zone...</p>
      </div>
    );
  }

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
            <>
              <LogoSVG />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wide">
                ⚡ Sprint {completedCount + 1} of 5
              </span>
            </>
          ) : (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-semibold"
              onClick={handleExitFocus}
            >
              ✕ Exit focus
            </button>
          )}
        </div>

        {/* Right Side Skip/Exit */}
        <div>
          {sprintState === "focus" ? (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-semibold"
              onClick={handleExitFocus}
            >
              ✕ Exit focus
            </button>
          ) : (
            <button 
              className="flex items-center gap-1.5 hover:translate-x-1.5 transition-all text-xs font-bold uppercase tracking-widest text-emerald-400"
              onClick={handleResumeFocus}
            >
              Skip break ➔
            </button>
          )}
        </div>

      </header>

      {/* --- CENTER SECTION (TIMER) --- */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-center max-w-2xl mx-auto w-full select-none">
        
        {/* Pill status */}
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border ${
          sprintState === "focus" 
            ? "bg-purple-950/40 border-purple-500/20 text-[#a78bfa]" 
            : "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            sprintState === "focus" ? "bg-purple-400 animate-pulse" : "bg-emerald-400"
          }`}></span>
          {sprintState === "focus" ? "Focus in Progress" : "Rest and Recharge"}
        </span>

        {/* Big Countdown Progress Ring */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-8">
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle 
              className={sprintState === "focus" ? "text-purple-950/20" : "text-emerald-950/20"} 
              cx="100" 
              cy="100" 
              r="90" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="6"
            ></circle>
            <circle 
              className={`transition-all duration-300 ${
                sprintState === "focus" ? "text-[#7c3aed]" : "text-[#10b981]"
              }`} 
              cx="100" 
              cy="100" 
              r="90" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="6"
              strokeDasharray={focusCircumference}
              strokeDashoffset={sprintState === "focus" ? focusOffset : breakOffset}
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute text-center space-y-1">
            <div className="font-heading font-extrabold text-5xl md:text-6xl tracking-tight leading-none">
              {formatTimer(sprintState === "focus" ? focusTime : breakTime)}
            </div>
            <div className={`text-[10px] uppercase font-bold tracking-widest ${
              sprintState === "focus" ? "text-purple-400" : "text-emerald-400"
            }`}>remaining</div>
          </div>
        </div>

        {/* --- FOCUS MODE SUBWIDGETS --- */}
        {sprintState === "focus" && (
          <div className="space-y-8 w-full">
            <div>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-2">{sprintTitles[completedCount] || sprintTitles[0] || "Focus sprint"}</h2>
              <p className="text-xs md:text-sm text-slate-400 italic">"Deep work compounds. Stay with this one thing."</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-10">
              {/* Skip Button */}
              <div className="flex flex-col items-center gap-2">
                <button 
                  className="w-12 h-12 rounded-full border-2 border-white/20 hover:border-white/50 bg-transparent flex items-center justify-center transition-colors cursor-pointer"
                  onClick={handleSkipSprint}
                  aria-label="Skip sprint"
                >
                  <SkipArrowIcon />
                </button>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skip</span>
              </div>

              {/* Play/Pause Button */}
              <div className="flex flex-col items-center gap-2">
                <button 
                  className="w-16 h-16 rounded-full bg-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-black/10"
                  onClick={handleToggleTimer}
                  aria-label={isTimerRunning ? "Pause" : "Resume"}
                >
                  {isTimerRunning ? <PauseLinesIcon /> : <PlayArrowIcon />}
                </button>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{isTimerRunning ? "Pause" : "Resume"}</span>
              </div>

              {/* Complete Button */}
              <div className="flex flex-col items-center gap-2">
                <button 
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-md shadow-green-500/10"
                  onClick={handleFocusComplete}
                  aria-label="Complete sprint"
                >
                  <CheckIcon />
                </button>
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Complete</span>
              </div>
            </div>
          </div>
        )}

        {/* --- BREAK MODE SUBWIDGETS --- */}
        {sprintState === "break" && (
          <div className="space-y-8 w-full max-w-lg">
            {/* Break activities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Activity 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <StretchIcon />
                </div>
                <div>
                  <h4 className="font-semibold text-xs md:text-sm text-white">Stand & stretch</h4>
                  <p className="text-[10px] text-slate-300/80 mt-0.5">5 min • Get some blood flowing</p>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <HydrateIcon />
                </div>
                <div>
                  <h4 className="font-semibold text-xs md:text-sm text-white">Hydrate</h4>
                  <p className="text-[10px] text-slate-300/80 mt-0.5">5 min • Drink a glass of water</p>
                </div>
              </div>

            </div>

            {/* Resume button */}
            <div className="pt-2">
              <button 
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0f2c26] font-bold text-sm py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleResumeFocus}
              >
                ▶ Resume focus
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- BOTTOM PROGRESS BAR --- */}
      <footer className="w-full p-6 max-w-6xl mx-auto space-y-3 shrink-0 select-none">
        
        {/* Footnote banner */}
        {sprintState === "break" && (
          <p className="text-center text-[11px] font-medium text-emerald-300/80 pb-2">
            ✦ Your next sprint starts automatically when the timer ends
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-widest pb-1.5">
          <span>Daily progress</span>
          <span>{completedCount} of 5 sprints · {Math.max(0, 5 - completedCount)} to go</span>
        </div>

        {/* 5-Segment Horizontal Progress bar */}
        <div className="grid grid-cols-5 gap-2 h-1.5">
          {[1, 2, 3, 4, 5].map((segIndex) => {
            const isFilled = segIndex <= completedCount;
            return (
              <div 
                key={segIndex} 
                className={`h-full rounded-full transition-all duration-500 ${
                  isFilled 
                    ? (sprintState === "focus" ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]" : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]")
                    : "bg-white/25"
                }`}
              ></div>
            );
          })}
        </div>

      </footer>

    </div>
  );
}
