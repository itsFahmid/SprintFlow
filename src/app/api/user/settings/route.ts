import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getUserById, updateUser } from "@/lib/db";

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

    const { settings } = await req.json();
    if (!settings) {
      return NextResponse.json({ error: "Settings payload required" }, { status: 400 });
    }

    user.settings = {
      ...user.settings,
      ...settings
    };

    await updateUser(user);

    return NextResponse.json({ success: true, settings: user.settings });

  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
