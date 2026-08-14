import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sprintflow_session");

    if (sessionCookie?.value) {
      deleteSession(sessionCookie.value);
    }

    // Clear cookie
    cookieStore.delete("sprintflow_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
