"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AccountDeletedPage() {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 flex flex-col items-center justify-center p-6 text-center font-sans">
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 animate-scale-up">
        
        {/* Heart Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7c3aed] flex items-center justify-center text-3xl mx-auto shadow-inner">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-[#7c3aed]">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2.5">
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-900 leading-tight">
            Your account has been deleted
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
            We're sorry to see you go, Fahim. Your data has been permanently removed. Thank you for the focused work — you're always welcome back.
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer"
          >
            <span>Back to home</span>
            <span>→</span>
          </Link>

          <div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors cursor-pointer"
            >
              Tell us why you left
            </button>
          </div>
        </div>

      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[400px] w-full shadow-2xl space-y-4 text-left animate-scale-up">
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Share your feedback</h3>
            <p className="text-xs text-slate-500">Help us improve SprintFlow for future users.</p>
            
            {feedbackSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold text-center">
                ✓ Thank you for your feedback!
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-4">
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What could we have done better?"
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7c3aed]"
                  autoFocus
                ></textarea>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold hover:bg-[#6d28d9]"
                  >
                    Send feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
