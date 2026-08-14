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

    const session = await getSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, rewards: user.rewards });
  } catch (error) {
    console.error("GET rewards error:", error);
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

    const { rewards } = await req.json();
    if (!rewards) {
      return NextResponse.json({ error: "Invalid rewards payload" }, { status: 400 });
    }

    user.rewards = {
      ...user.rewards,
      ...rewards
    };
    await updateUser(user);

    return NextResponse.json({ success: true, rewards: user.rewards });
  } catch (error) {
    console.error("POST rewards error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
