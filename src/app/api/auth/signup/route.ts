import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser, getUserByEmail, createSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if email already registered
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Mock password hashing for local developer setup
    const passwordHash = "mock_" + password;

    // Create the user profile
    const user = createUser(name, email, passwordHash);

    // Create session token
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
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
