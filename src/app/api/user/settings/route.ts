import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getUserById, updateUser, deleteSession } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sprintflow_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await getSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error("Get settings error:", error);
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

    const session = await getSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, name, username, email, settings, newPassword } = body;

    // 1. Export Data Action
    if (action === "export_data") {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          settings: user.settings,
          tasks: user.tasks,
          sprints: user.sprints,
          rewards: user.rewards,
          planner: user.planner,
          subscription: user.subscription
        }
      };
      return NextResponse.json({ success: true, exportData: exportPayload });
    }

    // 2. Clear History Action
    if (action === "clear_history") {
      user.planner = {
        timeline: (user.planner?.timeline || []).map(item => ({ ...item, completed: false })),
        completedSprintsCount: 0
      };
      user.rewards = {
        ...user.rewards,
        history: []
      };
      await updateUser(user);
      return NextResponse.json({ success: true, message: "Sprint and analytics history cleared." });
    }

    // 3. Change Password Action
    if (action === "change_password" && newPassword) {
      user.passwordHash = newPassword;
      await updateUser(user);
      return NextResponse.json({ success: true, message: "Password updated successfully." });
    }

    // 4. Update Profile
    if (name) user.name = name;
    if (email) user.email = email;
    if (username) {
      user.settings = { ...user.settings, username };
    }

    // 5. Update Settings
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    await updateUser(user);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
