import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/auth/update-login - Update user's last login timestamp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user profile with last login and updated timestamp
    const { error } = await supabase
      .from("user_profiles")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating login:", error);
      return NextResponse.json(
        { error: "Failed to update login" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Login updated successfully" });
  } catch (error) {
    console.error("Error updating login:", error);
    return NextResponse.json(
      { error: "Failed to update login" },
      { status: 500 }
    );
  }
}
