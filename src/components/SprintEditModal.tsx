"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SCALE_IN_VARIANT, MODAL_BACKDROP_VARIANT } from "@/lib/motion";

export interface EditableSprint {
  id?: string;
  title: string;
  duration: number; // in minutes
  priority: "High" | "Medium" | "Low";
  subtasks: string[];
}

interface SprintEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: EditableSprint | null;
  onSave: (updatedSprint: EditableSprint) => void;
}

export default function SprintEditModal({ isOpen, onClose, sprint, onSave }: SprintEditModalProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  useEffect(() => {
    if (sprint) {
      setTitle(sprint.title || "");
      setDuration(sprint.duration || 25);
      setPriority(sprint.priority || "High");
      setSubtasks(sprint.subtasks ? [...sprint.subtasks] : []);
    }
  }, [sprint]);

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      setSubtasks([...subtasks, newSubtaskText.trim()]);
      setNewSubtaskText("");
      setIsAddingSubtask(false);
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtasks];
    updated[index] = val;
    setSubtasks(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: sprint?.id,
      title: title.trim(),
      duration: Number(duration),
      priority,
      subtasks,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && sprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={MODAL_BACKDROP_VARIANT}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            variants={SCALE_IN_VARIANT}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#7c3aed] dark:text-purple-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">Edit Sprint</h3>
                  <p className="text-[11px] text-slate-400">Configure sprint title, duration & subtasks</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Sprint Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Set up OAuth and JWT session handling"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Duration (Minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option value={15}>15 min (Quick Sprint)</option>
                    <option value={20}>20 min (Short Block)</option>
                    <option value={25}>25 min (Standard Pomodoro)</option>
                    <option value={30}>30 min (Deep Block)</option>
                    <option value={45}>45 min (Extended Focus)</option>
                    <option value={50}>50 min (Double Pomodoro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Checklist Subtasks ({subtasks.length})
                  </label>
                  <span className="text-[10px] text-slate-400">Step-by-step guidance</span>
                </div>

                <div className="space-y-2">
                  {subtasks.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 gap-3 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-slate-300 dark:text-slate-600 select-none text-xs font-mono">⠿</span>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                          className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(idx)}
                        className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                        aria-label="Remove step"
                      >
                        &times;
                      </button>
                    </motion.div>
                  ))}

                  {isAddingSubtask ? (
                    <div className="flex items-center gap-2 p-2 bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl">
                      <input
                        type="text"
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        placeholder="Enter new step description..."
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
                        className="px-3 py-1 bg-[#7c3aed] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingSubtask(false); setNewSubtaskText(""); }}
                        className="px-2 py-1 text-slate-400 text-xs font-bold hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSubtask(true)}
                      className="w-full py-2.5 border-2 border-dashed border-purple-200 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-[#7c3aed] dark:text-purple-400 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>+</span>
                      <span>Add subtask</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 h-10 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  className="px-6 h-10 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <span>✓</span>
                  <span>Save changes</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
