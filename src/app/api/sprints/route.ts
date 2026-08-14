import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getUserById, updateUser } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sprintflow_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = getSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Map subtasks to strings for frontend compatibility if needed
    // But since the frontend can read the name property or string directly, we return them as is
    return NextResponse.json({ success: true, sprints: user.sprints });
  } catch (error) {
    console.error("GET sprints error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sprintflow_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = getSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sprints } = await req.json();
    if (!Array.isArray(sprints)) {
      return NextResponse.json({ error: "Invalid sprints array" }, { status: 400 });
    }

    // Convert subtask strings to objects if saved from raw AI results
    user.sprints = sprints.map(s => ({
      id: s.id,
      title: s.title,
      duration: Number(s.duration) || 25,
      priority: s.priority || "Medium",
      approved: s.approved ?? false,
      subtasks: Array.isArray(s.subtasks) 
        ? s.subtasks.map((st: any) => {
            if (typeof st === "string") {
              return { name: st, completed: false };
            }
            return {
              name: st.name || "",
              completed: st.completed ?? false
            };
          })
        : []
    }));

    updateUser(user);

    return NextResponse.json({ success: true, sprints: user.sprints });
  } catch (error) {
    console.error("POST sprints error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
