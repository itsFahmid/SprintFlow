import fs from "fs";
import path from "path";
import postgres from "postgres";

const DB_FILE_PATH = path.join(process.cwd(), "db.json");

// --- CONNECTION SPECIFICATION ---
const connectionString = process.env.DATABASE_URL;
const sql = connectionString ? postgres(connectionString, { ssl: "require" }) : null;

// --- INTERFACES & SCHEMAS ---
export interface UserSettings {
  sprintLength: number;
  breakLength: number;
  longBreakLength: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartNextSprint: boolean;
  soundTheme: string;
  tickingSound: boolean;
  soundVolume: number;
  dailyGoal: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  notificationsEnabled: boolean;
  pushEnabled: boolean;
  emailNotifications: boolean;
  sprintReminders: boolean;
  breakNudges: boolean;
  streakAlerts: boolean;
  dailySummary: boolean;
  achievementUnlocks: boolean;
  productUpdates: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  usageAnalytics: boolean;
  personalizedAi: boolean;
  showOnLeaderboards: boolean;
  username?: string;
  avatarUrl?: string;
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
  sprintId?: string;
}

export interface RewardHistoryItem {
  id: string;
  text: string;
  xp: number;
  coins: number;
  timestamp: string;
}

export interface PaymentHistoryItem {
  id: string;
  plan: string;
  durationMonths: number;
  amount: number;
  currency: string;
  method: "bKash" | "Nagad" | "Rocket" | "Card";
  accountNumber?: string;
  transactionId: string;
  date: string;
  status: "Paid" | "Failed";
}

export interface SubscriptionRecord {
  plan: "Free" | "Pro";
  status: "active" | "trial" | "expired" | "none";
  period: "1_month" | "3_months" | "none";
  startDate?: string;
  endDate?: string;
  trialEndsAt?: string;
  reminderEnabled: boolean;
  history: PaymentHistoryItem[];
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  settings: UserSettings;
  tasks: TaskRecord[];
  sprints: SprintRecord[];
  rewards: {
    xp: number;
    coins: number;
    streak: number;
    streakDays: boolean[];
    achievements: string[];
    history: RewardHistoryItem[];
  };
  planner: {
    timeline: PlannerItem[];
    completedSprintsCount: number;
  };
  subscription?: SubscriptionRecord;
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

// Ensure database table setup for Postgres runs on load
let dbInitializedPromise: Promise<void> | null = null;

async function ensureDbInitialized() {
  if (!sql) {
    // Local file fallback initialization
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialData: DatabaseSchema = { users: [], sessions: [] };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), "utf8");
    }
    return;
  }

  if (dbInitializedPromise) return dbInitializedPromise;

  dbInitializedPromise = (async () => {
    try {
      // Create user table storing metadata inside a JSONB column
      await sql`
        CREATE TABLE IF NOT EXISTS sprintflow_users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          data JSONB NOT NULL
        );
      `;
      // Create session tokens mapping
      await sql`
        CREATE TABLE IF NOT EXISTS sprintflow_sessions (
          token TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL
        );
      `;
      console.log("Postgres tables verified successfully.");
    } catch (err) {
      console.error("Postgres table setup error:", err);
      dbInitializedPromise = null; // retry on next call
    }
  })();

  return dbInitializedPromise;
}

// Reads local raw db from file
function getLocalDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE_PATH)) {
    return { users: [], sessions: [] };
  }
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    return { users: [], sessions: [] };
  }
}

// Saves local raw db to file
function saveLocalDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Local DB save error:", error);
  }
}

// --- HYBRID EXPORT OPERATIONS ---

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureDbInitialized();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, email, password_hash, data 
        FROM sprintflow_users 
        WHERE LOWER(email) = ${email.toLowerCase()};
      `;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        passwordHash: row.password_hash,
        ...row.data
      } as UserRecord;
    } catch (err) {
      console.error("getUserByEmail Postgres error:", err);
      return null;
    }
  } else {
    const db = getLocalDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  await ensureDbInitialized();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, email, password_hash, data 
        FROM sprintflow_users 
        WHERE id = ${id};
      `;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        passwordHash: row.password_hash,
        ...row.data
      } as UserRecord;
    } catch (err) {
      console.error("getUserById Postgres error:", err);
      return null;
    }
  } else {
    const db = getLocalDb();
    return db.users.find(u => u.id === id) || null;
  }
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<UserRecord> {
  await ensureDbInitialized();

  const defaultTasks: TaskRecord[] = [
    { id: 1, name: "Review PR #218 from Sara", duration: "15 min • 1 sprint", priority: "Medium", completed: false },
    { id: 2, name: "Write sprint retro notes", duration: "20 min • 1 sprint", priority: "Low", completed: false },
    { id: 3, name: "Prep design handoff", duration: "30 min • 1 sprint", priority: "High", completed: false }
  ];

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
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartNextSprint: false,
      soundTheme: "Soft chime",
      tickingSound: false,
      soundVolume: 80,
      dailyGoal: 5,
      workingHoursStart: "9:00 AM",
      workingHoursEnd: "6:00 PM",
      notificationsEnabled: true,
      pushEnabled: true,
      emailNotifications: true,
      sprintReminders: true,
      breakNudges: true,
      streakAlerts: true,
      dailySummary: true,
      achievementUnlocks: false,
      productUpdates: false,
      quietHoursEnabled: true,
      quietHoursStart: "10:00 PM",
      quietHoursEnd: "7:00 AM",
      usageAnalytics: true,
      personalizedAi: true,
      showOnLeaderboards: false,
      username: `@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`
    },
    tasks: defaultTasks,
    sprints: defaultSprints,
    rewards: {
      xp: 2480,
      coins: 240,
      streak: 5,
      streakDays: [true, true, true, true, true, false],
      achievements: ["badge-streak", "badge-power", "badge-sharp", "badge-early", "badge-centurion"],
      history: [
        { id: "h-1", text: "Streak starter badge unlocked", xp: 100, coins: 20, timestamp: new Date().toISOString() },
        { id: "h-2", text: "Sprint 1 completed focus block", xp: 40, coins: 10, timestamp: new Date().toISOString() }
      ]
    },
    planner: {
      timeline: defaultTimeline,
      completedSprintsCount: 1
    },
    subscription: {
      plan: "Free",
      status: "none",
      period: "none",
      reminderEnabled: true,
      history: []
    }
  };

  if (sql) {
    try {
      const dataPayload = {
        name: newUser.name,
        settings: newUser.settings,
        tasks: newUser.tasks,
        sprints: newUser.sprints,
        rewards: newUser.rewards,
        planner: newUser.planner,
        subscription: newUser.subscription
      };
      await sql`
        INSERT INTO sprintflow_users (id, email, password_hash, data)
        VALUES (${newUser.id}, ${newUser.email}, ${newUser.passwordHash}, ${sql.json(dataPayload as any)});
      `;
    } catch (err) {
      console.error("createUser Postgres error:", err);
    }
  } else {
    const db = getLocalDb();
    db.users.push(newUser);
    saveLocalDb(db);
  }

  return newUser;
}

export async function updateUser(user: UserRecord): Promise<void> {
  await ensureDbInitialized();
  if (sql) {
    try {
      const dataPayload = {
        name: user.name,
        settings: user.settings,
        tasks: user.tasks,
        sprints: user.sprints,
        rewards: user.rewards,
        planner: user.planner,
        subscription: user.subscription || {
          plan: "Free",
          status: "none",
          period: "none",
          reminderEnabled: true,
          history: []
        }
      };
      await sql`
        UPDATE sprintflow_users 
        SET email = ${user.email},
            password_hash = ${user.passwordHash},
            data = ${sql.json(dataPayload as any)}
        WHERE id = ${user.id};
      `;
    } catch (err) {
      console.error("updateUser Postgres error:", err);
    }
  } else {
    const db = getLocalDb();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      db.users[idx] = user;
      saveLocalDb(db);
    }
  }
}

export async function updateUserSubscription(userId: string, subscription: SubscriptionRecord): Promise<UserRecord | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  user.subscription = subscription;
  await updateUser(user);
  return user;
}

// --- SESSION OPERATIONS ---

export async function createSession(userId: string): Promise<SessionRecord> {
  await ensureDbInitialized();
  const token = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const session: SessionRecord = { token, userId, expiresAt };

  if (sql) {
    try {
      // Clear old sessions first
      await sql`
        DELETE FROM sprintflow_sessions 
        WHERE user_id = ${userId};
      `;
      // Write new session mapping
      await sql`
        INSERT INTO sprintflow_sessions (token, user_id, expires_at)
        VALUES (${session.token}, ${session.userId}, ${session.expiresAt});
      `;
    } catch (err) {
      console.error("createSession Postgres error:", err);
    }
  } else {
    const db = getLocalDb();
    db.sessions = db.sessions.filter(s => s.userId !== userId);
    db.sessions.push(session);
    saveLocalDb(db);
  }

  return session;
}

export async function getSession(token: string): Promise<SessionRecord | null> {
  await ensureDbInitialized();
  if (sql) {
    try {
      const rows = await sql`
        SELECT token, user_id, expires_at 
        FROM sprintflow_sessions 
        WHERE token = ${token};
      `;
      if (rows.length === 0) return null;
      const session = {
        token: rows[0].token,
        userId: rows[0].user_id,
        expiresAt: new Date(rows[0].expires_at).toISOString()
      } as SessionRecord;

      // Check expiration
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        await deleteSession(token);
        return null;
      }
      return session;
    } catch (err) {
      console.error("getSession Postgres error:", err);
      return null;
    }
  } else {
    const db = getLocalDb();
    const session = db.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await deleteSession(token);
      return null;
    }
    return session;
  }
}

export async function deleteSession(token: string): Promise<void> {
  await ensureDbInitialized();
  if (sql) {
    try {
      await sql`
        DELETE FROM sprintflow_sessions 
        WHERE token = ${token};
      `;
    } catch (err) {
      console.error("deleteSession Postgres error:", err);
    }
  } else {
    const db = getLocalDb();
    db.sessions = db.sessions.filter(s => s.token !== token);
    saveLocalDb(db);
  }
}
