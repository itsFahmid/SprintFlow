"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SprintEditModal, { EditableSprint } from "@/components/SprintEditModal";
import NotificationCenter from "@/components/NotificationCenter";
import TaskDetailDrawer, { TaskDetailData } from "@/components/TaskDetailDrawer";

// --- SVG NAVIGATION & ACTION ICONS ---
const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const TasksIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-600 transition-colors">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const LogoSVG = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
    <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
    <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
    <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGrad)" />
    <defs>
      <linearGradient id="logoGrad" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa"/>
        <stop offset="0.5" stopColor="#7c3aed"/>
        <stop offset="1" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 hover:text-slate-700 transition-colors">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

interface BreakdownSprint {
  id: string;
  title: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  approved: boolean;
  subtasks: string[];
}

interface ParsedTask {
  name: string;
  priority: "High" | "Medium" | "Low";
}

export default function TasksPage() {
  const router = useRouter();

  // --- STATE ---
  const [viewState, setViewState] = useState<"workspace" | "input" | "loading" | "error" | "breakdown">("workspace");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [taskText, setTaskText] = useState(
    `- Implement OAuth login flow with Google + email\n- Fix dashboard loading bug on slow connections\n- Write Q3 product update email to customers\n- Review Sara's PR #218 and leave comments\n- Design onboarding empty states + illustrations\n- Plan next sprint and groom the backlog`
  );

  // Screen 43 Workspace States
  const [workspaceFilter, setWorkspaceFilter] = useState<"all" | "todo" | "scheduled" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInFocusOpen, setIsInFocusOpen] = useState(true);
  const [isBacklogOpen, setIsBacklogOpen] = useState(true);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskDetailData | null>(null);

  const [inFocusTasks, setInFocusTasks] = useState([
    { id: "f-1", title: "Implement OAuth login flow", duration: 25, sprints: 1, due: "Due today", priority: "High", sprintTag: "Sprint 1", completed: false },
    { id: "f-2", title: "Debug dashboard slow-load", duration: 30, sprints: 1, due: "Due today", priority: "High", sprintTag: "Sprint 2", completed: false },
    { id: "f-3", title: "Write Q3 product update email", duration: 20, sprints: 1, priority: "Medium", sprintTag: "Sprint 3", completed: false }
  ]);

  const [backlogTasks, setBacklogTasks] = useState([
    { id: "b-1", title: "Review Sara's PR #218", duration: 15, sprints: 1, priority: "Medium", completed: false },
    { id: "b-2", title: "Design onboarding empty states", duration: 30, sprints: 1, priority: "Low", completed: false },
    { id: "b-3", title: "Plan next sprint & groom backlog", duration: 20, sprints: 1, priority: "Low", completed: false },
    { id: "b-4", title: "Refactor timer state machine", duration: 45, sprints: 2, priority: "Medium", completed: false },
    { id: "b-5", title: "Write release notes for v2.1", duration: 15, sprints: 1, priority: "Low", completed: false }
  ]);

  // AI API Configuration Key States
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  // Loading & Error States (Screen 29 & 30)
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [loadingProgress, setLoadingProgress] = useState<number>(25);
  const [parsedLoadingTasks, setParsedLoadingTasks] = useState<ParsedTask[]>([]);
  const [aiError, setAiError] = useState<{ code: string; message: string; details?: string }>({
    code: "Error AI-503 · model timed out",
    message: "We couldn't build your plan"
  });

  // Dynamic analysis lists
  const [aiTasks, setAiTasks] = useState<ParsedTask[]>([]);
  const [sprints, setSprints] = useState<BreakdownSprint[]>([]);
  const [editingSprint, setEditingSprint] = useState<EditableSprint | null>(null);

  const [userName, setUserName] = useState("Fahim Siddique");
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    const initPage = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserName(data.user.name);
        
        // Load API key from settings if present
        if (data.user.settings?.geminiApiKey) {
          setApiKey(data.user.settings.geminiApiKey);
          setTempApiKey(data.user.settings.geminiApiKey);
        }

        // Fetch sprints and tasks from API
        const sprintsRes = await fetch("/api/sprints");
        const tasksRes = await fetch("/api/tasks");
        
        if (sprintsRes.ok && tasksRes.ok) {
          const sprintsData = await sprintsRes.json();
          const tasksData = await tasksRes.json();
          
          if (sprintsData && sprintsData.sprints && sprintsData.sprints.length > 0) {
            // Sprints in DB have object subtasks, map name for frontend string[] compatibility
            const mappedSprints = sprintsData.sprints.map((s: any) => ({
              ...s,
              subtasks: s.subtasks.map((st: any) => typeof st === "string" ? st : (st.name || ""))
            }));
            setSprints(mappedSprints);
            
            const mappedTasks = tasksData ? (tasksData.tasks || []) : [];
            setAiTasks(mappedTasks);
            
            setViewState("breakdown");
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Tasks init error:", err);
        router.push("/login");
      }
    };
    initPage();
  }, []);

  const addExampleTask = (example: string) => {
    setTaskText(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `- ${example}`;
      return `${trimmed}\n- ${example}`;
    });
  };

  const detectedTasksCount = taskText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0).length;

  const saveTasksAndSprints = async (updatedTasks: any[], updatedSprints: any[]) => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });
      await fetch("/api/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprints: updatedSprints })
      });
    } catch (err) {
      console.error("Save tasks/sprints error:", err);
    }
  };

  const handleSaveEditedSprint = async (updated: EditableSprint) => {
    const updatedList = sprints.map(s => s.id === updated.id ? { 
      ...s, 
      title: updated.title,
      duration: updated.duration,
      priority: updated.priority,
      subtasks: updated.subtasks
    } : s);
    setSprints(updatedList);
    await saveTasksAndSprints(aiTasks, updatedList);
  };

  // AI Analysis Execution
  const handleAnalyze = async (bypassKeyCheck = false) => {
    if (detectedTasksCount === 0) return;

    // Check for API Key if not bypassed
    if (!apiKey && !bypassKeyCheck) {
      setShowApiKeyModal(true);
      return;
    }

    // Parse tasks for immediate preview in loading and error screens
    const parsed = taskText
      .split("\n")
      .map(line => line.trim().replace(/^[-*•\d.]+\s*/, ""))
      .filter(line => line.length > 0)
      .map((name, idx) => ({
        name,
        priority: (idx < 2 ? "High" : idx < 4 ? "Medium" : "Low") as "High" | "Medium" | "Low"
      }));

    const tasksToDisplay = parsed.length > 0 ? parsed : [
      { name: "Implement OAuth login flow", priority: "High" as const },
      { name: "Fix dashboard loading bug", priority: "High" as const },
      { name: "Write Q3 product update email", priority: "Medium" as const },
      { name: "Review Sara's PR #218", priority: "Medium" as const },
      { name: "Design onboarding empty states", priority: "Low" as const },
      { name: "Plan next sprint & groom backlog", priority: "Low" as const }
    ];

    setParsedLoadingTasks(tasksToDisplay);
    setLoadingStep(1);
    setLoadingProgress(25);
    setViewState("loading");

    // Animate loading steps
    const step2Timer = setTimeout(() => {
      setLoadingStep(2);
      setLoadingProgress(55);
    }, 600);

    const step3Timer = setTimeout(() => {
      setLoadingStep(3);
      setLoadingProgress(80);
    }, 1200);

    const step4Timer = setTimeout(() => {
      setLoadingStep(4);
      setLoadingProgress(92);
    }, 1800);

    try {
      // Test trigger error if task contains trigger_error
      if (taskText.toLowerCase().includes("trigger_error_test")) {
        throw new Error("model timed out");
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["x-gemini-api-key"] = apiKey;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ taskList: taskText })
      });

      if (res.status === 401) {
        if (bypassKeyCheck) {
          triggerFallbackSimulation(tasksToDisplay);
          return;
        }
        clearTimeout(step2Timer);
        clearTimeout(step3Timer);
        clearTimeout(step4Timer);
        setViewState("input");
        setShowApiKeyModal(true);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `API error code ${res.status}`);
      }

      const data = await res.json();
      const tasksPayload = data.tasks || [];
      const sprintsPayload = (data.sprints || []).map((s: any) => ({
        ...s,
        approved: false
      }));

      setTimeout(async () => {
        setLoadingProgress(100);
        setAiTasks(tasksPayload);
        setSprints(sprintsPayload);
        setViewState("breakdown");
        await saveTasksAndSprints(tasksPayload, sprintsPayload);
      }, 500);

    } catch (error: any) {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);
      console.warn("AI breakdown error:", error);
      setAiError({
        code: "Error AI-503 · model timed out",
        message: "We couldn't build your plan",
        details: error.message || "Something went wrong while analyzing your tasks."
      });
      setViewState("error");
    }
  };

  // Offline simulation fallback logic
  const triggerFallbackSimulation = (tasksToUse = parsedLoadingTasks) => {
    setLoadingStep(1);
    setLoadingProgress(25);
    setViewState("loading");

    setTimeout(() => {
      setLoadingStep(2);
      setLoadingProgress(55);
    }, 600);

    setTimeout(() => {
      setLoadingStep(3);
      setLoadingProgress(80);
    }, 1200);

    setTimeout(() => {
      setLoadingStep(4);
      setLoadingProgress(95);
    }, 1800);

    setTimeout(async () => {
      const mockTasks: ParsedTask[] = tasksToUse.length > 0 ? tasksToUse : [
        { name: "Implement OAuth login flow", priority: "High" },
        { name: "Fix dashboard loading bug", priority: "High" },
        { name: "Write Q3 product update email", priority: "Medium" },
        { name: "Review Sara's PR #218", priority: "Medium" },
        { name: "Design onboarding empty states", priority: "Low" },
        { name: "Plan next sprint & groom backlog", priority: "Low" }
      ];
      const mockSprints: BreakdownSprint[] = [
        {
          id: "01",
          title: "Set up OAuth providers & routes",
          duration: 25,
          priority: "High",
          approved: true,
          subtasks: ["Configure Google OAuth client", "Add email/password fallback", "Wire up redirect routes"]
        },
        {
          id: "02",
          title: "Debug dashboard slow-load",
          duration: 30,
          priority: "High",
          approved: false,
          subtasks: ["Profile network waterfall", "Add skeleton loaders", "Cache initial query"]
        },
        {
          id: "03",
          title: "Draft Q3 product update email",
          duration: 20,
          priority: "Medium",
          approved: false,
          subtasks: ["Outline 3 key updates", "Write first draft", "Add CTA + screenshots"]
        }
      ];

      setLoadingProgress(100);
      setAiTasks(mockTasks);
      setSprints(mockSprints);
      setViewState("breakdown");

      await saveTasksAndSprints(mockTasks, mockSprints);
    }, 2200);
  };

  const handleSaveApiKey = async () => {
    localStorage.setItem("sprintflow_gemini_api_key", tempApiKey);
    setApiKey(tempApiKey);
    setShowApiKeyModal(false);

    try {
      await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: { geminiApiKey: tempApiKey } })
      });
    } catch (err) {
      console.error("Save api key error:", err);
    }
    
    // Automatically trigger analysis with newly entered key
    setTimeout(() => {
      setViewState("loading");
      // Call endpoint directly using tempApiKey to prevent async state lag
      fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": tempApiKey
        },
        body: JSON.stringify({ taskList: taskText })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `API Call failed: ${res.status}`);
          }
          const data = await res.json();
          const tasksPayload = data.tasks || [];
          const sprintsPayload = (data.sprints || []).map((s: any) => ({ ...s, approved: false }));
          setAiTasks(tasksPayload);
          setSprints(sprintsPayload);
          setViewState("breakdown");
          await saveTasksAndSprints(tasksPayload, sprintsPayload);
        })
        .catch((error: any) => {
          alert(`AI Analysis failed: ${error.message || "Unknown error"}. Falling back to simulated offline planner.`);
          triggerFallbackSimulation();
        });
    }, 100);
  };

  const handleToggleApprove = async (id: string) => {
    const updatedSprints = sprints.map(s => s.id === id ? { ...s, approved: !s.approved } : s);
    setSprints(updatedSprints);

    try {
      await fetch("/api/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprints: updatedSprints })
      });
    } catch (err) {
      console.error("Save sprints error:", err);
    }
  };

  const handleGeneratePlan = () => {
    router.push("/dashboard");
  };

  // Sidebar Layout parts (shared)
  const navigationLinks = (
    <ul className="space-y-1.5 list-none p-0">
      <li>
        <Link href="/dashboard" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 font-medium text-sm transition-all duration-150">
          <DashboardIcon />
          Dashboard
        </Link>
      </li>
      <li>
        <Link href="/tasks" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-50 text-[#7c3aed] font-semibold text-sm transition-all duration-150">
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    router.push("/login");
  };

  const footerBlock = (
    <div className="space-y-6">
      {/* Go Pro Card */}
      <div className="bg-gradient-to-br from-[#7c3aed] to-[#6366f1] rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <h4 className="font-heading font-extrabold text-sm mb-1 uppercase tracking-wider text-white/90">Go Pro</h4>
        <p className="text-[11px] leading-normal text-white/80 mb-4">
          Unlock AI deep-planning & insights.
        </p>
        <Link href="/pricing" className="block w-full bg-white text-[#7c3aed] hover:bg-slate-50 font-semibold py-2 px-4 rounded-xl text-center text-xs shadow-sm transition-colors">
          Upgrade
        </Link>
      </div>

      {/* Profile Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0e7ff] text-[#4f46e5] font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase select-none">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-900 leading-tight">{userName}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">Level 1 · Free</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/settings" className="p-1 rounded-lg hover:bg-slate-100 transition-colors" title="Settings">
            <SettingsIcon />
          </Link>
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
        <div className="relative w-16 h-16 flex items-center justify-center select-none">
          <div className="absolute inset-0 bg-[#7c3aed]/5 backdrop-blur-md rounded-full border border-[#7c3aed]/10 animate-pulse"></div>
          <div className="w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"></div>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 animate-pulse">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans relative">
      
      {/* --- DESKTOP SIDEBAR --- */}
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

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <aside 
          className={`w-[260px] max-w-[80vw] bg-white h-full p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <LogoSVG />
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">SprintFlow</span>
              </Link>
              <button 
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <nav onClick={() => setIsMobileMenuOpen(false)}>{navigationLinks}</nav>
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>{footerBlock}</div>
        </aside>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Row */}
        <header className="h-20 bg-white border-b border-slate-200/50 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            
            {viewState === "workspace" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">Tasks</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Plan, prioritize and track everything on your plate</p>
              </div>
            )}
            {viewState === "input" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">New Tasks</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Paste your to-do list — AI turns it into focused sprints</p>
              </div>
            )}
            {viewState === "loading" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">AI Sprint Breakdown</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Analyzing your tasks...</p>
              </div>
            )}
            {viewState === "error" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">AI Sprint Breakdown</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">Something needs your attention</p>
              </div>
            )}
            {viewState === "breakdown" && (
              <div>
                <h1 className="font-heading font-extrabold text-lg md:text-xl text-slate-900 leading-tight">AI Sprint Breakdown</h1>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">{aiTasks.length} tasks • {sprints.length} sprints • ~{sprints.reduce((acc, s) => acc + s.duration, 0)}m total focus</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {viewState === "workspace" && (
              <button
                onClick={() => setViewState("input")}
                className="h-10 px-4 md:px-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <span className="text-base font-bold leading-none">+</span>
                <span>Add tasks</span>
              </button>
            )}

            {viewState === "input" && (
              <button
                onClick={() => setViewState("workspace")}
                className="h-10 px-4 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>←</span>
                <span>Back to tasks</span>
              </button>
            )}

            <NotificationCenter />
            
            {viewState === "breakdown" && (
              <>
                <button 
                  className="h-10 px-4 border border-slate-200 rounded-xl text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => { setViewState("input"); }}
                >
                  Regenerate all
                </button>
                <button 
                  className="btn btn-primary h-10 px-4 md:px-5 text-xs md:text-sm font-bold gap-2"
                  onClick={handleGeneratePlan}
                >
                  Generate Daily Plan
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-start">
          
          {/* ========================================================================= */}
          {/* --- STATE 0: SCREEN 43 · TASKS WORKSPACE --- */}
          {/* ========================================================================= */}
          {viewState === "workspace" && (
            <div className="space-y-6 w-full animate-fade-in">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Filter Pills & Actions */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
                  <div className="flex items-center bg-white border border-slate-200/80 p-1 rounded-2xl shadow-sm text-xs font-bold shrink-0">
                    {(["all", "todo", "scheduled", "done"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setWorkspaceFilter(tab)}
                        className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                          workspaceFilter === tab
                            ? "bg-[#7c3aed] text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab === "todo" ? "To do" : tab}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => alert("Sorting by priority and due date.")}
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <span>⇅</span>
                    <span>Sort</span>
                  </button>

                  <button 
                    onClick={() => alert("Filter options opened.")}
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    <span>⚙</span>
                    <span>Filter</span>
                  </button>
                </div>

              </div>

              {/* Section 1: In Focus Today */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsInFocusOpen(!isInFocusOpen)}
                >
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900">In focus today</h3>
                    <span className="w-6 h-6 rounded-full bg-purple-50 text-[#7c3aed] font-extrabold text-xs flex items-center justify-center">
                      {inFocusTasks.length}
                    </span>
                  </div>
                  <span className={`text-slate-400 text-sm transition-transform duration-200 ${isInFocusOpen ? "rotate-0" : "-rotate-90"}`}>
                    ⌄
                  </span>
                </div>

                {isInFocusOpen && (
                  <div className="divide-y divide-slate-100 space-y-1">
                    {inFocusTasks
                      .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((task) => (
                        <div 
                          key={task.id} 
                          className="pt-3 pb-3 flex items-center justify-between gap-4 group hover:bg-slate-50/50 -mx-3 px-3 rounded-2xl transition-colors"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span className="text-slate-300 group-hover:text-slate-400 select-none cursor-grab text-xs font-mono">⠿</span>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {
                                setInFocusTasks(inFocusTasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                              }}
                              className="rounded border-slate-300 text-[#7c3aed] focus:ring-[#7c3aed] w-4 h-4 cursor-pointer"
                            />
                            <div 
                              className="min-w-0 flex-1 cursor-pointer"
                              onClick={() => setSelectedTaskDetail({
                                id: task.id,
                                title: task.title,
                                description: "Add Google OAuth and email/password sign-in. Configure the OAuth client, wire up redirect routes, and add a fallback for users without a Google account.",
                                priority: task.priority as any,
                                estimate: `${task.duration} min · ${task.sprints} sprint`,
                                dueDate: task.due || "Today, Jun 27",
                                sprintTag: task.sprintTag,
                                listName: "In Focus Today",
                                tags: ["auth", "backend"],
                                subtasks: [
                                  { id: "st-1", name: "Configure Google OAuth client", completed: true },
                                  { id: "st-2", name: "Add email/password fallback", completed: false },
                                  { id: "st-3", name: "Wire up redirect routes", completed: false }
                                ],
                                activity: [
                                  { text: "You created this task", time: "2 days ago" },
                                  { text: "Scheduled to today", time: "Yesterday" },
                                  { text: "Edited the description", time: "3h ago" }
                                ]
                              })}
                            >
                              <h4 className={`font-semibold text-xs md:text-sm text-slate-800 leading-snug truncate hover:text-[#7c3aed] transition-colors ${task.completed ? "line-through text-slate-400" : ""}`}>
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                                <span>{task.duration} min · {task.sprints} sprint</span>
                                {task.due && (
                                  <>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-purple-600 font-semibold">{task.due}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                              task.priority === "High" ? "bg-red-50 text-red-600 border-red-200/80" : "bg-amber-50 text-amber-600 border-amber-200/80"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${task.priority === "High" ? "bg-red-500" : "bg-amber-500"}`}></span>
                              <span>{task.priority}</span>
                            </span>

                            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7c3aed] border border-purple-100 text-[10px] font-bold flex items-center gap-1">
                              <span>⚡</span>
                              <span>{task.sprintTag}</span>
                            </span>

                            <button 
                              onClick={() => alert(`Task options: ${task.title}`)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              ⋮
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Section 2: Backlog */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsBacklogOpen(!isBacklogOpen)}
                >
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900">Backlog</h3>
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-extrabold text-xs flex items-center justify-center">
                      {backlogTasks.length}
                    </span>
                  </div>
                  <span className={`text-slate-400 text-sm transition-transform duration-200 ${isBacklogOpen ? "rotate-0" : "-rotate-90"}`}>
                    ⌄
                  </span>
                </div>

                {isBacklogOpen && (
                  <div className="divide-y divide-slate-100 space-y-1">
                    {backlogTasks
                      .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((task) => (
                        <div 
                          key={task.id} 
                          className="pt-3 pb-3 flex items-center justify-between gap-4 group hover:bg-slate-50/50 -mx-3 px-3 rounded-2xl transition-colors"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span className="text-slate-300 group-hover:text-slate-400 select-none cursor-grab text-xs font-mono">⠿</span>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {
                                setBacklogTasks(backlogTasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                              }}
                              className="rounded border-slate-300 text-[#7c3aed] focus:ring-[#7c3aed] w-4 h-4 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className={`font-semibold text-xs md:text-sm text-slate-800 leading-snug truncate ${task.completed ? "line-through text-slate-400" : ""}`}>
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {task.duration} min · {task.sprints} sprint{task.sprints > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                              task.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200/80" : "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                              <span>{task.priority}</span>
                            </span>

                            <button 
                              onClick={() => {
                                setInFocusTasks([...inFocusTasks, {
                                  id: `f-${Date.now()}`,
                                  title: task.title,
                                  duration: task.duration,
                                  sprints: task.sprints,
                                  due: "Due today",
                                  priority: task.priority as any,
                                  sprintTag: `Sprint ${inFocusTasks.length + 1}`,
                                  completed: false
                                }]);
                                setBacklogTasks(backlogTasks.filter(b => b.id !== task.id));
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-purple-50 hover:text-[#7c3aed] text-slate-600 rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>+</span>
                              <span>Add to plan</span>
                            </button>

                            <button 
                              onClick={() => alert(`Task options: ${task.title}`)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              ⋮
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>
          )}
          
          {/* --- STATE 1: TASK INPUT VIEW (SCREEN 18 · EMPTY TASK INPUT) --- */}
          {viewState === "input" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full animate-fade-in">
              
              <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">Paste your tasks</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">One task per line. Be as messy as you like.</p>
                  </div>
                </div>

                {/* Dashed Input Container */}
                <div className="relative min-h-[260px] bg-slate-50/40 border-2 border-dashed border-slate-200/90 rounded-2xl p-4 transition-all focus-within:border-[#7c3aed] focus-within:bg-white flex flex-col justify-center">
                  
                  {/* Empty Placeholder Illustration */}
                  {!taskText.trim() && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 text-slate-400 flex items-center justify-center mb-3 shadow-sm">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </div>
                      <h4 className="font-semibold text-sm text-slate-800 leading-tight">Your tasks will appear here</h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium max-w-sm">
                        Paste a list, type a task, or tap an example below to start.
                      </p>
                    </div>
                  )}

                  <textarea
                    className="w-full h-64 bg-transparent text-sm placeholder:text-transparent focus:outline-none transition-all font-mono leading-relaxed resize-none relative z-10 p-2"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="Enter tasks here..."
                  ></textarea>

                </div>

                {/* Try an Example Section */}
                <div className="space-y-2.5">
                  <span className="block text-xs font-semibold text-slate-600">Try an example</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Write the Q3 update email",
                      "Review Sara's PR #218",
                      "Fix dashboard loading bug",
                      "Plan next sprint"
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addExampleTask(example)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-purple-50 hover:border-purple-200 border border-slate-200/80 rounded-full text-xs font-medium text-slate-700 hover:text-[#7c3aed] transition-all cursor-pointer shadow-sm"
                      >
                        <span className="text-[#7c3aed] font-bold">+</span>
                        <span>{example}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analysis Button */}
                <div className="pt-2">
                  <button 
                    className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      detectedTasksCount === 0
                        ? "bg-slate-100 border border-slate-200/80 text-slate-400 cursor-not-allowed"
                        : "btn btn-primary bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-purple-500/20"
                    }`}
                    onClick={() => handleAnalyze(false)}
                    disabled={detectedTasksCount === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Analyze Tasks
                  </button>
                  {detectedTasksCount === 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-left font-medium">
                      Add at least one task to continue.
                    </p>
                  )}
                  {detectedTasksCount > 0 && (
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                      <span className="font-semibold text-green-600">✓ {detectedTasksCount} tasks detected</span>
                      <button 
                        className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                        onClick={() => setTaskText("")}
                      >
                        Clear list
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: How it works */}
              <div className="lg:col-span-4 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">How it works</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">AI reads your list</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Understands context, effort & priority.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">Splits into sprints</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Each sprint is a 15–30 min focus block.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7c3aed] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">You stay in control</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Edit, approve or regenerate any sprint.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* --- STATE 2: SCREEN 29 · AI LOADING STATE --- */}
          {/* ========================================================================= */}
          {viewState === "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full animate-fade-in">
              
              {/* Left Column: Your Tasks card */}
              <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Your tasks</h3>
                
                <ul className="space-y-4 list-none p-0 text-xs md:text-sm">
                  {parsedLoadingTasks.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                      }`}></span>
                      <span className="font-medium text-slate-800">{task.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: AI Progress Hero + Step Badges + Skeletons */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Purple Hero Card */}
                <div className="bg-[#4f46e5] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0 backdrop-blur-sm border border-white/30">
                      ✨
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-heading font-extrabold text-base md:text-lg leading-tight">Building your focus plan...</h3>
                      <p className="text-xs text-white/80 leading-relaxed max-w-lg">
                        SprintFlow is reading your {parsedLoadingTasks.length || 6} tasks and grouping them into focus sprints. This usually takes a few seconds.
                      </p>
                      
                      {/* Animated Progress Bar */}
                      <div className="pt-3">
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${loadingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Status Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    loadingStep >= 1 ? "bg-white text-emerald-700 border-emerald-200 shadow-sm" : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    <span>✓</span>
                    <span>Reading tasks</span>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    loadingStep === 2 ? "bg-purple-50 text-[#7c3aed] border-purple-200 shadow-sm" :
                    loadingStep > 2 ? "bg-white text-emerald-700 border-emerald-200 shadow-sm" :
                    "bg-white text-slate-600 border-slate-200"
                  }`}>
                    {loadingStep === 2 ? (
                      <span className="animate-spin text-sm">⟳</span>
                    ) : loadingStep > 2 ? (
                      <span>✓</span>
                    ) : (
                      <span className="text-slate-400">✦</span>
                    )}
                    <span>Estimating effort</span>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    loadingStep === 3 ? "bg-purple-50 text-[#7c3aed] border-purple-200 shadow-sm" :
                    loadingStep > 3 ? "bg-white text-emerald-700 border-emerald-200 shadow-sm" :
                    "bg-white text-slate-400 border-slate-200/80"
                  }`}>
                    {loadingStep === 3 ? (
                      <span className="animate-spin text-sm">⟳</span>
                    ) : loadingStep > 3 ? (
                      <span>✓</span>
                    ) : (
                      <span className="text-slate-400">✦</span>
                    )}
                    <span>Grouping sprints</span>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    loadingStep === 4 ? "bg-purple-50 text-[#7c3aed] border-purple-200 shadow-sm" :
                    "bg-white text-slate-400 border-slate-200/80"
                  }`}>
                    {loadingStep === 4 ? (
                      <span className="animate-spin text-sm">⟳</span>
                    ) : (
                      <span className="text-slate-400">✦</span>
                    )}
                    <span>Ordering your day</span>
                  </div>
                </div>

                {/* 3 Skeleton Cards */}
                <div className="space-y-4">
                  {[1, 2, 3].map((cardIdx) => (
                    <div key={cardIdx} className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-sm animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-slate-100"></div>
                          <div className="space-y-1.5">
                            <div className="h-4 bg-slate-100 rounded-md w-48"></div>
                            <div className="h-3 bg-red-100/60 rounded-full w-14"></div>
                          </div>
                        </div>
                        <div className="h-8 w-20 bg-slate-100 rounded-xl"></div>
                      </div>

                      <div className="space-y-2.5 pt-2 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-3/4"></div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* --- STATE 3: SCREEN 30 · AI ERROR STATE --- */}
          {/* ========================================================================= */}
          {viewState === "error" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full animate-fade-in">
              
              {/* Left Column: Your Tasks card */}
              <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Your tasks</h3>
                
                <ul className="space-y-4 list-none p-0 text-xs md:text-sm">
                  {parsedLoadingTasks.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                      }`}></span>
                      <span className="font-medium text-slate-800">{task.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Error Card */}
              <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-8 md:p-14 text-center shadow-sm flex flex-col items-center justify-center space-y-6 min-h-[460px]">
                
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center text-3xl shadow-sm">
                  ⚠️
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">
                    {aiError.message || "We couldn't build your plan"}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                    Something went wrong while analyzing your tasks. Don't worry — your {parsedLoadingTasks.length || 6} tasks are saved. Give it another try.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-xs font-mono font-semibold">
                  <span>⚠️</span>
                  <span>{aiError.code || "Error AI-503 · model timed out"}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleAnalyze(true)}
                    className="px-6 h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>Try again</span>
                  </button>

                  <button
                    onClick={() => setViewState("input")}
                    className="px-6 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>✏️</span>
                    <span>Edit tasks</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-medium pt-2">
                  Still stuck? <a href="mailto:support@sprintflow.io" className="text-[#7c3aed] hover:underline font-bold">Contact support</a>
                </p>

              </div>

            </div>
          )}

          {/* --- STATE 3: SPRINT BREAKDOWN VIEW --- */}
          {viewState === "breakdown" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              
              {/* Left Column: Parsed tasks with priority bullets */}
              <div className="lg:col-span-5 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">Your tasks</h3>
                
                <ul className="space-y-4 list-none p-0 text-sm animate-fade-in">
                  {aiTasks.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-orange-500" : "bg-green-500"
                      }`}></span>
                      <span className="font-semibold text-slate-700">{task.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: AI Grouped Sprints */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
                  <div className="text-xl leading-none pt-0.5">✦</div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#7c3aed] mb-1">AI grouped your tasks into {sprints.length} focused sprints</h4>
                    <p className="text-xs text-[#7c3aed]/80 leading-relaxed font-medium">
                      Ordered by priority and energy. Tweak anything before generating your day.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {sprints.map((sprint) => (
                    <div 
                      key={sprint.id} 
                      className={`bg-white border rounded-2xl p-6 transition-all duration-200 ${
                        sprint.approved ? "border-purple-200 shadow-sm" : "border-slate-200/50"
                      }`}
                    >
                      
                      <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-50 text-[#7c3aed] font-heading font-extrabold rounded-xl flex items-center justify-center shrink-0">
                            {sprint.id}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-900 leading-tight">{sprint.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                              <span>⏱ {sprint.duration} min</span>
                              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                              <span className={`font-semibold uppercase tracking-wider text-[10px] ${
                                sprint.priority === "High" ? "text-red-500" :
                                sprint.priority === "Medium" ? "text-orange-500" : "text-green-500"
                              }`}>{sprint.priority} priority</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <button aria-label="Refresh sprint"><RefreshIcon /></button>
                          <button 
                            aria-label="Edit sprint"
                            onClick={() => setEditingSprint({
                              id: sprint.id,
                              title: sprint.title,
                              duration: sprint.duration,
                              priority: sprint.priority,
                              subtasks: sprint.subtasks || []
                            })}
                            className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <EditIcon />
                          </button>
                          
                          <button 
                            className={`btn h-9 px-4 text-xs font-bold transition-all border ${
                              sprint.approved 
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-sm" 
                                : "bg-transparent border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                            onClick={() => handleToggleApprove(sprint.id)}
                          >
                            ✓ {sprint.approved ? "Approved" : "Approve"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {sprint.subtasks.map((taskName, subidx) => (
                          <label key={subidx} className="flex items-center gap-3 cursor-pointer text-xs md:text-sm">
                            <input 
                              type="checkbox"
                              className="w-4 h-4 rounded text-[#7c3aed] border-slate-300 focus:ring-[#7c3aed]"
                              defaultChecked={sprint.approved && subidx === 0}
                            />
                            <span className="text-slate-600 font-medium">{taskName}</span>
                          </label>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* --- GLASSMORPHIC API KEY MODAL --- */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-1 flex items-center gap-2">
                <span>🔑</span> Gemini API Key Required
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Unlock real AI task breakdowns! Please enter your Gemini API Key. Your key is stored securely in your browser's local storage.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5" htmlFor="api-key-input">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="api-key-input"
                    className="block w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#7c3aed] focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-mono"
                    placeholder="AIzaSy..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  {tempApiKey && (
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer px-1 bg-transparent border-0"
                      onClick={() => setTempApiKey("")}
                      type="button"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="w-full btn btn-primary h-11 text-xs font-bold shadow-sm"
                  onClick={handleSaveApiKey}
                  disabled={!tempApiKey.trim()}
                >
                  Save API Key & Analyze
                </button>
                <button
                  className="w-full h-11 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setShowApiKeyModal(false);
                    handleAnalyze(true); // Bypass key check to trigger simulated breakdown
                  }}
                >
                  Use Simulated Offline Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SPRINT EDIT MODAL (SCREEN 31) --- */}
      <SprintEditModal
        isOpen={!!editingSprint}
        onClose={() => setEditingSprint(null)}
        sprint={editingSprint}
        onSave={handleSaveEditedSprint}
      />

      {/* --- TASK DETAIL SLIDE-OVER DRAWER (SCREEN 47) --- */}
      <TaskDetailDrawer
        isOpen={!!selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        task={selectedTaskDetail}
        onMarkComplete={(id) => {
          setInFocusTasks(inFocusTasks.map(t => t.id === id ? { ...t, completed: true } : t));
        }}
      />

    </div>
  );
}
