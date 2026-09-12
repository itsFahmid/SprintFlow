"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- CUSTOM INLINE SVG ICON COMPONENTS ---
const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M5 3L6 4M19 19L20 20M19 3L18 4M5 19L4 20" strokeWidth="1.5" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a7 7 0 0 1 7 7c0 2.6-1.5 4.8-3.6 5.8l-.4.2H7l-.4-.2C4.5 13.8 3 11.6 3 9a7 7 0 0 1 7-7z" />
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
}

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(1); // FAQ 1 open by default matching screenshot
  
  // Timer States
  const [taskName, setTaskName] = useState("Debug dashboard slow-load");
  const [totalDuration, setTotalDuration] = useState(25 * 60); // Default 25 min
  const [remainingTime, setRemainingTime] = useState(18 * 60 + 24); // Starts at 18:24 matching screenshot
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerLabel, setTimerLabel] = useState("remaining");
  
  // Modal States
  const [modalState, setModalState] = useState<"input" | "loading" | "results">("input");
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "refund" | null>(null);
  const [taskInput, setTaskInput] = useState(
    `- Fix responsive styling bugs in the header\n- Add inline SVGs to optimize page loading speed\n- Implement the interactive timer in JS\n- Push changes to staging server for QA testing`
  );
  const [generatedSprints, setGeneratedSprints] = useState<Sprint[]>([]);

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

    // Extract lines
    const parsedTasks = taskInput
      .split("\n")
      .map(line => line.replace(/^[-*•\d\.\s]+/, "").trim())
      .filter(t => t.length > 0);

    if (parsedTasks.length === 0) {
      parsedTasks.push("Focus sprint session");
    }

    setTimeout(() => {
      const sprints = parsedTasks.map((task, idx) => ({
        name: task,
        duration: idx === parsedTasks.length - 1 ? 15 : 25
      }));
      setGeneratedSprints(sprints);
      setModalState("results");
    }, 1600);
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

  // Helper formatting
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* --- HEADER / NAVIGATION --- */}
      <header className="header">
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
            <Link href="/login" className="login-link">Log in</Link>
            <button className="btn btn-primary header-btn" onClick={() => { setModalState("input"); setIsModalOpen(true); }}>
              Start Focusing
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <div className="container">
          
          <h1>Turn your task list into focused sprints</h1>
          
          <p className="hero-subtitle">
            Paste your to-dos and SprintFlow's AI builds a Pomodoro plan, guides every focus session, and rewards the work you get done.
          </p>

          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => { setModalState("input"); setIsModalOpen(true); }}>
              Start Focusing
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <a href="#how-it-works" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"></polygon></svg>
              See how it works
            </a>
          </div>

          <div className="hero-rating">
            <div className="avatar-group">
              <div className="avatar" style={{ backgroundColor: "#818cf8" }}>A</div>
              <div className="avatar" style={{ backgroundColor: "#60a5fa", marginLeft: "-10px" }}>S</div>
              <div className="avatar" style={{ backgroundColor: "#34d399", marginLeft: "-10px" }}>T</div>
              <div className="avatar" style={{ backgroundColor: "#fb7185", marginLeft: "-10px" }}>M</div>
              <div className="avatar" style={{ backgroundColor: "#fbbf24", marginLeft: "-10px" }}>K</div>
            </div>
            <div className="rating-details flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              </div>
              <span className="rating-score font-bold text-slate-900">4.9</span>
              <span className="text-slate-600 font-medium text-xs">Loved by 12,000+ focused minds</span>
            </div>
          </div>

          {/* App Mockup */}
          <div className="hero-mockup-wrapper">
            <div className="app-mockup">
              <div className="app-header-bar">
                <div className="app-hud-status flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] font-mono tracking-wider text-slate-300">SESSION HUD</span>
                </div>
                <div className="app-address-bar font-mono text-[11px] text-slate-400">SPRINT 1 OF 3 • 25M FOCUS</div>
                <div className="app-xp-badge-container">
                  <div className="app-xp-badge" id="xp-indicator" style={{ transform: isPlaying ? "scale(1.02)" : "scale(1)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    <div>
                      <strong>+40 XP earned</strong>
                      <span>Sprint completed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="app-content">
                <div className="app-focus-status">
                  <span className="status-dot"></span>
                  {isPlaying ? "FOCUS IN PROGRESS" : "FOCUS PAUSED"}
                </div>

                <div className="app-timer-container" onClick={() => setIsPlaying(!isPlaying)} title="Click to play/pause">
                  <svg className="timer-svg" viewBox="0 0 220 220">
                    <circle className="timer-track" cx="110" cy="110" r="100"></circle>
                    <circle 
                      className="timer-progress" 
                      cx="110" 
                      cy="110" 
                      r="100"
                      style={{ strokeDashoffset: strokeOffset }}
                    ></circle>
                  </svg>
                  <div className="timer-text-wrapper">
                    <div className="timer-time">{formatTime(remainingTime)}</div>
                    <div className="timer-label" style={{ color: isPlaying ? "#a78bfa" : "#94a3b8" }}>{timerLabel}</div>
                  </div>
                </div>

                <div className="app-task-name">{taskName}</div>

                <div className="app-streak-badge">
                  <div className="streak-icon text-amber-500 bg-amber-500/10 p-1.5 rounded-lg flex items-center justify-center">
                    <FlameIcon />
                  </div>
                  <div className="streak-text">
                    <h4>7-day streak</h4>
                    <p>Keep it alive!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="how-it-works section-padding" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <h2>From to-do list to done in three steps</h2>
            <p>No setup, no fuss — paste your tasks and start focusing in under a minute.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-box icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><polyline points="3 6 4 7 6 5"></polyline><polyline points="3 12 4 13 6 11"></polyline><polyline points="3 18 4 19 6 17"></polyline></svg>
              </div>
              <span className="step-num">1</span>
              <h3>Paste your tasks</h3>
              <p>Drop in your to-do list — bullet points, rough notes, anything goes.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-box icon-blue">
                <SparklesIcon />
              </div>
              <span className="step-num">2</span>
              <h3>AI builds your sprints</h3>
              <p>Get a prioritized plan of 15-30 min Pomodoro sprints in seconds.</p>
            </div>

            <div className="step-card">
              <div className="step-icon-box icon-green">
                <TrophyIcon />
              </div>
              <span className="step-num">3</span>
              <h3>Focus & earn</h3>
              <p>Run guided sessions and rack up XP, streaks, coins and badges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="features section-padding" id="features">
        <div className="container">
          <div className="section-header text-center">
            <h2>Everything you need to focus</h2>
            <p>One calm, AI-native workspace that plans your day and keeps you in flow.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3>AI sprint breakdown</h3>
              <p>Turns any messy task list into a clear, prioritized Pomodoro plan.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3>Distraction-free timer</h3>
              <p>A focus mode with countdown, progress ring and gentle guidance.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3>Daily planner</h3>
              <p>See your sprints and breaks laid out on a clean visual timeline.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Gamified progress</h3>
              <p>Earn XP, level up, keep streaks and unlock badges as you work.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h3>Insightful analytics</h3>
              <p>Track focus time, completed sprints and productivity trends.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h3>Desktop & mobile</h3>
              <p>Your plan and timer stay in sync everywhere you focus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GAMIFICATION / MOTIVATION SECTION --- */}
      <section className="gamification section-padding">
        <div className="container">
          <div className="gamification-wrapper">
            <div className="gamification-info">
              <h2>Make focus feel like a game</h2>
              <p className="gamification-subtitle">
                Every finished sprint earns XP and coins, builds your streak, and pushes you up the levels. Small wins, compounding momentum.
              </p>
              <ul className="gamification-list">
                <li><span className="check-icon flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-full w-5 h-5"><CheckIcon /></span> Earn XP and level up with every sprint</li>
                <li><span className="check-icon flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-full w-5 h-5"><CheckIcon /></span> Build daily streaks you won't want to break</li>
                <li><span className="check-icon flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-full w-5 h-5"><CheckIcon /></span> Collect coins and redeem rewards</li>
                <li><span className="check-icon flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-full w-5 h-5"><CheckIcon /></span> Unlock achievement badges as you grow</li>
              </ul>
            </div>

            <div className="gamification-visual">
              <div className="gamified-preview-card">
                <div className="gamified-card-header">
                  <div className="level-badge">12</div>
                  <div className="level-text">
                    <h3>Level 12 • Focus Architect</h3>
                    <p>520 XP to Level 13</p>
                  </div>
                </div>
                
                <div className="xp-progress-container">
                  <div className="xp-progress-bar">
                    <div className="xp-progress-fill"></div>
                  </div>
                </div>

                <div className="gamified-stats-grid">
                  <div className="stat-box">
                    <div className="stat-box-icon text-amber-500"><ZapIcon /></div>
                    <h4>2,480</h4>
                    <p>XP</p>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-icon text-amber-500"><CoinIcon /></div>
                    <h4>340</h4>
                    <p>Coins</p>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-icon text-amber-500"><FlameIcon /></div>
                    <h4>7</h4>
                    <p>Streak</p>
                  </div>
                </div>

                <div className="gamified-badges-row">
                  <div className="badge-slot flame text-amber-500 flex items-center justify-center" title="Flame Streak Badge"><FlameIcon /></div>
                  <div className="badge-slot target text-indigo-500 flex items-center justify-center" title="Bullseye Focus Badge"><TargetIcon /></div>
                  <div className="badge-slot crown text-amber-500 flex items-center justify-center" title="Crown Achievements Badge"><CrownIcon /></div>
                  <div className="badge-slot bolt text-amber-500 flex items-center justify-center" title="Supercharged Energy Badge"><ZapIcon /></div>
                  <div className="badge-slot more text-slate-700 font-bold flex items-center justify-center">+20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="pricing section-padding" id="pricing">
        <div className="container">
          <div className="section-header text-center">
            <h2>Simple pricing, serious focus</h2>
            <p>Start free forever. Go Pro for unlimited focus — with a 3-day trial, no card needed.</p>
          </div>

          <div className="pricing-grid">
            {/* Free Plan */}
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price-container">
                <span className="price-currency">0</span>
                <span className="price-period">BDT / forever</span>
              </div>
              <div className="price-no-discount-spacer"></div>

              <ul className="pricing-list">
                <li><span className="check-icon flex items-center justify-center text-slate-600 bg-slate-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> 3 focus sprints per day</li>
                <li><span className="check-icon flex items-center justify-center text-slate-600 bg-slate-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> Basic AI task breakdown</li>
                <li><span className="check-icon flex items-center justify-center text-slate-600 bg-slate-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> This-week analytics</li>
                <li><span className="check-icon flex items-center justify-center text-slate-600 bg-slate-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> Streaks & daily goal</li>
              </ul>

              <Link href="/signup" className="btn btn-secondary text-center">Start free</Link>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card popular">
              <span className="pricing-card-badge">Most popular</span>
              <h3>Pro</h3>
              <div className="price-container">
                <span className="price-currency">199</span>
                <span className="price-period">BDT / month</span>
              </div>
              <div className="price-discount-text">or 499 BDT for 3 months • save 16%</div>

              <ul className="pricing-list">
                <li><span className="check-icon flex items-center justify-center text-violet-700 bg-violet-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> Unlimited daily sprints</li>
                <li><span className="check-icon flex items-center justify-center text-violet-700 bg-violet-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> AI deep-planning</li>
                <li><span className="check-icon flex items-center justify-center text-violet-700 bg-violet-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> Full analytics & history</li>
                <li><span className="check-icon flex items-center justify-center text-violet-700 bg-violet-100 rounded-full w-4 h-4 shrink-0"><CheckIcon /></span> Custom lengths, streak freeze & themes</li>
              </ul>

              <Link href="/signup" className="btn btn-primary text-center">
                Start 3-day free trial
              </Link>
              <p className="pricing-subtext">No payment needed to start - cancel anytime</p>
            </div>
          </div>

          <Link href="/pricing" className="pricing-compare-link inline-flex items-center gap-1 group">
            <span>See full plan comparison</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* --- WORKFLOW STUDIES SECTION --- */}
      <section className="testimonials section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2>Real workflow breakdowns</h2>
            <p>How developers, founders, and students structure high-output focus sessions.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">Software Engineering</span>
                  <div className="testimonial-rating flex items-center gap-0.5">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </div>
                </div>
                <p className="testimonial-text">
                  “Turned a 14-item backlog dump into 4 structured 25-minute Pomodoro blocks. Shipped OAuth & DB migrations in one afternoon without burnout.”
                </p>
              </div>
              <div className="testimonial-user mt-4 pt-4 border-t border-slate-100">
                <div className="user-avatar user-a">A</div>
                <div className="user-details">
                  <h4 className="user-name font-bold text-slate-900">Aarav M.</h4>
                  <p className="user-role text-xs text-slate-500">Full-Stack Developer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">Academic Research</span>
                  <div className="testimonial-rating flex items-center gap-0.5">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </div>
                </div>
                <p className="testimonial-text">
                  “Organized 3 complex pharmacology chapters into timed review sprints with scheduled breaks. Kept my focus streak alive for 23 days straight.”
                </p>
              </div>
              <div className="testimonial-user mt-4 pt-4 border-t border-slate-100">
                <div className="user-avatar user-s">S</div>
                <div className="user-details">
                  <h4 className="user-name font-bold text-slate-900">Sadia R.</h4>
                  <p className="user-role text-xs text-slate-500">Medical Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">Startup Building</span>
                  <div className="testimonial-rating flex items-center gap-0.5">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </div>
                </div>
                <p className="testimonial-text">
                  “Eliminated morning planning fatigue entirely. I paste raw brainstorm bullets, hit Start Focus, and execute the prioritized sprints immediately.”
                </p>
              </div>
              <div className="testimonial-user mt-4 pt-4 border-t border-slate-100">
                <div className="user-avatar user-t">T</div>
                <div className="user-details">
                  <h4 className="user-name font-bold text-slate-900">Tanvir H.</h4>
                  <p className="user-role text-xs text-slate-500">Bootstrapped Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="faq section-padding" id="faq">
        <div className="container">
          <div className="section-header text-center">
            <h2>Frequently asked questions</h2>
          </div>

          <div className="faq-list">
            {/* FAQ 1 */}
            <div className={`faq-item ${activeFaq === 1 ? "active" : ""}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(1)} aria-expanded={activeFaq === 1}>
                <h3>Is there a free trial?</h3>
                <div className="faq-toggle-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={activeFaq === 1 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                  </svg>
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  Yes — every new account gets 3 days of full Pro access with no payment method required. After that you stay on Free (3 sprints a day) unless you upgrade.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className={`faq-item ${activeFaq === 2 ? "active" : ""}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(2)} aria-expanded={activeFaq === 2}>
                <h3>How does billing work?</h3>
                <div className="faq-toggle-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={activeFaq === 2 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                  </svg>
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  We bill monthly or per 3-month cycle depending on your chosen plan. You can cancel at any time directly from your billing dashboard with a single click.
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className={`faq-item ${activeFaq === 3 ? "active" : ""}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(3)} aria-expanded={activeFaq === 3}>
                <h3>Which payment methods can I use?</h3>
                <div className="faq-toggle-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={activeFaq === 3 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                  </svg>
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  We support standard local debit/credit cards, mobile banking wallets (bkash, Nagad, Rocket), and international credit cards.
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className={`faq-item ${activeFaq === 4 ? "active" : ""}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(4)} aria-expanded={activeFaq === 4}>
                <h3>How does the AI build my sprints?</h3>
                <div className="faq-toggle-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={activeFaq === 4 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                  </svg>
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  Our model analyzes your task description, categorizes priority, estimates task complexity, and structures it into optimized 25-minute Pomodoro sprints with scheduled breaks.
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className={`faq-item ${activeFaq === 5 ? "active" : ""}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(5)} aria-expanded={activeFaq === 5}>
                <h3>Does it work on mobile?</h3>
                <div className="faq-toggle-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={activeFaq === 5 ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                  </svg>
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  Absolutely! SprintFlow is fully responsive and behaves like a progressive web app (PWA) on mobile devices so you can track focus on the go.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BANNER SECTION --- */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-logo-box">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
                <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
                <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
                <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#ctaLogoGrad)" />
                <defs>
                  <linearGradient id="ctaLogoGrad" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a78bfa"/>
                    <stop offset="0.5" stopColor="#7c3aed"/>
                    <stop offset="1" stopColor="#4f46e5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2>Ready to do your best focus work?</h2>
            <p>Paste your tasks, start a sprint, and let SprintFlow handle the rest. Free to start — no card needed.</p>
            <div className="cta-buttons">
              <button className="btn btn-white" onClick={() => { setModalState("input"); setIsModalOpen(true); }}>
                Start Focusing
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <a href="#pricing" className="btn btn-outline-white">See pricing</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <svg className="logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="30" width="20" height="6" rx="3" fill="#ffffff" fillOpacity="0.6"/>
                  <rect x="15" y="46" width="25" height="6" rx="3" fill="#ffffff" fillOpacity="0.8"/>
                  <rect x="10" y="62" width="20" height="6" rx="3" fill="#ffffff"/>
                  <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="#ffffff" />
                </svg>
                <span>sprintflow</span>
              </Link>
              <p className="footer-desc">
                AI-powered focus & Pomodoro sprints. Turn your task list into deep, rewarding work.
              </p>
              <div className="social-links">
                <a href="#" className="social-btn" aria-label="Twitter / X">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a href="#" className="social-btn" aria-label="Website">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </a>
                <a href="#" className="social-btn" aria-label="Email">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Product</h4>
              <ul className="footer-links-list">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#how-it-works" className="footer-link">How it works</a></li>
                <li><a href="#" className="footer-link">Download apps</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Company</h4>
              <ul className="footer-links-list">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Legal</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => setLegalModal("privacy")} className="footer-link text-left">Privacy policy</button></li>
                <li><button onClick={() => setLegalModal("terms")} className="footer-link text-left">Terms of service</button></li>
                <li><button onClick={() => setLegalModal("refund")} className="footer-link text-left">Refund policy</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 SprintFlow. All rights reserved.</p>
            <p className="footer-credits">Made for focused minds</p>
          </div>
        </div>
      </footer>

      {/* --- LEGAL MODAL DIALOG --- */}
      {legalModal && (
        <div className="modal-overlay active">
          <div className="modal-window max-w-xl">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-slate-900">
                {legalModal === "privacy" && "Privacy Policy"}
                {legalModal === "terms" && "Terms of Service"}
                {legalModal === "refund" && "Refund Policy"}
              </h2>
              <button className="modal-close-btn" onClick={() => setLegalModal(null)}>&times;</button>
            </div>
            <div className="modal-body space-y-4 text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto">
              {legalModal === "privacy" && (
                <>
                  <p><strong>Last updated: September 2026</strong></p>
                  <p>SprintFlow values your focus and your data privacy. We do not sell, rent, or monetize your task data, sprint notes, or study schedules to third parties.</p>
                  <p>Your task inputs are processed solely to generate prioritized Pomodoro sprints. All communications use TLS 1.3 encryption in transit and secure database storage at rest.</p>
                  <p>You may request complete export or deletion of your account and sprint history at any time from your settings workspace.</p>
                </>
              )}
              {legalModal === "terms" && (
                <>
                  <p><strong>Terms of Use</strong></p>
                  <p>By using SprintFlow, you agree to focus responsibly and use our AI sprint planner in compliance with applicable local laws.</p>
                  <p>SprintFlow provides focus timers, AI planning assistance, and streak mechanics on an as-is basis designed to boost personal productivity.</p>
                  <p>Pro subscriptions may be cancelled at any time before the billing renewal date with zero cancellation fees.</p>
                </>
              )}
              {legalModal === "refund" && (
                <>
                  <p><strong>100% Satisfaction Guarantee</strong></p>
                  <p>We offer an unconditional 7-day money-back guarantee on all Pro tier monthly and multi-month subscription plans.</p>
                  <p>If SprintFlow doesn't measurably improve your daily study or work focus, simply contact support or initiate a refund from your billing dashboard.</p>
                </>
              )}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button className="btn btn-secondary" onClick={() => setLegalModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INTERACTIVE SIMULATOR MODAL (WOW FACTOR) --- */}
      <div className={`modal-overlay ${isModalOpen ? "active" : ""}`}>
        <div className="modal-window">
          <div className="modal-header">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 22 22 22"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              SprintFlow AI Planner
            </h2>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
          </div>

          <div className="modal-body">
            {/* State 1: Input */}
            {modalState === "input" && (
              <div>
                <label className="modal-input-label" htmlFor="task-input-textarea">Paste your task list or rough notes:</label>
                <textarea 
                  className="modal-textarea" 
                  id="task-input-textarea"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="- Fix responsive styling bugs in the header&#10;- Add inline SVGs to optimize page loading speed&#10;- Implement the interactive timer in JS&#10;- Push changes to staging server for QA testing"
                ></textarea>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleGenerateSprints}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
                    Build My Sprints
                  </button>
                </div>
              </div>
            )}

            {/* State 2: Loading */}
            {modalState === "loading" && (
              <div className="modal-loading" style={{ display: "block" }}>
                <div className="spinner"></div>
                <p>Analyzing list and breaking down sprints...</p>
              </div>
            )}

            {/* State 3: Results */}
            {modalState === "results" && (
              <div className="modal-results" style={{ display: "block" }}>
                <div className="modal-results-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Sprints Generated Successfully!
                </div>
                <ul className="modal-sprint-list">
                  {generatedSprints.map((sprint, idx) => (
                    <li key={idx} className="modal-sprint-item" style={{ opacity: 1, transform: "none" }}>
                      <div className="sprint-info">
                        <span className="sprint-badge">Sprint {idx + 1}</span>
                        <span className="sprint-name">{sprint.name}</span>
                      </div>
                      <span className="sprint-duration">{sprint.duration} min</span>
                    </li>
                  ))}
                </ul>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={handleStartFocus}>Start Focus Session</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
