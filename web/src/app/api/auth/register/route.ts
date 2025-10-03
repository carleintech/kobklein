import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/auth/register - Create user profile in database after Supabase signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, firstName, lastName, phoneNumber, role } = body;

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "User profile already exists" },
        { status: 400 }
      );
    }

    // Create user profile
    const { data: profile, error: createError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: id,
        email: email,
        full_name: `${firstName || ""} ${lastName || ""}`.trim() || null,
        phone: phoneNumber || null,
        role: role?.toLowerCase() || "client",
        profile_completed: false,
        is_active: true,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating user profile:", createError);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User profile created successfully",
        user: {
          uid: id,
          email: email,
          role: profile.role.toLowerCase(),
          firstName: profile.full_name?.split(" ")[0] || "",
          lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
          phoneNumber: profile.phone || "",
          isActive: profile.is_active,
          isVerified: false,
          kycStatus: "pending" as const,
          language: "fr" as const,
          currency: "HTG" as const,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}
