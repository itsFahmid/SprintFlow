"use client";

import React, { useState, useEffect } from "react";

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

  if (!isOpen || !sprint) return null;

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
      ...sprint,
      title: title.trim(),
      duration,
      priority,
      subtasks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6 my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center text-sm shadow-sm font-bold">
              ✏️
            </div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900">Edit sprint</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Sprint Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Sprint title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-[#7c3aed] rounded-xl text-xs md:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
              placeholder="e.g. Set up OAuth providers & routes"
              required
            />
          </div>

          {/* Duration Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Duration</label>
            <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl gap-1 select-none">
              {[15, 20, 25, 30].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    duration === mins
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority("High")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  priority === "High"
                    ? "bg-red-50/70 border-red-300 text-red-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>High</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority("Medium")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  priority === "Medium"
                    ? "bg-amber-50/70 border-amber-300 text-amber-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Medium</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority("Low")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  priority === "Low"
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Low</span>
              </button>
            </div>
          </div>

          {/* Subtasks List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Subtasks</label>
              <span className="text-[11px] text-slate-400 font-medium">{subtasks.length} steps</span>
            </div>

            <div className="space-y-2">
              {subtasks.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-100 gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-slate-300 group-hover:text-slate-400 select-none text-xs font-mono">⠿</span>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-[#7c3aed] focus:ring-[#7c3aed] w-4 h-4 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    aria-label="Remove step"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* Add Subtask Input / Trigger */}
              {isAddingSubtask ? (
                <div className="flex items-center gap-2 p-2 bg-purple-50/50 border border-purple-200 rounded-2xl">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    placeholder="Enter new step description..."
                    className="flex-1 bg-transparent px-2 text-xs font-medium focus:outline-none text-slate-800"
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
                    className="px-2 py-1 text-slate-400 text-xs font-bold hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(true)}
                  className="w-full py-2.5 border-2 border-dashed border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 text-[#7c3aed] rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>+</span>
                  <span>Add subtask</span>
                </button>
              )}

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 h-10 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <span>✓</span>
              <span>Save changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
