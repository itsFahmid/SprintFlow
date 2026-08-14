import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByEmail, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify mock hash
    const passwordHash = "mock_" + password;
    if (user.passwordHash !== passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate session token
    const session = createSession(user.id);

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("sprintflow_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/"
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
