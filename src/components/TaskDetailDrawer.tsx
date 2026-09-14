"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DRAWER_RIGHT_VARIANT, MODAL_BACKDROP_VARIANT } from "@/lib/motion";

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
  onEdit,
}: TaskDetailDrawerProps) {
  const [subtasks, setSubtasks] = useState(
    task?.subtasks || [
      { id: "st-1", name: "Configure Google OAuth client", completed: true },
      { id: "st-2", name: "Add email/password fallback", completed: false },
      { id: "st-3", name: "Wire up redirect routes", completed: false },
    ]
  );
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const currentTask: TaskDetailData = task || {
    id: "f-1",
    title: "Implement OAuth login flow",
    description:
      "Add Google OAuth and email/password sign-in. Configure the OAuth client, wire up redirect routes, and add a fallback for users without a Google account.",
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
      { text: "Edited the description", time: "3h ago" },
    ],
  };

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, name: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText("");
    setIsAddingSubtask(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            variants={MODAL_BACKDROP_VARIANT}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              variants={DRAWER_RIGHT_VARIANT}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      currentTask.priority === "High"
                        ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                        : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {currentTask.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{currentTask.sprintTag}</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-300 flex items-center justify-center font-bold text-base transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {currentTask.title}
                  </h3>
                  {currentTask.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                      {currentTask.description}
                    </p>
                  )}
                </div>

                {/* Tags & Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Due Date</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{currentTask.dueDate || "Today"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimate</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{currentTask.estimate || "25 min"}</p>
                  </div>
                </div>

                {/* Subtasks */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    SUBTASKS ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
                  </span>
                  <div className="space-y-2">
                    {subtasks.map((st) => (
                      <motion.div
                        key={st.id}
                        layout
                        onClick={() => toggleSubtask(st.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          st.completed
                            ? "bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/80 text-slate-400 line-through"
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => {}}
                          className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{st.name}</span>
                      </motion.div>
                    ))}

                    {isAddingSubtask ? (
                      <div className="flex items-center gap-2 p-2 bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl">
                        <input
                          type="text"
                          value={newSubtaskText}
                          onChange={(e) => setNewSubtaskText(e.target.value)}
                          placeholder="Subtask name..."
                          className="flex-1 bg-transparent px-2 text-xs font-medium focus:outline-none text-slate-800 dark:text-slate-200"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubtask();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddSubtask}
                          className="px-3 py-1 bg-[#7c3aed] text-white text-xs font-bold rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingSubtask(true)}
                        className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-400 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium transition-colors"
                      >
                        + Add subtask
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex gap-2.5 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (onMarkComplete) onMarkComplete(currentTask.id);
                    onClose();
                  }}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <span>✓</span>
                  <span>Mark as complete</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
