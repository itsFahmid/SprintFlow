"use client";

import React, { useState } from "react";

export interface UnfinishedTask {
  id: string;
  title: string;
  durationStr: string;
  priority: "High" | "Medium" | "Low";
  selected: boolean;
}

interface CarryOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (destination: "tomorrow" | "backlog" | "done", selectedTasks: string[]) => void;
}

export default function CarryOverModal({
  isOpen,
  onClose,
  onConfirm
}: CarryOverModalProps) {
  const [tasks, setTasks] = useState<UnfinishedTask[]>([
    {
      id: "un-1",
      title: "Plan next sprint & groom backlog",
      durationStr: "20 min · Sprint 5",
      priority: "Low",
      selected: true
    },
    {
      id: "un-2",
      title: "Refactor timer state machine",
      durationStr: "45 min · 2 sprints",
      priority: "Medium",
      selected: true
    }
  ]);

  const [destination, setDestination] = useState<"tomorrow" | "backlog" | "done">("tomorrow");

  if (!isOpen) return null;

  const selectedCount = tasks.filter(t => t.selected).length;
  const isAllSelected = selectedCount === tasks.length;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const toggleSelectAll = () => {
    const nextVal = !isAllSelected;
    setTasks(tasks.map(t => ({ ...t, selected: nextVal })));
  };

  const handleAction = () => {
    if (onConfirm) {
      onConfirm(destination, tasks.filter(t => t.selected).map(t => t.id));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0e26]/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-[460px] bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 animate-scale-up border border-white/20 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
            📅
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
              Wrap up your day
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {tasks.length} tasks didn't get done today
            </p>
          </div>
        </div>

        {/* Unfinished Tasks Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              UNFINISHED TASKS
            </span>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-[#7c3aed] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>✓</span>
              <span>{isAllSelected ? "Deselect all" : "Select all"}</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  task.selected 
                    ? "bg-purple-50/40 border-[#7c3aed]/40" 
                    : "bg-slate-50 border-slate-200/70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.selected}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded text-[#7c3aed] focus:ring-[#7c3aed] border-slate-300 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.durationStr}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  task.priority === "Medium"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  ● {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Destination Choice */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            WHERE SHOULD THEY GO?
          </span>

          <div className="space-y-2">
            {/* Option 1: Move to tomorrow */}
            <div
              onClick={() => setDestination("tomorrow")}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                destination === "tomorrow"
                  ? "bg-purple-50/50 border-[#7c3aed] ring-2 ring-purple-100"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-sm">
                  ☀️
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Move to tomorrow</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Add to tomorrow's focus plan</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                destination === "tomorrow" ? "bg-[#7c3aed] text-white" : "border-2 border-slate-300 text-transparent"
              }`}>
                ✓
              </div>
            </div>

            {/* Option 2: Send to backlog */}
            <div
              onClick={() => setDestination("backlog")}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                destination === "backlog"
                  ? "bg-purple-50/50 border-[#7c3aed] ring-2 ring-purple-100"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                  🗂
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Send to backlog</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reschedule them later</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                destination === "backlog" ? "bg-[#7c3aed] text-white" : "border-2 border-slate-300 text-transparent"
              }`}>
                ✓
              </div>
            </div>

            {/* Option 3: Mark as done */}
            <div
              onClick={() => setDestination("done")}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                destination === "done"
                  ? "bg-purple-50/50 border-[#7c3aed] ring-2 ring-purple-100"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Mark as done</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Close them out for today</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                destination === "done" ? "bg-[#7c3aed] text-white" : "border-2 border-slate-300 text-transparent"
              }`}>
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Green Saved Alert */}
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <span>✓</span>
          <span>Today's streak, XP and stats are already saved.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Decide later
          </button>

          <button
            onClick={handleAction}
            className="flex-1 h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <span>
              {destination === "tomorrow"
                ? `Move ${selectedCount} to tomorrow →`
                : destination === "backlog"
                ? `Send ${selectedCount} to backlog →`
                : `Mark ${selectedCount} done →`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
