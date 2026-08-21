"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  type: "level" | "streak" | "sprint" | "badge" | "recap";
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n-1",
    type: "level",
    title: "You reached Level 13!",
    description: "Unlimited focus and deeper insights are unlocked.",
    time: "2m ago",
    unread: true
  },
  {
    id: "n-2",
    type: "streak",
    title: "7-day streak — keep it alive",
    description: "Finish one sprint today to extend your streak.",
    time: "1h ago",
    unread: true
  },
  {
    id: "n-3",
    type: "sprint",
    title: "Sprint 2 starts in 5 minutes",
    description: "Debug dashboard slow-load · 25 min",
    time: "9:20 AM",
    unread: true
  },
  {
    id: "n-4",
    type: "badge",
    title: "Badge unlocked: Power Hour",
    description: "You completed 10 sprints in a single day.",
    time: "Yesterday",
    unread: false
  },
  {
    id: "n-5",
    type: "recap",
    title: "Your daily recap is ready",
    description: "5 of 5 sprints · 2h 05m focus · +320 XP",
    time: "Yesterday",
    unread: false
  }
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "mentions">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "mentions") return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "level":
        return <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] flex items-center justify-center text-sm font-bold">🏆</div>;
      case "streak":
        return <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-bold">🔥</div>;
      case "sprint":
        return <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4f46e5] flex items-center justify-center text-sm font-bold">⚡</div>;
      case "badge":
        return <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">🏅</div>;
      case "recap":
        return <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">📊</div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">🔔</div>;
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
          isOpen ? "bg-purple-100 text-[#7c3aed]" : "bg-slate-100/80 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Open notifications"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E2136E] ring-2 ring-white"></span>
        )}
      </button>

      {/* Popover Dropdown (Screen 33) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[360px] md:w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-scale-up text-left">
          
          {/* Header */}
          <div className="p-5 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#7c3aed] text-white rounded-full text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>

              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#7c3aed] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>✓</span>
                <span>Mark all read</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-6 mt-4 text-xs font-bold border-b border-slate-100 pb-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-2 transition-colors cursor-pointer relative ${
                  activeTab === "all" ? "text-[#7c3aed]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                All
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("unread")}
                className={`pb-2 transition-colors cursor-pointer relative ${
                  activeTab === "unread" ? "text-[#7c3aed]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Unread
                {activeTab === "unread" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab("mentions")}
                className={`pb-2 transition-colors cursor-pointer relative ${
                  activeTab === "mentions" ? "text-[#7c3aed]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                Mentions
                {activeTab === "mentions" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                No notifications to display
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleRead(item.id)}
                  className={`p-4 flex items-start gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer relative ${
                    item.unread ? "bg-purple-50/20" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="shrink-0 pt-0.5">
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <span className="block text-[10px] text-slate-400 font-medium pt-0.5">
                      {item.time}
                    </span>
                  </div>

                  {/* Unread purple dot */}
                  {item.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#7c3aed] shrink-0 mt-1.5"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#7c3aed] hover:underline font-bold"
            >
              View all notifications
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
