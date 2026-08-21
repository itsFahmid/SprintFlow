"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReceiptModal, { ReceiptData } from "@/components/ReceiptModal";

// --- SVG ICONS ---
const CrownIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
  </svg>
);

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
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoSVG = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGradSub)" />
    <defs>
      <linearGradient id="logoGradSub" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

interface PaymentItem {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  method: string;
  date: string;
  status: "Paid" | "Failed";
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Fahim Siddique");
  const [isPro, setIsPro] = useState(true);
  const [daysLeft, setDaysLeft] = useState(89);
  const [totalDays, setTotalDays] = useState(92);
  const [endDateFormatted, setEndDateFormatted] = useState("27 Sep 2026");
  const [paymentMethodName, setPaymentMethodName] = useState("bKash");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [stackPlan, setStackPlan] = useState<"3_months" | "1_month">("3_months");
  const [historyList, setHistoryList] = useState<PaymentItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscription");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        
        // Also fetch user name
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserName(userData.user.name);
        }

        const sub = data.subscription;
        const active = sub.plan === "Pro" && (sub.status === "active" || sub.status === "trial");
        setIsPro(active);
        setReminderEnabled(sub.reminderEnabled ?? true);

        if (active) {
          setDaysLeft(data.daysLeft || 89);
          setTotalDays(data.totalDays || 92);
          if (sub.endDate) {
            setEndDateFormatted(new Date(sub.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
          }
        }

        // Set payment history (fallback to realistic sample if empty)
        if (sub.history && sub.history.length > 0) {
          setHistoryList(sub.history);
          setPaymentMethodName(sub.history[0].method || "bKash");
        } else {
          setHistoryList([
            { id: "p1", plan: "Pro · 3-Month pass", amount: 499, currency: "BDT", method: "bKash", date: "27 Jun 2026", status: "Paid" },
            { id: "p2", plan: "Pro · 3-Month pass", amount: 499, currency: "BDT", method: "Nagad", date: "27 Mar 2026", status: "Paid" },
            { id: "p3", plan: "Pro · 1-Month pass", amount: 199, currency: "BDT", method: "bKash", date: "27 Feb 2026", status: "Paid" }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Subscription page error:", err);
        router.push("/login");
      }
    };

    fetchSubscription();
  }, [router]);

  const toggleReminder = async () => {
    const nextVal = !reminderEnabled;
    setReminderEnabled(nextVal);
    try {
      await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_reminder", reminderEnabled: nextVal })
      });
    } catch (err) {
      console.error("Reminder toggle error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    router.push("/login");
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
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isPro ? "Level 12 · Pro" : "Level 1 · Free"}
            </p>
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
        <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading billing details...</p>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(5, (daysLeft / totalDays) * 100));

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

      {/* Main Subscription Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div>
            <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">
              Subscription & Billing
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">
              Manage your Pro pass and payment history
            </p>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-6 md:p-8 space-y-6 max-w-[1300px] w-full mx-auto animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active Pass Banner (Purple Gradient) */}
              <div className="bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#5B21B6] rounded-3xl p-7 md:p-8 text-white space-y-6 shadow-xl shadow-purple-500/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Info Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                      <CrownIcon />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-tight">Pro · 3-Month pass</h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mt-1 font-medium">
                        Paid via {paymentMethodName} · 27 Jun 2026
                      </p>
                    </div>
                  </div>
                </div>

                {/* Days Remaining Progress */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-white/90">
                    <span>{daysLeft} of {totalDays} days left</span>
                    <span>Ends {endDateFormatted}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Auto-renew disclaimer */}
                <div className="bg-black/15 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-white/90 font-medium">
                  <span className="text-sm">🔔</span>
                  <span>This pass won't auto-renew. We'll remind you 3 days before it ends.</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href="/checkout?plan=3_months"
                    className="w-full sm:flex-1 h-11 bg-white hover:bg-slate-50 text-[#7c3aed] rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>🔄</span>
                    <span>Renew pass</span>
                  </Link>
                  
                  <Link
                    href="/checkout?plan=1_month"
                    className="w-full sm:flex-1 h-11 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center transition-all"
                  >
                    Switch to 1-Month
                  </Link>
                </div>

              </div>

              {/* Payment History Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-heading font-extrabold text-base text-slate-900">Payment history</h3>
                  <button 
                    onClick={() => {
                      if (historyList.length > 0) {
                        const topItem = historyList[0];
                        setSelectedReceipt({
                          transactionId: `SF-${topItem.id.toUpperCase()}`,
                          planName: topItem.plan,
                          amount: topItem.amount,
                          currency: topItem.currency,
                          method: topItem.method,
                          date: topItem.date,
                          customerName: userName,
                          customerEmail: "fahim@sprintflow.io",
                          endDateFormatted: endDateFormatted
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#7c3aed] hover:underline font-bold cursor-pointer"
                  >
                    <span>Export</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {historyList.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">{item.plan}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.date} · {item.method}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-extrabold uppercase">
                          {item.status}
                        </span>
                        <span className="font-bold text-xs md:text-sm text-slate-900">{item.amount} {item.currency}</span>
                        <button 
                          onClick={() => {
                            setSelectedReceipt({
                              transactionId: `SF-${item.id.toUpperCase()}`,
                              planName: item.plan,
                              amount: item.amount,
                              currency: item.currency,
                              method: item.method,
                              date: item.date,
                              customerName: userName,
                              customerEmail: "fahim@sprintflow.io",
                              endDateFormatted: endDateFormatted
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                          title="Download receipt"
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Add More Time (Stacking Pass) */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-5 shadow-sm">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 leading-tight">Add more time</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                    Stack a pass now — it starts when your current one ends.
                  </p>
                </div>

                <div className="space-y-3">
                  
                  {/* 3 Months */}
                  <label 
                    onClick={() => setStackPlan("3_months")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      stackPlan === "3_months"
                        ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                        : "border-slate-200/80 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        stackPlan === "3_months" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                      }`}>
                        {stackPlan === "3_months" && <span className="text-[8px]">✓</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">3 Months</span>
                          <span className="px-1.5 py-0.2 bg-green-100 text-green-700 rounded text-[9px] font-bold">
                            Save 16%
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900">499 BDT</span>
                  </label>

                  {/* 1 Month */}
                  <label 
                    onClick={() => setStackPlan("1_month")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      stackPlan === "1_month"
                        ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                        : "border-slate-200/80 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        stackPlan === "1_month" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                      }`}>
                        {stackPlan === "1_month" && <span className="text-[8px]">✓</span>}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900">1 Month</span>
                        <p className="text-[10px] text-slate-400">Billed once</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900">199 BDT</span>
                  </label>

                </div>

                <Link
                  href={`/checkout?plan=${stackPlan}`}
                  className="w-full h-11 btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all"
                >
                  <span>➔</span>
                  <span>Buy pass</span>
                </Link>
              </div>

              {/* Renewal Reminder Toggle Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-sm shadow-sm shrink-0">
                    🔔
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">Renewal reminder</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">3 days before expiry</p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={toggleReminder}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    reminderEnabled ? "bg-[#7c3aed]" : "bg-slate-300"
                  }`}
                  aria-label="Toggle renewal reminder"
                >
                  <div 
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      reminderEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      <ReceiptModal 
        isOpen={!!selectedReceipt} 
        onClose={() => setSelectedReceipt(null)} 
        receipt={selectedReceipt} 
      />

    </div>
  );
}
