import fs from "fs";
import path from "path";

// Define the root db.json path
const DB_FILE_PATH = path.join(process.cwd(), "db.json");

// --- INTERFACES & SCHEMAS ---
export interface UserSettings {
  sprintLength: number;
  breakLength: number;
  longBreakLength: number;
  dailyGoal: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  notificationsEnabled: boolean;
  geminiApiKey?: string;
}

export interface TaskRecord {
  id: number;
  name: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export interface SubTaskRecord {
  name: string;
  completed: boolean;
}

export interface SprintRecord {
  id: string;
  title: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  approved: boolean;
  subtasks: SubTaskRecord[];
}

export interface PlannerItem {
  id: string;
  title: string;
  duration: number;
  type: "sprint" | "short_break" | "long_break";
  completed: boolean;
  sprintId?: string; // Links back to the sprint
}

export interface RewardHistoryItem {
  id: string;
  text: string;
  xp: number;
  coins: number;
  timestamp: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Stored in plain text or simple hash for mock server auth
  settings: UserSettings;
  tasks: TaskRecord[];
  sprints: SprintRecord[];
  rewards: {
    xp: number;
    coins: number;
    streak: number;
    streakDays: boolean[]; // Mon-Sat streaks: size 6 representing [Mon, Tue, Wed, Thu, Fri, Sat]
    achievements: string[]; // Unlocked badge IDs
    history: RewardHistoryItem[];
  };
  planner: {
    timeline: PlannerItem[];
    completedSprintsCount: number;
  };
}

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  sessions: SessionRecord[];
}

// Helper to initialize db.json if missing
function ensureDbExists() {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = {
      users: [],
      sessions: []
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), "utf8");
  }
}

// Reads the raw db object
export function getDb(): DatabaseSchema {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    console.error("DB read error, returning fresh schema:", error);
    return { users: [], sessions: [] };
  }
}

// Saves the db object
export function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("DB save error:", error);
  }
}

// --- USER OPERATIONS ---
export function getUserByEmail(email: string): UserRecord | null {
  const db = getDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): UserRecord | null {
  const db = getDb();
  return db.users.find(u => u.id === id) || null;
}

export function createUser(name: string, email: string, passwordHash: string): UserRecord {
  const db = getDb();
  
  // Default checklist tasks
  const defaultTasks: TaskRecord[] = [
    { id: 1, name: "Review PR #218 from Sara", duration: "15 min • 1 sprint", priority: "Medium", completed: false },
    { id: 2, name: "Write sprint retro notes", duration: "20 min • 1 sprint", priority: "Low", completed: false },
    { id: 3, name: "Prep design handoff", duration: "30 min • 1 sprint", priority: "High", completed: false }
  ];

  // Default mock sprints
  const defaultSprints: SprintRecord[] = [
    {
      id: "01",
      title: "Set up OAuth providers & routes",
      duration: 25,
      priority: "High",
      approved: true,
      subtasks: [
        { name: "Install auth dependencies", completed: true },
        { name: "Create Google developer keys", completed: true },
        { name: "Implement login route endpoints", completed: false },
        { name: "Test session credentials cookie tokens", completed: false }
      ]
    },
    {
      id: "02",
      title: "Fix dashboard lazy-load delays",
      duration: 30,
      priority: "High",
      approved: false,
      subtasks: [
        { name: "Diagnose rendering bottleneck", completed: false },
        { name: "Lazy load stats chart widgets", completed: false },
        { name: "Throttle network update calls", completed: false }
      ]
    },
    {
      id: "03",
      title: "Write customer update notice text",
      duration: 20,
      priority: "Medium",
      approved: false,
      subtasks: [
        { name: "Compile release highlight cards", completed: false },
        { name: "Proofread marketing text", completed: false }
      ]
    }
  ];

  // Default timeline scheduler
  const defaultTimeline: PlannerItem[] = [
    { id: "tl-01", title: "OAuth setup (Sprint 1)", duration: 25, type: "sprint", completed: true, sprintId: "01" },
    { id: "tl-02", title: "Short Rest", duration: 5, type: "short_break", completed: true },
    { id: "tl-03", title: "Optimize widgets (Sprint 2)", duration: 30, type: "sprint", completed: false, sprintId: "02" },
    { id: "tl-04", title: "Short Rest", duration: 5, type: "short_break", completed: false },
    { id: "tl-05", title: "Draft notice (Sprint 3)", duration: 20, type: "sprint", completed: false, sprintId: "03" },
    { id: "tl-06", title: "Long Break", duration: 15, type: "long_break", completed: false }
  ];

  const newUser: UserRecord = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    passwordHash,
    settings: {
      sprintLength: 25,
      breakLength: 5,
      longBreakLength: 15,
      dailyGoal: 5,
      workingHoursStart: "9:00 AM",
      workingHoursEnd: "6:00 PM",
      notificationsEnabled: false
    },
    tasks: defaultTasks,
    sprints: defaultSprints,
    rewards: {
      xp: 2480, // Matches level 12 starter stats in Figma
      coins: 240,
      streak: 5,
      streakDays: [true, true, true, true, true, false], // Mon-Sat indicators
      achievements: ["badge-streak", "badge-power", "badge-sharp", "badge-early", "badge-centurion"],
      history: [
        { id: "h-1", text: "Streak starter badge unlocked", xp: 100, coins: 20, timestamp: new Date().toISOString() },
        { id: "h-2", text: "Sprint 1 completed focus block", xp: 40, coins: 10, timestamp: new Date().toISOString() }
      ]
    },
    planner: {
      timeline: defaultTimeline,
      completedSprintsCount: 1 // Sprint 1 is completed by default
    }
  };

  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUser(user: UserRecord) {
  const db = getDb();
  const idx = db.users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    db.users[idx] = user;
    saveDb(db);
  }
}

// --- SESSION OPERATIONS ---
export function createSession(userId: string): SessionRecord {
  const db = getDb();
  
  // Clean up any old sessions for this user
  db.sessions = db.sessions.filter(s => s.userId !== userId);

  const token = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Session active for 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const session: SessionRecord = { token, userId, expiresAt };
  db.sessions.push(session);
  saveDb(db);

  return session;
}

export function getSession(token: string): SessionRecord | null {
  const db = getDb();
  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;

  // Check expiration
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    deleteSession(token);
    return null;
  }

  return session;
}

export function deleteSession(token: string) {
  const db = getDb();
  db.sessions = db.sessions.filter(s => s.token !== token);
  saveDb(db);
}
