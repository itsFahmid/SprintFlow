import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getUserById, updateUserSubscription, SubscriptionRecord, PaymentHistoryItem } from "@/lib/db";

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

    const defaultSubscription: SubscriptionRecord = {
      plan: "Free",
      status: "none",
      period: "none",
      reminderEnabled: true,
      history: []
    };

    const sub = user.subscription || defaultSubscription;

    // Calculate days remaining if active or in trial
    let daysLeft = 0;
    let totalDays = 0;
    if (sub.endDate) {
      const end = new Date(sub.endDate).getTime();
      const now = Date.now();
      const start = sub.startDate ? new Date(sub.startDate).getTime() : now;
      daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
      totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    } else if (sub.trialEndsAt) {
      const end = new Date(sub.trialEndsAt).getTime();
      const now = Date.now();
      daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
      totalDays = 3;
    }

    return NextResponse.json({
      success: true,
      subscription: sub,
      daysLeft,
      totalDays,
      freeSprintsUsedToday: Math.min(3, user.planner?.completedSprintsCount || 0),
      freeSprintsLimit: 3
    });

  } catch (error) {
    console.error("Subscription GET error:", error);
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
    const { action, plan, period, method, accountNumber, reminderEnabled } = body;

    const currentSub: SubscriptionRecord = user.subscription || {
      plan: "Free",
      status: "none",
      period: "none",
      reminderEnabled: true,
      history: []
    };

    if (action === "start_trial") {
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const updatedSub: SubscriptionRecord = {
        ...currentSub,
        plan: "Pro",
        status: "trial",
        period: "3_months",
        startDate: now.toISOString(),
        trialEndsAt,
        endDate: trialEndsAt
      };
      await updateUserSubscription(user.id, updatedSub);
      return NextResponse.json({ success: true, subscription: updatedSub });
    }

    if (action === "checkout") {
      const durationMonths = period === "1_month" ? 1 : 3;
      const amount = durationMonths === 3 ? 499 : 199;
      const now = new Date();
      
      // Calculate end date based on current end date if already active or from now
      let baseStartDate = now;
      if (currentSub.endDate && new Date(currentSub.endDate).getTime() > now.getTime()) {
        baseStartDate = new Date(currentSub.endDate);
      }
      
      const newEndDate = new Date(baseStartDate.getTime() + durationMonths * 30.5 * 24 * 60 * 60 * 1000);
      
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      const txId = `SF-${randomSuffix}`;

      const historyItem: PaymentHistoryItem = {
        id: "tx_" + Date.now(),
        plan: `Pro · ${durationMonths}-Month pass`,
        durationMonths,
        amount,
        currency: "BDT",
        method: method || "bKash",
        accountNumber: accountNumber || "01XXX-XXXXXX",
        transactionId: txId,
        date: now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        status: "Paid"
      };

      const updatedSub: SubscriptionRecord = {
        ...currentSub,
        plan: "Pro",
        status: "active",
        period: period || "3_months",
        startDate: now.toISOString(),
        endDate: newEndDate.toISOString(),
        trialEndsAt: undefined,
        history: [historyItem, ...(currentSub.history || [])]
      };

      await updateUserSubscription(user.id, updatedSub);
      return NextResponse.json({
        success: true,
        subscription: updatedSub,
        transaction: historyItem,
        endDateFormatted: newEndDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      });
    }

    if (action === "toggle_reminder") {
      const updatedSub: SubscriptionRecord = {
        ...currentSub,
        reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : !currentSub.reminderEnabled
      };
      await updateUserSubscription(user.id, updatedSub);
      return NextResponse.json({ success: true, subscription: updatedSub });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
