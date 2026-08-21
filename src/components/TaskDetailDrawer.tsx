"use client";

import React, { useState } from "react";

export interface TaskDetailData {
  id: string;
  title: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  estimate?: string;
  dueDate?: string;
  sprintTag?: string;
  listName?: string;
  tags?: string[];
  subtasks: { id: string; name: string; completed: boolean }[];
  activity?: { text: string; time: string }[];
}

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskDetailData | null;
  onMarkComplete?: (id: string) => void;
  onEdit?: (task: TaskDetailData) => void;
}

export default function TaskDetailDrawer({
  isOpen,
  onClose,
  task,
  onMarkComplete,
  onEdit
}: TaskDetailDrawerProps) {
  const [subtasks, setSubtasks] = useState(
    task?.subtasks || [
      { id: "st-1", name: "Configure Google OAuth client", completed: true },
      { id: "st-2", name: "Add email/password fallback", completed: false },
      { id: "st-3", name: "Wire up redirect routes", completed: false }
    ]
  );
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  if (!isOpen) return null;

  const currentTask: TaskDetailData = task || {
    id: "f-1",
    title: "Implement OAuth login flow",
    description: "Add Google OAuth and email/password sign-in. Configure the OAuth client, wire up redirect routes, and add a fallback for users without a Google account.",
    priority: "High",
    estimate: "25 min · 1 sprint",
    dueDate: "Today, Jun 27",
    sprintTag: "Sprint 1",
    listName: "Backlog",
    tags: ["auth", "backend"],
    subtasks: subtasks,
    activity: [
      { text: "You created this task", time: "2 days ago" },
      { text: "Scheduled to today", time: "Yesterday" },
      { text: "Edited the description", time: "3h ago" }
    ]
  };

  const completedCount = subtasks.filter(s => s.completed).length;

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st-${Date.now()}`, name: newSubtaskText.trim(), completed: false }
    ]);
    setNewSubtaskText("");
    setIsAddingSubtask(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-[#0f0e26]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
          
          {/* Main Top / Body */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Top Bar with Close & Tags */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  TASK
                </span>
              </div>

              <button 
                onClick={() => alert("Task options menu")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ⋮
              </button>
            </div>

            {/* Task Title */}
            <div className="space-y-3">
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                {currentTask.title}
              </h2>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border bg-red-50 text-red-600 border-red-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>{currentTask.priority}</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-purple-50 text-[#7c3aed] border border-purple-100">
                  <span>📅</span>
                  <span>Scheduled · Today</span>
                </span>

                {currentTask.sprintTag && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-purple-50 text-[#7c3aed] border border-purple-100">
                    <span>⚡</span>
                    <span>{currentTask.sprintTag}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                DESCRIPTION
              </span>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                {currentTask.description}
              </p>
            </div>

            {/* Subtasks */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  SUBTASKS · {completedCount} OF {subtasks.length}
                </span>
                
                {/* Mini progress bar */}
                <div className="w-16 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7c3aed] rounded-full transition-all duration-300"
                    style={{ width: `${subtasks.length ? (completedCount / subtasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                {subtasks.map((st) => (
                  <div 
                    key={st.id} 
                    onClick={() => toggleSubtask(st.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      st.completed ? "bg-emerald-500 text-white" : "border-2 border-slate-300 text-transparent"
                    }`}>
                      ✓
                    </div>
                    <span className={`text-xs md:text-sm font-medium ${st.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {st.name}
                    </span>
                  </div>
                ))}
              </div>

              {isAddingSubtask ? (
                <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    placeholder="Enter subtask name..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#7c3aed]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(false)}
                    className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-bold flex items-center gap-1.5 transition-colors cursor-pointer pt-1"
                >
                  <span>+</span>
                  <span>Add subtask</span>
                </button>
              )}
            </div>

            {/* Details Table */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                DETAILS
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>⚑</span> Priority</span>
                  <span className="font-bold text-slate-800">{currentTask.priority}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>🕒</span> Estimate</span>
                  <span className="font-bold text-slate-800">{currentTask.estimate || "25 min · 1 sprint"}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>📅</span> Due date</span>
                  <span className="font-bold text-slate-800">{currentTask.dueDate || "Today, Jun 27"}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>⚡</span> Sprint</span>
                  <span className="font-bold text-[#7c3aed]">{currentTask.sprintTag || "Sprint 1"}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>🗂</span> List</span>
                  <span className="font-bold text-slate-800">{currentTask.listName || "Backlog"}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2"><span>🏷</span> Tags</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px]">{currentTask.tags?.join(", ") || "auth, backend"}</span>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                ACTIVITY
              </span>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> You created this task</span>
                  <span className="text-slate-400">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Scheduled to today</span>
                  <span className="text-slate-400">Yesterday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Edited the description</span>
                  <span className="text-slate-400">3h ago</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (onMarkComplete) onMarkComplete(currentTask.id);
                onClose();
              }}
              className="flex-1 h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <span>✓</span>
              <span>Mark complete</span>
            </button>
            
            <button
              onClick={() => {
                if (onEdit) onEdit(currentTask);
              }}
              className="h-11 px-4 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
