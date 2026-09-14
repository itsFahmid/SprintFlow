import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserByEmail, createSession, updateUser } from "@/lib/db";
import { verifyPassword, hashPassword, isLegacyMockHash } from "@/lib/auth-passwords";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password with bcrypt (supports legacy mock_ fallback)
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Migration path for existing records:
    // If stored hash is legacy mock_, immediately re-hash with bcrypt and persist
    if (isLegacyMockHash(user.passwordHash)) {
      // TODO(phase-2): remove legacy mock_ path
      user.passwordHash = await hashPassword(password);
      await updateUser(user);
    }

    // Generate cryptographic session token with custom duration
    const isRemember = Boolean(rememberMe);
    const session = await createSession(user.id, isRemember);
    const maxAgeSeconds = isRemember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days vs 1 day

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("sprintflow_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAgeSeconds,
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
