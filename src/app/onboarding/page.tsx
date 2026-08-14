"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- SVG ICONS & ILLUSTRATIONS ---
const WelcomeLogoSVG = () => (
  <svg className="w-16 h-16 mx-auto mb-6 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGradOnboarding)" />
    <defs>
      <linearGradient id="logoGradOnboarding" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

const SparklesIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-purple-600">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-blue-600">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-500">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
    <path d="M12 2a7 7 0 0 1 7 7c0 2.6-1.5 4.8-3.6 5.8l-.4.2H7l-.4-.2C4.5 13.8 3 11.6 3 9a7 7 0 0 1 7-7z"></path>
  </svg>
);

const TargetOnboardingIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-green-600">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const BellOnboardingIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-purple-600">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Rhythm setup state variables
  const [sprintLength, setSprintLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(15);

  // Goal setup state variables
  const [dailyGoal, setDailyGoal] = useState(5);
  const [workingHoursStart, setWorkingHoursStart] = useState("9:00 AM");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("6:00 PM");

  const saveSettings = async (notificationsEnabled: boolean) => {
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            sprintLength,
            breakLength,
            longBreakLength,
            dailyGoal,
            workingHoursStart,
            workingHoursEnd,
            notificationsEnabled
          }
        })
      });
      if (!res.ok) {
        console.error("Failed to save settings to server");
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleNotificationSubmit = async (enabled: boolean) => {
    if (enabled) {
      alert("SprintFlow: Push notifications enabled successfully!");
    }
    await saveSettings(enabled);
    setStep(5);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 min-h-screen flex items-center justify-center p-6 font-sans select-none relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.04),transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-[720px] relative z-10 flex flex-col items-center">
        
        {/* --- STEP 1: WELCOME SCREEN --- */}
        {step === 1 && (
          <div className="w-full text-center space-y-8 animate-fade-in">
            <div>
              <WelcomeLogoSVG />
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-slate-900 leading-tight">
                Welcome to SprintFlow, Fahim 👋
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto mt-3 font-medium">
                Let's set up your focus space. This takes about 30 seconds and tunes SprintFlow to the way you work.
              </p>
            </div>

            {/* 3 cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <SparklesIcon />
                </div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wide">AI builds plan</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Paste any to-do list and get focused sprints.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <ClockIcon />
                </div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wide">Work in sprints</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  25-minute Pomodoro focus, guided end to end.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <TrophyIcon />
                </div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wide">Earn as you go</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Collect XP, coins, streaks and badges.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                className="btn btn-primary h-12 px-8 text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 flex items-center gap-2 cursor-pointer"
                onClick={() => setStep(2)}
              >
                Get started ➔
              </button>
              <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors">
                I'll explore on my own
              </Link>
            </div>
          </div>
        )}

        {/* --- MULTI-STEP CARD CONTAINER (STEPS 2, 3, 4) --- */}
        {step >= 2 && step <= 4 && (
          <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
            
            {/* Centered Progress Indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-8 h-2 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#7c3aed]" : "bg-slate-200"}`}></span>
              <span className={`w-8 h-2 rounded-full transition-all duration-300 ${step >= 3 ? "bg-[#7c3aed]" : "bg-slate-200"}`}></span>
              <span className={`w-8 h-2 rounded-full transition-all duration-300 ${step >= 4 ? "bg-[#7c3aed]" : "bg-slate-200"}`}></span>
            </div>

            {/* Main setup wizard card */}
            <div className="w-full max-w-[480px] bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/40">
              
              {/* --- STEP 2: FOCUS RHYTHM --- */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto">
                      <ClockIcon />
                    </div>
                    <h2 className="font-heading font-extrabold text-xl text-slate-800">Set your focus rhythm</h2>
                    <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto leading-normal">
                      How long should each sprint and break last? You can change this anytime.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Sprint length field */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sprint length</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            sprintLength === 15 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setSprintLength(15)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">15 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Quick wins</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            sprintLength === 25 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setSprintLength(25)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">25 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-purple-600 font-extrabold mt-0.5">Recommended</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            sprintLength === 30 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setSprintLength(30)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">30 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Deep work</span>
                        </button>
                      </div>
                    </div>

                    {/* Break length field */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Break length</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            breakLength === 5 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setBreakLength(5)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">5 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Short reset</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            breakLength === 10 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setBreakLength(10)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">10 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Longer pause</span>
                        </button>
                      </div>
                    </div>

                    {/* Long Break length field */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Long break · every 4 sprints</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            longBreakLength === 15 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setLongBreakLength(15)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">15 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Recharge</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            longBreakLength === 20 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setLongBreakLength(20)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">20 <span className="text-[10px] font-semibold text-slate-500">min</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">Step away</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 3: DAILY FOCUS GOAL --- */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                      <TargetOnboardingIcon />
                    </div>
                    <h2 className="font-heading font-extrabold text-xl text-slate-800">What's your daily goal?</h2>
                    <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto leading-normal">
                      Pick a target you can hit most days — momentum beats intensity.
                    </p>
                  </div>

                  <div className="space-y-5 pt-2">
                    {/* Sprints goal options */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily focus goal</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            dailyGoal === 3 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setDailyGoal(3)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">3 <span className="text-[10px] font-semibold text-slate-500">sprints</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">~1h 15m</span>
                          <span className="text-[7px] text-slate-400 mt-0.5">Light</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            dailyGoal === 5 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setDailyGoal(5)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">5 <span className="text-[10px] font-semibold text-slate-500">sprints</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">~2h 05m</span>
                          <span className="text-[7px] text-purple-600 font-extrabold mt-0.5">Balanced</span>
                        </button>
                        <button 
                          className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            dailyGoal === 8 ? "border-[#7c3aed] bg-purple-50/40 ring-1 ring-purple-100" : "border-slate-200 hover:bg-slate-50"
                          }`}
                          onClick={() => setDailyGoal(8)}
                        >
                          <span className="font-heading font-extrabold text-sm text-slate-800">8 <span className="text-[10px] font-semibold text-slate-500">sprints</span></span>
                          <span className="text-[8px] text-slate-400 font-bold mt-0.5">~3h 20m</span>
                          <span className="text-[7px] text-slate-400 mt-0.5">Ambitious</span>
                        </button>
                      </div>
                    </div>

                    {/* Working hours selects */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Working hours</label>
                      <div className="grid grid-cols-2 gap-3.5">
                        
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Start</span>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-xs">
                              🕒
                            </span>
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-xs font-semibold focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer"
                              value={workingHoursStart}
                              onChange={(e) => setWorkingHoursStart(e.target.value)}
                            >
                              <option>8:00 AM</option>
                              <option>9:00 AM</option>
                              <option>10:00 AM</option>
                              <option>11:00 AM</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">End</span>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-xs">
                              🕒
                            </span>
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-8 pr-3 text-xs font-semibold focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer"
                              value={workingHoursEnd}
                              onChange={(e) => setWorkingHoursEnd(e.target.value)}
                            >
                              <option>5:00 PM</option>
                              <option>6:00 PM</option>
                              <option>7:00 PM</option>
                              <option>8:00 PM</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 4: NOTIFICATIONS SETUP --- */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto">
                      <BellOnboardingIcon />
                    </div>
                    <h2 className="font-heading font-extrabold text-xl text-slate-800">Stay on track</h2>
                    <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto leading-normal">
                      Gentle nudges keep your sprints and streak alive — no spam, ever.
                    </p>
                  </div>

                  {/* Browser notification mockup preview */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                    <div className="bg-white border border-slate-200/40 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center shrink-0 text-white font-heading font-extrabold text-sm select-none">
                        S
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-800 leading-tight">Time to focus 🎯</h4>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">now</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                          Sprint 2 "Debug dashboard" starts now.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist of features */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-50 text-[#7c3aed] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">Sprint reminders</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">Know exactly when each focus block begins.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ☕
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">Break nudges</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">Step away at the right time and come back sharp.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        🔥
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 leading-tight">Streak alerts</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">A heads-up before your streak is at risk.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Navigation */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                <button 
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
                {step === 4 ? (
                  <div className="flex flex-col items-end gap-2.5">
                    <button 
                      className="btn btn-primary h-10 px-5 text-xs font-bold shadow-md shadow-purple-500/10 flex items-center gap-2 cursor-pointer"
                      onClick={() => handleNotificationSubmit(true)}
                    >
                      <BellOnboardingIcon />
                      Enable notifications
                    </button>
                    <button 
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-bold transition-colors cursor-pointer mr-2.5"
                      onClick={() => handleNotificationSubmit(false)}
                    >
                      Maybe later
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary h-10 px-6 text-xs font-bold shadow-md shadow-purple-500/10 flex items-center gap-2 cursor-pointer"
                    onClick={() => setStep(step + 1)}
                  >
                    Continue ➔
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {/* --- STEP 5: ALL SET COMPLETE SCREEN --- */}
        {step === 5 && (
          <div className="w-full text-center space-y-8 animate-fade-in relative">
            {/* Confetti particles decoration */}
            <div className="absolute top-12 left-[10%] w-2 h-4 bg-yellow-400 transform rotate-12 opacity-80 rounded-sm"></div>
            <div className="absolute top-24 left-[20%] w-2.5 h-2.5 bg-green-400 rounded-full opacity-60"></div>
            <div className="absolute top-8 left-[35%] w-1.5 h-3.5 bg-blue-400 transform -rotate-45 opacity-70"></div>
            <div className="absolute bottom-20 left-[15%] w-2 h-4 bg-pink-400 transform rotate-45 opacity-80 rounded-sm"></div>
            <div className="absolute top-16 right-[15%] w-2.5 h-2.5 bg-purple-400 rounded-full opacity-70"></div>
            <div className="absolute top-32 right-[25%] w-2.5 h-2.5 bg-green-400 transform rotate-12 opacity-75"></div>
            <div className="absolute bottom-16 right-[18%] w-2 h-4 bg-yellow-400 transform -rotate-12 opacity-85 rounded-sm"></div>
            
            <div className="space-y-4">
              {/* Checked circle icon */}
              <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-md">
                ✓
              </div>
              
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-800 leading-tight">
                You're all set, Fahim! 🎉
              </h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-md mx-auto leading-normal">
                Your focus space is ready. Add your first tasks and let AI build today's plan.
              </p>
            </div>

            {/* Config summary badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200/60 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
                🕒 {sprintLength}-min sprints
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200/60 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
                🎯 {dailyGoal} sprints / day
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200/60 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
                📅 {workingHoursStart} – {workingHoursEnd}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                className="btn btn-primary h-12 px-8 text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/tasks")}
              >
                Add your first tasks
              </button>
              <button 
                className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer bg-transparent border-0"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
