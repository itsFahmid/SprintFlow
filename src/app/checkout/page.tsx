"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReceiptModal from "@/components/ReceiptModal";

// --- LOGOS & ICONS ---
const BkashIcon = () => (
  <div className="w-8 h-8 rounded-xl bg-[#E2136E] text-white font-extrabold flex items-center justify-center text-sm shadow-sm select-none">
    b
  </div>
);

const NagadIcon = () => (
  <div className="w-8 h-8 rounded-xl bg-[#F7941D] text-white font-extrabold flex items-center justify-center text-sm shadow-sm select-none">
    N
  </div>
);

const RocketIcon = () => (
  <div className="w-8 h-8 rounded-xl bg-[#8C3494] text-white font-extrabold flex items-center justify-center text-sm shadow-sm select-none">
    R
  </div>
);

const CardIcon = () => (
  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-sm select-none">
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
  </div>
);

const LogoSVG = () => (
  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGradCheckout)" />
    <defs>
      <linearGradient id="logoGradCheckout" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "3_months";
  
  const [selectedPlan, setSelectedPlan] = useState<"3_months" | "1_month">(planParam === "1_month" ? "1_month" : "3_months");
  const [selectedMethod, setSelectedMethod] = useState<"bKash" | "Nagad" | "Rocket" | "Card">("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    plan: string;
    amount: number;
    method: string;
    accountNumber: string;
    transactionId: string;
    endDateFormatted: string;
  } | null>(null);

  useEffect(() => {
    if (planParam === "1_month" || planParam === "3_months") {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  const amount = selectedPlan === "3_months" ? 499 : 199;
  const planName = selectedPlan === "3_months" ? "Pro · 3-Month pass" : "Pro · 1-Month pass";
  const monthlyRate = selectedPlan === "3_months" ? "166 BDT/mo · one-time" : "199 BDT/mo · one-time";

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkout",
          period: selectedPlan,
          method: selectedMethod,
          accountNumber: accountNumber || "01700-000000"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessReceipt({
          plan: planName,
          amount,
          method: `${selectedMethod} · ${accountNumber || "01XXX-XXXXXX"}`,
          accountNumber: accountNumber || "01XXX-XXXXXX",
          transactionId: data.transaction?.transactionId || "SF-8F3K-29A1",
          endDateFormatted: data.endDateFormatted || "27 Sep 2026"
        });
      } else {
        alert(data.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment processing error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SCREEN 23: PAYMENT SUCCESS STATE ---
  if (successReceipt) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
        
        {/* Confetti Particle Accents */}
        <div className="absolute top-12 left-[20%] w-2 h-4 bg-yellow-400 transform rotate-45 opacity-75 rounded-sm"></div>
        <div className="absolute top-20 right-[25%] w-3 h-3 bg-pink-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-24 left-[28%] w-2.5 h-2.5 bg-emerald-400 transform rotate-12 opacity-80"></div>
        <div className="absolute top-36 left-[35%] w-2 h-3.5 bg-blue-400 transform -rotate-12 opacity-60"></div>
        <div className="absolute bottom-32 right-[30%] w-2 h-4 bg-[#7c3aed] transform rotate-45 opacity-60"></div>

        <div className="w-full max-w-[480px] text-center space-y-6 animate-fade-in relative z-10">
          
          {/* Success Checkmark Circle */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-900 leading-tight">
              You're Pro now! 🎉
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Payment received. Your {selectedPlan === "3_months" ? "3-month" : "1-month"} Pro pass is active — unlimited focus is unlocked.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5 text-left">
            
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">{successReceipt.plan}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Active until {successReceipt.endDateFormatted}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold">
                Active
              </span>
            </div>

            {/* Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Amount paid</span>
                <span className="font-bold text-slate-900">{successReceipt.amount} BDT</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Method</span>
                <span className="font-medium text-slate-800">{successReceipt.method}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">{successReceipt.transactionId}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:flex-1 h-12 btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <span>➔</span>
              <span>Start focusing</span>
            </button>
            <button
              onClick={() => setShowReceiptModal(true)}
              className="w-full sm:flex-1 h-12 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download receipt</span>
            </button>
          </div>

          <ReceiptModal
            isOpen={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
            receipt={successReceipt ? {
              transactionId: successReceipt.transactionId,
              planName: successReceipt.plan,
              amount: successReceipt.amount,
              currency: "BDT",
              method: successReceipt.method,
              date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
              customerName: "Fahim Siddique",
              customerEmail: "fahim@sprintflow.io",
              endDateFormatted: successReceipt.endDateFormatted
            } : null}
          />

        </div>
      </div>
    );
  }

  // --- SCREEN 22: CHECKOUT FORM STATE ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Top Header Bar */}
      <header className="h-20 bg-white border-b border-slate-200/60 px-6 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoSVG />
            <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">Checkout</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/50">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Secure payment</span>
        </div>
      </header>

      {/* Main Checkout Body */}
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-6 md:p-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Payment Method (8 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">Payment method</h2>

            <div className="space-y-3">
              
              {/* bKash */}
              <label 
                onClick={() => setSelectedMethod("bKash")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMethod === "bKash"
                    ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                    : "border-slate-200/80 hover:border-purple-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <BkashIcon />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">bKash</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Mobile wallet</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "bKash" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                }`}>
                  {selectedMethod === "bKash" && <span className="text-[10px]">✓</span>}
                </div>
              </label>

              {/* Nagad */}
              <label 
                onClick={() => setSelectedMethod("Nagad")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMethod === "Nagad"
                    ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                    : "border-slate-200/80 hover:border-purple-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <NagadIcon />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">Nagad</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Mobile wallet</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "Nagad" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                }`}>
                  {selectedMethod === "Nagad" && <span className="text-[10px]">✓</span>}
                </div>
              </label>

              {/* Rocket */}
              <label 
                onClick={() => setSelectedMethod("Rocket")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMethod === "Rocket"
                    ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                    : "border-slate-200/80 hover:border-purple-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <RocketIcon />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">Rocket</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Mobile wallet</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "Rocket" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                }`}>
                  {selectedMethod === "Rocket" && <span className="text-[10px]">✓</span>}
                </div>
              </label>

              {/* Card */}
              <label 
                onClick={() => setSelectedMethod("Card")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedMethod === "Card"
                    ? "border-[#7c3aed] bg-purple-50/40 shadow-sm"
                    : "border-slate-200/80 hover:border-purple-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <CardIcon />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">Card</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Visa · Mastercard</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "Card" ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300"
                }`}>
                  {selectedMethod === "Card" && <span className="text-[10px]">✓</span>}
                </div>
              </label>

            </div>

            {/* Account Input Field */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                {selectedMethod} account number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  📱
                </span>
                <input
                  type="text"
                  placeholder="01XXX-XXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                />
              </div>
            </div>

            {/* Security Confirmation Notice */}
            <div className="bg-emerald-50/70 border border-emerald-200/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-800 font-medium">
              <span className="text-base leading-none">🛡</span>
              <p className="leading-relaxed">
                You'll confirm the payment in your {selectedMethod} app. We never store your PIN or number.
              </p>
            </div>

          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">Order summary</h2>

            {/* Plan Details Card */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center shadow-sm shrink-0">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">{planName}</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{monthlyRate}</p>
              </div>
            </div>

            {/* Calculation Lines */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{amount} BDT</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Trial discount</span>
                <span className="font-bold text-slate-900">−0 BDT</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>VAT (incl.)</span>
                <span className="font-bold text-slate-900">0 BDT</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-base text-slate-900">Total</span>
                <div className="text-right">
                  <span className="font-heading font-extrabold text-2xl text-[#7c3aed]">{amount}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">BDT</span>
                </div>
              </div>
            </div>

            {/* Payment Submit Button */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-12 btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>{isProcessing ? "Processing..." : `Pay ${amount} BDT`}</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center font-medium">
                ✓ One-time payment · no auto-renewal
              </p>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
