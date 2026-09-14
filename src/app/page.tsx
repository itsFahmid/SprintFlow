"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { TextRoll } from "@/components/motion/TextRoll";
import { InViewReveal, InViewStagger } from "@/components/motion/InViewReveal";
import {
  SPRING_TRANSITIONS,
  FADE_UP_VARIANT,
  SCALE_IN_VARIANT,
  MODAL_BACKDROP_VARIANT,
} from "@/lib/motion";

// --- CUSTOM INLINE SVG ICON COMPONENTS ---
const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M5 3L6 4M19 19L20 20M19 3L18 4M5 19L4 20" strokeWidth="1.5" />
  </svg>
);

const FlameIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CoinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9h-3.5a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3H9.5m2.5-7.5v1.5m0 6V18" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CrownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface Sprint {
  name: string;
  duration: number;
  active?: boolean;
}

const WORKFLOW_PRESETS = [
  {
    id: "dev",
    label: "💻 Software Sprint",
    taskName: "Implement OAuth & JWT Session Handler",
    duration: 25,
    remaining: 18 * 60 + 24,
    sprints: [
      { name: "Implement OAuth & JWT Session Handler", duration: 25, active: true },
      { name: "PostgreSQL Migration & Schema Indexing", duration: 25, active: false },
      { name: "Unit Test & Edge Case Coverage", duration: 15, active: false },
    ],
    xp: 40,
    streak: "7-day streak",
  },
  {
    id: "study",
    label: "📖 Deep Study Session",
    taskName: "Cardiovascular Pharmacology Review",
    duration: 25,
    remaining: 22 * 60 + 10,
    sprints: [
      { name: "Cardiovascular Pharmacology Review", duration: 25, active: true },
      { name: "ECG Pattern Recognition & Past MCQs", duration: 25, active: false },
      { name: "Flashcard Spaced Repetition Drill", duration: 20, active: false },
    ],
    xp: 45,
    streak: "14-day streak",
  },
  {
    id: "launch",
    label: "🚀 Product Launch Sprint",
    taskName: "Draft & Sequence Release Notes",
    duration: 25,
    remaining: 15 * 60 + 0,
    sprints: [
      { name: "Draft & Sequence Release Notes", duration: 25, active: true },
      { name: "PR #412 Code Review & Staging Smoke Test", duration: 25, active: false },
      { name: "Customer Outreach & Live Announcement", duration: 20, active: false },
    ],
    xp: 50,
    streak: "21-day streak",
  },
];

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(1);
  const [activePreset, setActivePreset] = useState("dev");
  const [calculatorHours, setCalculatorHours] = useState(4);

  // Timer States
  const [taskName, setTaskName] = useState(WORKFLOW_PRESETS[0].taskName);
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [remainingTime, setRemainingTime] = useState(WORKFLOW_PRESETS[0].remaining);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerLabel, setTimerLabel] = useState("remaining");

  // Modal States
  const [modalState, setModalState] = useState<"input" | "loading" | "results">("input");
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "refund" | null>(null);
  const [taskInput, setTaskInput] = useState(
    `- Fix responsive styling bugs in the header\n- Add inline SVGs to optimize page loading speed\n- Implement the interactive timer in JS\n- Push changes to staging server for QA testing`
  );
  const [generatedSprints, setGeneratedSprints] = useState<Sprint[]>([]);

  // Workflow Preset Switcher
  const handleSelectPreset = (presetId: string) => {
    const preset = WORKFLOW_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setTaskName(preset.taskName);
    setTotalDuration(preset.duration * 60);
    setRemainingTime(preset.remaining);
    setIsPlaying(false);
    setTimerLabel("remaining");
  };

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && isPlaying) {
      setIsPlaying(false);
      setRemainingTime(totalDuration);
      setTimerLabel("completed!");
      triggerChime();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, remainingTime, totalDuration]);

  // Audio Context Chime Generator
  const triggerChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.start(time);
        osc.stop(time + duration);
      };
      playTone(audioCtx.currentTime, 523.25, 0.4); // C5
      playTone(audioCtx.currentTime + 0.15, 659.25, 0.6); // E5
    } catch (e) {
      console.log("Audio API not supported or user interaction required first.");
    }
  };

  // Timer circle settings
  const circumference = 628.3; // 2 * PI * 100
  const strokeOffset = circumference * (1 - remainingTime / totalDuration);

  // FAQ Accordion Handler
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // AI Planner handler
  const handleGenerateSprints = () => {
    if (!taskInput.trim()) return;
    setModalState("loading");

    const parsedTasks = taskInput
      .split("\n")
      .map((line) => line.replace(/^[-*•\d\.\s]+/, "").trim())
      .filter((t) => t.length > 0);

    if (parsedTasks.length === 0) {
      parsedTasks.push("Focus sprint session");
    }

    setTimeout(() => {
      const sprints = parsedTasks.map((task, idx) => ({
        name: task,
        duration: idx === parsedTasks.length - 1 ? 15 : 25,
      }));
      setGeneratedSprints(sprints);
      setModalState("results");
    }, 1200);
  };

  const handleStartFocus = () => {
    if (generatedSprints.length > 0) {
      const firstSprint = generatedSprints[0];
      setTaskName(firstSprint.name);
      setTotalDuration(firstSprint.duration * 60);
      setRemainingTime(firstSprint.duration * 60);
      setTimerLabel("remaining");
      setIsModalOpen(false);
      setIsPlaying(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const presetTabs = WORKFLOW_PRESETS.map((p) => ({
    id: p.id,
    label: p.label,
  }));

  const calculatorTabs = [1, 2, 4, 6].map((hrs) => ({
    id: String(hrs),
    label: `${hrs} ${hrs === 1 ? "Hour" : "Hours"}`,
  }));

  return (
    <>
      {/* --- HEADER / NAVIGATION --- */}
      <header className="header backdrop-blur-md bg-white/80 dark:bg-[#0b0f19]/80 sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="container">
          <Link href="/" className="logo">
            <svg className="logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span>sprintflow</span>
          </Link>

          <nav className="hidden md:block">
            <ul className="nav-menu">
              <li><a href="#how-it-works" className="nav-link">How it works</a></li>
              <li><a href="#features" className="nav-link">Features</a></li>
              <li><a href="#pricing" className="nav-link">Pricing</a></li>
              <li><a href="#faq" className="nav-link">FAQ</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <ThemeToggle className="mr-1" />
            <Link href="/login" className="login-link">Log in</Link>
            <MagneticButton
              className="btn btn-primary header-btn"
              onClick={() => { setModalState("input"); setIsModalOpen(true); }}
            >
              Start Focusing
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="hero relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_TRANSITIONS.smooth}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/80 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-6 shadow-sm">
              <SparklesIcon />
              <span>AI-Powered Pomodoro Workflows</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Turn your task list into{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                focused sprints
              </span>
            </h1>

            <p className="hero-subtitle mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Paste your to-dos and SprintFlow's AI builds a Pomodoro plan, guides every focus session, and rewards the work you get done.
            </p>

            <div className="hero-ctas flex flex-wrap items-center justify-center gap-4 mt-8">
              <MagneticButton
                className="btn btn-primary h-12 px-7 text-sm font-bold shadow-lg shadow-violet-500/20"
                onClick={() => { setModalState("input"); setIsModalOpen(true); }}
              >
                Start Focusing
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </MagneticButton>

              <a href="#how-it-works" className="btn btn-secondary h-12 px-6 text-sm font-semibold flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20"></polygon>
                </svg>
                See how it works
              </a>
            </div>

            <div className="hero-rating flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <div className="avatar-group flex items-center">
                <div className="avatar w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundColor: "#818cf8" }}>A</div>
                <div className="avatar w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm -ml-2.5" style={{ backgroundColor: "#60a5fa" }}>S</div>
                <div className="avatar w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm -ml-2.5" style={{ backgroundColor: "#34d399" }}>T</div>
                <div className="avatar w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm -ml-2.5" style={{ backgroundColor: "#fb7185" }}>M</div>
                <div className="avatar w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm -ml-2.5" style={{ backgroundColor: "#fbbf24" }}>K</div>
              </div>
              <div className="rating-details flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                </div>
                <span className="rating-score font-bold text-slate-900 dark:text-white">4.9</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">Loved by 12,000+ focused minds</span>
              </div>
            </div>
          </motion.div>

          {/* Workflow Preset Switcher with AnimatedTabs */}
          <div className="flex flex-col items-center justify-center gap-3 my-8">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Interactive workflow demo:
            </span>
            <AnimatedTabs
              tabs={presetTabs}
              activeId={activePreset}
              onChange={handleSelectPreset}
              layoutId="hero-preset-tab-pill"
            />
          </div>

          {/* App Mockup with Spring Interactions */}
          <motion.div
            layout
            transition={SPRING_TRANSITIONS.smooth}
            className="hero-mockup-wrapper max-w-4xl mx-auto"
          >
            <SpotlightCard
              className="app-mockup bg-slate-950 border-slate-800 text-slate-100 shadow-2xl rounded-3xl"
              spotlightColor="rgba(124, 58, 237, 0.2)"
            >
              <div className="app-header-bar flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/40">
                <div className="app-hud-status flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                  <span className="text-[11px] font-mono tracking-wider text-slate-300">SESSION HUD</span>
                </div>
                <div className="app-address-bar font-mono text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  {activePreset.toUpperCase()} • 25M FOCUS
                </div>
                <div className="app-xp-badge-container">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="app-xp-badge flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
                  >
                    <ZapIcon />
                    <div>
                      <strong>+{WORKFLOW_PRESETS.find((p) => p.id === activePreset)?.xp || 40} XP</strong>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="app-content grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 md:p-8">
                {/* Left Timer Column */}
                <div className="md:col-span-6 flex flex-col items-center justify-center relative">
                  <div className="app-focus-status mb-4 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800/60 px-3 py-1 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-violet-400"}`}></span>
                    {isPlaying ? "FOCUS IN PROGRESS" : "FOCUS PAUSED (CLICK TIMER TO START)"}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="app-timer-container cursor-pointer relative"
                    onClick={() => setIsPlaying(!isPlaying)}
                    title="Click to play/pause focus session"
                  >
                    <svg className="timer-svg" viewBox="0 0 220 220" width="220" height="220">
                      <circle className="timer-track stroke-slate-800" cx="110" cy="110" r="100" strokeWidth="10" fill="none"></circle>
                      <motion.circle
                        className="timer-progress stroke-violet-500"
                        cx="110"
                        cy="110"
                        r="100"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: circumference,
                          strokeDashoffset: strokeOffset,
                          transform: "rotate(-90deg)",
                          transformOrigin: "50% 50%",
                        }}
                        transition={{ duration: 0.5, ease: "linear" }}
                      />
                    </svg>
                    <div className="timer-text-wrapper absolute inset-0 flex flex-col items-center justify-center">
                      <div className="timer-time text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                        {formatTime(remainingTime)}
                      </div>
                      <div className="timer-label text-xs uppercase tracking-wider font-semibold mt-1" style={{ color: isPlaying ? "#a78bfa" : "#94a3b8" }}>
                        {timerLabel}
                      </div>
                    </div>
                  </motion.div>

                  <div className="app-task-name text-center max-w-sm my-4 text-sm font-medium text-slate-200 line-clamp-1">
                    {taskName}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`btn h-9 px-5 text-xs font-bold gap-2 ${
                        isPlaying ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "btn-primary"
                      }`}
                    >
                      {isPlaying ? "Pause Focus" : "▶ Start Sprint"}
                    </button>
                    <button
                      onClick={triggerChime}
                      className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1.5 border border-slate-700"
                      title="Test Audio Chime"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                      <span>Chime</span>
                    </button>
                  </div>
                </div>

                {/* Right Sprint Sequence Column */}
                <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Sprint Breakdown</span>
                    <span className="text-[11px] font-mono text-emerald-400">3 Sprints • 65m Total</span>
                  </div>

                  <div className="space-y-2.5">
                    <AnimatePresence mode="wait">
                      {WORKFLOW_PRESETS.find((p) => p.id === activePreset)?.sprints.map((sprint, idx) => (
                        <motion.div
                          key={`${activePreset}-${idx}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-3 rounded-xl border transition-all ${
                            idx === 0
                              ? "bg-violet-950/40 border-violet-700/60 text-white shadow-sm"
                              : "bg-slate-900/40 border-slate-800 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                                  idx === 0 ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-xs font-semibold">{sprint.name}</span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-300 tabular-nums">
                              {sprint.duration}m
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <FlameIcon />
                      <span>{WORKFLOW_PRESETS.find((p) => p.id === activePreset)?.streak}</span>
                    </span>
                    <span>5m rest scheduled between sprints</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* --- CHAOS VS FLOW TRANSFORMATION SECTION --- */}
      <section className="transformation section-padding bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80" id="how-it-works">
        <div className="container">
          <InViewReveal className="section-header text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">The focus transformation</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">See why unstructured to-do lists fail, and how SprintFlow turns overwhelm into deep execution.</p>
          </InViewReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* The Old Way */}
            <InViewReveal delay={0.1}>
              <SpotlightCard
                className="bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-950/60 rounded-2xl p-7 space-y-5 shadow-sm h-full"
                spotlightColor="rgba(244, 63, 94, 0.08)"
              >
                <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md">
                    Without SprintFlow
                  </span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Overwhelm & Friction</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>14 unstructured tasks dumped into notes with no clear start point</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Constant task-switching and cognitive fatigue trying to self-plan</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Zero time-boxing leads to 4-hour tasks that drag across the entire day</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>No feedback, no streaks, and zero sense of tangible accomplishment</span>
                  </li>
                </ul>
              </SpotlightCard>
            </InViewReveal>

            {/* The SprintFlow Way */}
            <InViewReveal delay={0.2}>
              <SpotlightCard
                className="bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-950/60 rounded-2xl p-7 space-y-5 shadow-sm h-full"
                spotlightColor="rgba(16, 185, 129, 0.08)"
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-950/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
                    With SprintFlow
                  </span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Immediate Flow State</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>AI immediately sequences tasks into 25-minute Pomodoro sprints</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Single-task focus HUD keeps your attention locked on one objective</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Automatic rest intervals protect cognitive stamina and prevent burnout</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>Gamified XP, streaks, and milestone badges make progress visible</span>
                  </li>
                </ul>
              </SpotlightCard>
            </InViewReveal>
          </div>
        </div>
      </section>

      {/* --- DAILY OUTPUT CALCULATOR SECTION --- */}
      <section className="calculator section-padding">
        <div className="container">
          <InViewReveal className="section-header text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Calculate your focus output</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">Select your available focus time and see how SprintFlow structures your day.</p>
          </InViewReveal>

          <InViewReveal delay={0.15}>
            <SpotlightCard
              className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-8"
              spotlightColor="rgba(124, 58, 237, 0.1)"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Available focus time:
                </span>
                <AnimatedTabs
                  tabs={calculatorTabs}
                  activeId={String(calculatorHours)}
                  onChange={(id) => setCalculatorHours(Number(id))}
                  layoutId="calc-hours-tab-pill"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <motion.div
                  key={`sprints-${calculatorHours}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_TRANSITIONS.snappy}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-3xl font-bold font-heading text-slate-900 dark:text-white tabular-nums">
                    {Math.floor((calculatorHours * 60) / 30)}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">25m Sprints</p>
                </motion.div>

                <motion.div
                  key={`breathers-${calculatorHours}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_TRANSITIONS.snappy}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-3xl font-bold font-heading text-slate-900 dark:text-white tabular-nums">
                    {Math.max(1, Math.floor((calculatorHours * 60) / 30) - 1)}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">5m Breathers</p>
                </motion.div>

                <motion.div
                  key={`xp-${calculatorHours}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_TRANSITIONS.snappy}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-3xl font-bold font-heading text-slate-900 dark:text-white tabular-nums">
                    +{Math.floor((calculatorHours * 60) / 30) * 40}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">XP Earned</p>
                </motion.div>

                <motion.div
                  key={`streak-${calculatorHours}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_TRANSITIONS.snappy}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-3xl font-bold font-heading text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +1
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Streak Multiplier</p>
                </motion.div>
              </div>

              <div className="pt-2 text-center">
                <MagneticButton
                  onClick={() => { setModalState("input"); setIsModalOpen(true); }}
                  className="btn btn-primary"
                >
                  Plan My {calculatorHours}-Hour Sprints Now
                </MagneticButton>
              </div>
            </SpotlightCard>
          </InViewReveal>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="features section-padding" id="features">
        <div className="container">
          <InViewReveal className="section-header text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Everything you need to focus</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">One calm, AI-native workspace that plans your day and keeps you in flow.</p>
          </InViewReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
                title: "AI sprint breakdown",
                desc: "Turns any messy task list into a clear, prioritized Pomodoro plan.",
                color: "text-violet-500 bg-violet-50 dark:bg-violet-950/50",
              },
              {
                icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>,
                title: "Distraction-free timer",
                desc: "A focus mode with countdown, progress ring and gentle guidance.",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
              },
              {
                icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></>,
                title: "Daily planner",
                desc: "See your sprints and breaks laid out on a clean visual timeline.",
                color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
              },
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
                title: "Gamified progress",
                desc: "Earn XP, level up, keep streaks and unlock badges as you work.",
                color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
              },
              {
                icon: <><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></>,
                title: "Insightful analytics",
                desc: "Track focus time, completed sprints and productivity trends.",
                color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50",
              },
              {
                icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></>,
                title: "Desktop & mobile",
                desc: "Your plan and timer stay in sync everywhere you focus.",
                color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
              },
            ].map((feat, idx) => (
              <InViewReveal key={idx} delay={idx * 0.06}>
                <SpotlightCard
                  className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full hover:border-slate-300 dark:hover:border-slate-700"
                  spotlightColor="rgba(124, 58, 237, 0.12)"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {feat.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feat.desc}</p>
                </SpotlightCard>
              </InViewReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="pricing section-padding" id="pricing">
        <div className="container">
          <InViewReveal className="section-header text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Simple pricing, serious focus</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">Start free forever. Go Pro for unlimited focus — with a 3-day trial, no card needed.</p>
          </InViewReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <InViewReveal delay={0.1}>
              <SpotlightCard
                className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-full"
                spotlightColor="rgba(124, 58, 237, 0.08)"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free</h3>
                  <div className="price-container my-4">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">0</span>
                    <span className="text-sm font-medium text-slate-500 ml-1.5">BDT / forever</span>
                  </div>

                  <ul className="space-y-3.5 my-6 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span>3 focus sprints per day</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span>Basic AI task breakdown</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span>This-week analytics</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span>Streaks & daily goal</span>
                    </li>
                  </ul>
                </div>

                <Link href="/signup" className="btn btn-secondary w-full text-center py-3">
                  Start free
                </Link>
              </SpotlightCard>
            </InViewReveal>

            {/* Pro Plan */}
            <InViewReveal delay={0.2}>
              <SpotlightCard
                className="bg-white dark:bg-slate-900 border-violet-500/80 dark:border-violet-600 rounded-3xl p-8 shadow-xl shadow-violet-500/5 relative flex flex-col justify-between h-full"
                spotlightColor="rgba(124, 58, 237, 0.2)"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro</h3>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-violet-600 text-white uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>

                  <div className="price-container my-4">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">199</span>
                    <span className="text-sm font-medium text-slate-500 ml-1.5">BDT / month</span>
                  </div>
                  <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-6">
                    or 499 BDT for 3 months • save 16%
                  </div>

                  <ul className="space-y-3.5 mb-6 text-sm text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span className="font-medium">Unlimited daily sprints</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span className="font-medium">AI deep-planning & sequence</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span className="font-medium">Full analytics & sprint history</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <CheckIcon />
                      </span>
                      <span className="font-medium">Custom lengths, streak freeze & themes</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link href="/signup" className="btn btn-primary w-full text-center py-3 font-bold">
                    Start 3-day free trial
                  </Link>
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                    No payment needed to start — cancel anytime
                  </p>
                </div>
              </SpotlightCard>
            </InViewReveal>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="pricing-compare-link inline-flex items-center gap-1 group font-semibold text-sm text-violet-600 dark:text-violet-400">
              <span>See full plan comparison</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION WITH ANIMATED ACCORDION --- */}
      <section className="faq section-padding" id="faq">
        <div className="container max-w-3xl mx-auto">
          <InViewReveal className="section-header text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently asked questions</h2>
          </InViewReveal>

          <div className="space-y-4">
            {[
              {
                id: 1,
                q: "Is there a free trial?",
                a: "Yes — every new account gets 3 days of full Pro access with no payment method required. After that you stay on Free (3 sprints a day) unless you upgrade.",
              },
              {
                id: 2,
                q: "How does billing work?",
                a: "We bill monthly or per 3-month cycle depending on your chosen plan. You can cancel at any time directly from your billing dashboard with a single click.",
              },
              {
                id: 3,
                q: "Which payment methods can I use?",
                a: "We support standard local debit/credit cards, mobile banking wallets (bKash, Nagad, Rocket), and international credit cards.",
              },
              {
                id: 4,
                q: "How does the AI build my sprints?",
                a: "Our model analyzes your task description, categorizes priority, estimates task complexity, and structures it into optimized 25-minute Pomodoro sprints with scheduled breaks.",
              },
              {
                id: 5,
                q: "Does it work on mobile?",
                a: "Absolutely! SprintFlow is fully responsive and behaves like a progressive web app (PWA) on mobile devices so you can track focus on the go.",
              },
            ].map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <SpotlightCard
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden"
                  spotlightColor="rgba(124, 58, 237, 0.06)"
                >
                  <button
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.q}</h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER SECTION --- */}
      <section className="cta-banner-section my-16">
        <div className="container">
          <InViewReveal>
            <div className="cta-banner rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 text-white shadow-2xl">
              <div className="cta-logo-box mx-auto mb-6 w-16 h-16">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="30" width="20" height="6" rx="3" fill="#ffffff" fillOpacity="0.6"/>
                  <rect x="15" y="46" width="25" height="6" rx="3" fill="#ffffff" fillOpacity="0.8"/>
                  <rect x="10" y="62" width="20" height="6" rx="3" fill="#ffffff"/>
                  <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#ffffff" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to do your best focus work?</h2>
              <p className="text-violet-100 max-w-xl mx-auto mb-8 text-base">
                Paste your tasks, start a sprint, and let SprintFlow handle the rest. Free to start — no card needed.
              </p>
              <div className="cta-buttons flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  className="btn bg-white text-violet-900 hover:bg-slate-100 font-bold px-8 py-3 rounded-xl shadow-lg"
                  onClick={() => { setModalState("input"); setIsModalOpen(true); }}
                >
                  Start Focusing
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </MagneticButton>
                <a href="#pricing" className="btn border-2 border-white/60 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold">
                  See pricing
                </a>
              </div>
            </div>
          </InViewReveal>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="container">
          <div className="footer-top grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="footer-brand md:col-span-1">
              <Link href="/" className="logo">
                <span>sprintflow</span>
              </Link>
              <p className="footer-desc text-xs text-slate-500 mt-2">
                AI-powered focus & Pomodoro sprints. Turn your task list into deep, rewarding work.
              </p>
            </div>

            <div className="footer-links-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Product</h4>
              <ul className="footer-links-list space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-violet-600">Features</a></li>
                <li><a href="#pricing" className="hover:text-violet-600">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-violet-600">How it works</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Company</h4>
              <ul className="footer-links-list space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><Link href="/planner" className="hover:text-violet-600">AI Planner</Link></li>
                <li><Link href="/dashboard" className="hover:text-violet-600">Dashboard</Link></li>
                <li><Link href="/rewards" className="hover:text-violet-600">Rewards</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Legal</h4>
              <ul className="footer-links-list space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><button onClick={() => setLegalModal("privacy")} className="hover:text-violet-600 text-left">Privacy policy</button></li>
                <li><button onClick={() => setLegalModal("terms")} className="hover:text-violet-600 text-left">Terms of service</button></li>
                <li><button onClick={() => setLegalModal("refund")} className="hover:text-violet-600 text-left">Refund policy</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p>© 2026 SprintFlow. All rights reserved.</p>
            <p className="footer-credits">Made for focused minds</p>
          </div>
        </div>
      </footer>

      {/* --- LEGAL MODAL WITH ANIMATEPRESENCE --- */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={MODAL_BACKDROP_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setLegalModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={SCALE_IN_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {legalModal === "privacy" && "Privacy Policy"}
                  {legalModal === "terms" && "Terms of Service"}
                  {legalModal === "refund" && "Refund Policy"}
                </h2>
                <button
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  onClick={() => setLegalModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className="py-4 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto">
                {legalModal === "privacy" && (
                  <>
                    <p><strong>Last updated: September 2026</strong></p>
                    <p>SprintFlow values your focus and your data privacy. We do not sell, rent, or monetize your task data, sprint notes, or study schedules to third parties.</p>
                    <p>Your task inputs are processed solely to generate prioritized Pomodoro sprints. All communications use TLS 1.3 encryption in transit and secure database storage at rest.</p>
                  </>
                )}
                {legalModal === "terms" && (
                  <>
                    <p><strong>Terms of Use</strong></p>
                    <p>By using SprintFlow, you agree to focus responsibly and use our AI sprint planner in compliance with applicable local laws.</p>
                    <p>Pro subscriptions may be cancelled at any time before the billing renewal date with zero cancellation fees.</p>
                  </>
                )}
                {legalModal === "refund" && (
                  <>
                    <p><strong>100% Satisfaction Guarantee</strong></p>
                    <p>We offer an unconditional 7-day money-back guarantee on all Pro tier monthly and multi-month subscription plans.</p>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button className="btn btn-secondary px-5 py-2 text-xs font-semibold" onClick={() => setLegalModal(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AI PLANNER SIMULATOR MODAL WITH ANIMATEPRESENCE --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={MODAL_BACKDROP_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={SCALE_IN_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-violet-600 dark:text-violet-400">✨</span>
                  SprintFlow AI Planner
                </h2>
                <button
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <div className="pt-4">
                {modalState === "input" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="task-input-textarea">
                      Paste your task list or rough notes:
                    </label>
                    <textarea
                      className="w-full h-32 p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                      id="task-input-textarea"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="- Fix responsive styling bugs&#10;- Add SVG animations&#10;- Implement focus timer"
                    />
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button className="btn btn-secondary text-xs px-4 py-2" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </button>
                      <MagneticButton className="btn btn-primary text-xs px-5 py-2 font-bold" onClick={handleGenerateSprints}>
                        Build My Sprints
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}

                {modalState === "loading" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center space-y-3">
                    <div className="w-8 h-8 mx-auto border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Analyzing list and breaking down sprints...
                    </p>
                  </motion.div>
                )}

                {modalState === "results" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckIcon />
                      <span>Sprints Generated Successfully!</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {generatedSprints.map((sprint, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold text-[10px]">
                              Sprint {idx + 1}
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{sprint.name}</span>
                          </div>
                          <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{sprint.duration} min</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <MagneticButton className="btn btn-primary text-xs px-6 py-2.5 font-bold" onClick={handleStartFocus}>
                        Start Focus Session
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
