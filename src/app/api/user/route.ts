import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getUserById, deleteUser } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-passwords";

export async function DELETE(req: NextRequest) {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const { password, confirmation } = body || {};

    // Validate confirmation string (either "DELETE" or user's email)
    const validConfirmation =
      typeof confirmation === "string" &&
      (confirmation.trim().toUpperCase() === "DELETE" ||
        confirmation.trim().toLowerCase() === user.email.toLowerCase());

    if (!validConfirmation) {
      return NextResponse.json(
        { error: "Confirmation text must be 'DELETE' or your account email." },
        { status: 400 }
      );
    }

    // Require password re-entry
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required to delete your account." }, { status: 400 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 403 });
    }

    // Permanently erase user record and all associated sessions
    await deleteUser(user.id);

    // Clear session cookie
    cookieStore.delete("sprintflow_session");

    return NextResponse.json({
      success: true,
      message: "Account and associated data permanently deleted.",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
