"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

// --- SVG NAVIGATION ICONS ---
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

const SettingsIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-[#7c3aed]">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoSVG = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGradSettings)" />
    <defs>
      <linearGradient id="logoGradSettings" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

type SettingsTab = "account" | "focus" | "notifications" | "privacy";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Profile fields
  const [name, setName] = useState("Fahim Siddique");
  const [username, setUsername] = useState("@fahim");
  const [email, setEmail] = useState("fahimsahmed01@gmail.com");
  const [userPlan, setUserPlan] = useState("Pro");

  // Focus & Pomodoro fields
  const [sprintLength, setSprintLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartNextSprint, setAutoStartNextSprint] = useState(false);
  const [soundTheme, setSoundTheme] = useState("Soft chime");
  const [tickingSound, setTickingSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(75);
  const [dailySprintGoal, setDailySprintGoal] = useState(5);
  const [workingHoursStart, setWorkingHoursStart] = useState("9:00 AM");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("6:00 PM");

  // Notifications fields
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sprintReminders, setSprintReminders] = useState(true);
  const [breakNudges, setBreakNudges] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [achievementUnlocks, setAchievementUnlocks] = useState(false);
  const [productUpdates, setProductUpdates] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("10:00 PM");
  const [quietHoursEnd, setQuietHoursEnd] = useState("7:00 AM");

  // Privacy fields
  const [usageAnalytics, setUsageAnalytics] = useState(true);
  const [personalizedAi, setPersonalizedAi] = useState(true);
  const [showOnLeaderboards, setShowOnLeaderboards] = useState(false);

  // Modal dialog states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        const u = data.user;
        setName(u.name || "Fahim Siddique");
        setEmail(u.email || "fahimsahmed01@gmail.com");
        if (u.subscription?.plan) setUserPlan(u.subscription.plan);

        const s = u.settings || {};
        if (s.username) setUsername(s.username);
        if (s.sprintLength) setSprintLength(s.sprintLength);
        if (s.breakLength) setBreakLength(s.breakLength);
        if (s.longBreakLength) setLongBreakLength(s.longBreakLength);
        if (s.longBreakInterval) setLongBreakInterval(s.longBreakInterval);
        if (s.autoStartBreaks !== undefined) setAutoStartBreaks(s.autoStartBreaks);
        if (s.autoStartNextSprint !== undefined) setAutoStartNextSprint(s.autoStartNextSprint);
        if (s.soundTheme) setSoundTheme(s.soundTheme);
        if (s.tickingSound !== undefined) setTickingSound(s.tickingSound);
        if (s.soundVolume !== undefined) setSoundVolume(s.soundVolume);
        if (s.dailyGoal) setDailySprintGoal(s.dailyGoal);
        if (s.workingHoursStart) setWorkingHoursStart(s.workingHoursStart);
        if (s.workingHoursEnd) setWorkingHoursEnd(s.workingHoursEnd);

        if (s.pushEnabled !== undefined) setPushEnabled(s.pushEnabled);
        if (s.emailNotifications !== undefined) setEmailNotifications(s.emailNotifications);
        if (s.sprintReminders !== undefined) setSprintReminders(s.sprintReminders);
        if (s.breakNudges !== undefined) setBreakNudges(s.breakNudges);
        if (s.streakAlerts !== undefined) setStreakAlerts(s.streakAlerts);
        if (s.dailySummary !== undefined) setDailySummary(s.dailySummary);
        if (s.achievementUnlocks !== undefined) setAchievementUnlocks(s.achievementUnlocks);
        if (s.productUpdates !== undefined) setProductUpdates(s.productUpdates);
        if (s.quietHoursEnabled !== undefined) setQuietHoursEnabled(s.quietHoursEnabled);
        if (s.quietHoursStart) setQuietHoursStart(s.quietHoursStart);
        if (s.quietHoursEnd) setQuietHoursEnd(s.quietHoursEnd);

        if (s.usageAnalytics !== undefined) setUsageAnalytics(s.usageAnalytics);
        if (s.personalizedAi !== undefined) setPersonalizedAi(s.personalizedAi);
        if (s.showOnLeaderboards !== undefined) setShowOnLeaderboards(s.showOnLeaderboards);

        setLoading(false);
      } catch (err) {
        console.error("Settings load error:", err);
        router.push("/login");
      }
    };
    fetchSettings();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name,
        username,
        email,
        settings: {
          sprintLength,
          breakLength,
          longBreakLength,
          longBreakInterval,
          autoStartBreaks,
          autoStartNextSprint,
          soundTheme,
          tickingSound,
          soundVolume,
          dailyGoal: dailySprintGoal,
          workingHoursStart,
          workingHoursEnd,
          pushEnabled,
          emailNotifications,
          sprintReminders,
          breakNudges,
          streakAlerts,
          dailySummary,
          achievementUnlocks,
          productUpdates,
          quietHoursEnabled,
          quietHoursStart,
          quietHoursEnd,
          usageAnalytics,
          personalizedAi,
          showOnLeaderboards
        }
      };

      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export_data" })
      });
      const data = await res.json();
      if (data.exportData) {
        const jsonStr = JSON.stringify(data.exportData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sprintflow-data-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear your sprint and analytics history? Your account and settings will be kept.")) return;
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_history" })
      });
      if (res.ok) {
        alert("Sprint and analytics history cleared successfully.");
      }
    } catch (err) {
      console.error("Clear history error:", err);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", newPassword })
      });
      if (res.ok) {
        alert("Password updated successfully.");
        setShowPasswordModal(false);
        setNewPassword("");
      }
    } catch (err) {
      console.error("Password change error:", err);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

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
      {/* User Profile Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase select-none">
            {name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{name}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {userPlan === "Pro" ? "Level 12 · Pro" : "Level 1 · Free"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveTab("account")} className="p-1 rounded-lg hover:bg-slate-100 transition-colors" title="Settings">
            <SettingsIcon />
          </button>
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
        <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading settings...</p>
      </div>
    );
  }

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

      {/* Main Settings Body */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div>
            <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Settings</h1>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Manage your account, focus rhythm, notifications and data</p>
          </div>

          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
              <span>✓</span>
              <span>Changes saved successfully</span>
            </div>
          )}
        </header>

        {/* Settings Grid (Sidebar Nav + Main Content Card) */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1300px] w-full mx-auto animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* --- SETTINGS TAB NAV (4 cols) --- */}
            <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-3xl p-3 shadow-sm space-y-1">
              
              {/* Account */}
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "account"
                    ? "bg-purple-50 text-[#7c3aed] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm">👤</span>
                <span>Account</span>
              </button>

              {/* Focus & Pomodoro */}
              <button
                onClick={() => setActiveTab("focus")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "focus"
                    ? "bg-purple-50 text-[#7c3aed] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm">⚡</span>
                <span>Focus & Pomodoro</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "notifications"
                    ? "bg-purple-50 text-[#7c3aed] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm">🔔</span>
                <span>Notifications</span>
              </button>

              {/* Subscription & Billing (Links directly to /subscription) */}
              <Link
                href="/subscription"
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">💳</span>
                  <span>Subscription & Billing</span>
                </div>
                <span className="text-slate-400 text-xs">➔</span>
              </Link>

              {/* Privacy & Data */}
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-purple-50 text-[#7c3aed] shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm">🛡</span>
                <span>Privacy & Data</span>
              </button>

            </div>

            {/* --- MAIN SETTINGS PANEL (9 cols) --- */}
            <div className="lg:col-span-9 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
              
              {/* ========================================================================= */}
              {/* --- SCREEN 25: SETTINGS — ACCOUNT --- */}
              {/* ========================================================================= */}
              {activeTab === "account" && (
                <div className="space-y-8 animate-fade-in">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="font-heading font-extrabold text-xl text-slate-900">Account</h2>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>

                  {/* Profile Section */}
                  <div className="space-y-4">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">PROFILE</span>
                    
                    {/* Avatar row */}
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-[#6366f1] text-white font-bold flex items-center justify-center text-xl shadow-md border-2 border-indigo-100 select-none">
                        {name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => alert("Upload photo feature ready.")}
                            className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Change photo
                          </button>
                          <button 
                            onClick={() => alert("Photo removed.")}
                            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">JPG or PNG, at least 200×200px.</p>
                      </div>
                    </div>

                    {/* Form Inputs Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Full name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Email address field */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-bold text-slate-700">Email address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                          👤
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold">
                            ✓ Verified
                          </span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Security Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">SECURITY</span>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Password</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Last changed 3 months ago</p>
                      </div>

                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Change password
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>➔</span>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* --- SCREEN 26: SETTINGS — FOCUS & POMODORO --- */}
              {/* ========================================================================= */}
              {activeTab === "focus" && (
                <div className="space-y-8 animate-fade-in">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="font-heading font-extrabold text-xl text-slate-900">Focus & Pomodoro</h2>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>

                  {/* TIMER SECTION */}
                  <div className="space-y-5">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">TIMER</span>
                    
                    {/* Sprint length */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Sprint length</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Length of each focus block</p>
                      </div>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 select-none">
                        {[15, 25, 30].map(val => (
                          <button
                            key={val}
                            onClick={() => setSprintLength(val)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              sprintLength === val ? "bg-white text-[#7c3aed] shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {val} min
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Break length */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Break length</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Short rest between sprints</p>
                      </div>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 select-none">
                        {[5, 10].map(val => (
                          <button
                            key={val}
                            onClick={() => setBreakLength(val)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              breakLength === val ? "bg-white text-[#7c3aed] shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {val} min
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Long break */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Long break</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Longer rest to recharge</p>
                      </div>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 select-none">
                        {[15, 20].map(val => (
                          <button
                            key={val}
                            onClick={() => setLongBreakLength(val)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              longBreakLength === val ? "bg-white text-[#7c3aed] shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {val} min
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Long break interval */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Long break interval</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Take a long break after this many sprints</p>
                      </div>
                      <div className="flex items-center bg-slate-100 px-2 py-1 rounded-xl gap-3 select-none">
                        <button
                          onClick={() => setLongBreakInterval(Math.max(2, longBreakInterval - 1))}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-slate-800">{longBreakInterval} sprints</span>
                        <button
                          onClick={() => setLongBreakInterval(Math.min(10, longBreakInterval + 1))}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* AUTOMATION SECTION */}
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">AUTOMATION</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Auto-start breaks</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Begin breaks automatically when a sprint ends</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          autoStartBreaks ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          autoStartBreaks ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Auto-start next sprint</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Jump into the next sprint after a break</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoStartNextSprint(!autoStartNextSprint)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          autoStartNextSprint ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          autoStartNextSprint ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {/* SOUND SECTION */}
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">SOUND</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Sprint complete sound</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Play a sound when a sprint finishes</p>
                      </div>
                      <button
                        onClick={() => {
                          const themes = ["Soft chime", "Bell chime", "Digital beep", "Zen bowl"];
                          const nextIdx = (themes.indexOf(soundTheme) + 1) % themes.length;
                          setSoundTheme(themes[nextIdx]);
                        }}
                        className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>🎵</span>
                        <span>{soundTheme}</span>
                        <span>➔</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Ticking during sprint</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Subtle tick to keep you in rhythm</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTickingSound(!tickingSound)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          tickingSound ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          tickingSound ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Volume</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Adjust sound level</p>
                      </div>
                      <div className="flex items-center gap-3 w-48">
                        <span className="text-slate-400 text-xs">🔊</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(Number(e.target.value))}
                          className="w-full accent-[#7c3aed] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GOALS SECTION */}
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">GOALS</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Daily sprint goal</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">How many sprints you aim to finish each day</p>
                      </div>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 select-none">
                        {[3, 5, 8].map(val => (
                          <button
                            key={val}
                            onClick={() => setDailySprintGoal(val)}
                            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              dailySprintGoal === val ? "bg-white text-[#7c3aed] shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Working hours</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">When SprintFlow should plan your day</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5">
                          <span>🕒</span>
                          <span>{workingHoursStart}</span>
                        </span>
                        <span className="text-slate-400 font-medium">to</span>
                        <span className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5">
                          <span>🕒</span>
                          <span>{workingHoursEnd}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* --- SCREEN 27: SETTINGS — NOTIFICATIONS --- */}
              {/* ========================================================================= */}
              {activeTab === "notifications" && (
                <div className="space-y-8 animate-fade-in">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="font-heading font-extrabold text-xl text-slate-900">Notifications</h2>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>

                  {/* CHANNELS */}
                  <div className="space-y-4">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">CHANNELS</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          📱
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Push notifications</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">On this device and the mobile app</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          pushEnabled ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          pushEnabled ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs font-bold">
                          ✉️
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Email</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Summaries and important account emails</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          emailNotifications ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          emailNotifications ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {/* ACTIVITY */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">ACTIVITY</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs font-bold">
                          ⚡
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Sprint reminders</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">When a scheduled sprint is about to start</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSprintReminders(!sprintReminders)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          sprintReminders ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          sprintReminders ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          🕒
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Break nudges</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Reminders to start and end your breaks</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBreakNudges(!breakNudges)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          breakNudges ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          breakNudges ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                          🏆
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Streak alerts</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">A heads-up before your streak is at risk</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStreakAlerts(!streakAlerts)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          streakAlerts ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          streakAlerts ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          📊
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Daily summary</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Your end-of-day recap and tomorrow's plan</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDailySummary(!dailySummary)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          dailySummary ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          dailySummary ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold">
                          🎖️
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Achievement unlocks</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">When you earn a new badge or level up</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAchievementUnlocks(!achievementUnlocks)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          achievementUnlocks ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          achievementUnlocks ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {/* MARKETING */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">MARKETING</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          🔔
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Product updates & tips</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Occasional news about new features</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductUpdates(!productUpdates)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          productUpdates ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          productUpdates ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {/* QUIET HOURS */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">QUIET HOURS</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs font-bold">
                          🌙
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Pause notifications at night</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Mute non-urgent alerts during these hours</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          quietHoursEnabled ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          quietHoursEnabled ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 pl-11">
                      <span className="text-xs text-slate-500 font-medium">Quiet from</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5">
                          <span>🕒</span>
                          <span>{quietHoursStart}</span>
                        </span>
                        <span className="text-slate-400 font-medium">to</span>
                        <span className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5">
                          <span>🕒</span>
                          <span>{quietHoursEnd}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* --- SCREEN 28: SETTINGS — PRIVACY & DATA --- */}
              {/* ========================================================================= */}
              {activeTab === "privacy" && (
                <div className="space-y-8 animate-fade-in">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="font-heading font-extrabold text-xl text-slate-900">Privacy & Data</h2>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>

                  {/* YOUR DATA */}
                  <div className="space-y-4">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">YOUR DATA</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          📥
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Export my data</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Download your tasks, sprints and stats as a file</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>📥</span>
                        <span>Request export</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          🗑️
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Clear sprint history</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Remove all past sprints and analytics. Keeps your account.</p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearHistory}
                        className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Clear history
                      </button>
                    </div>
                  </div>

                  {/* PRIVACY */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-slate-400 tracking-wider uppercase">PRIVACY</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs font-bold">
                          📊
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Usage analytics</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Share anonymous usage data to improve SprintFlow</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUsageAnalytics(!usageAnalytics)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          usageAnalytics ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          usageAnalytics ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-xs font-bold">
                          ⚡
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Personalized AI suggestions</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Let AI learn from your patterns to plan better</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPersonalizedAi(!personalizedAi)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          personalizedAi ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          personalizedAi ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                          🏆
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Show me on leaderboards</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Appear in public streak and focus rankings</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowOnLeaderboards(!showOnLeaderboards)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          showOnLeaderboards ? "bg-[#7c3aed]" : "bg-slate-300"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          showOnLeaderboards ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {/* DANGER ZONE */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="font-extrabold text-[10px] text-red-500 tracking-wider uppercase">DANGER ZONE</span>
                    
                    <div className="p-5 bg-red-50/50 border border-red-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-red-600 font-bold text-xs md:text-sm">
                          <span>⚠️</span>
                          <span>Delete account</span>
                        </div>
                        <p className="text-xs text-red-700/80 leading-relaxed font-medium">
                          Permanently delete your account, passes and all data. This can't be undone.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start md:self-auto shrink-0"
                      >
                        <span>🗑</span>
                        <span>Delete account</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* --- CHANGE PASSWORD MODAL (SCREEN 38) --- */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* --- DELETE ACCOUNT MODAL (SCREEN 39) --- */}
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        xp={2480}
        level={12}
        sprintsCount={64}
        badgesCount={8}
      />

      {/* --- LOGOUT CONFIRM MODAL (SCREEN 41) --- */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />

    </div>
  );
}
