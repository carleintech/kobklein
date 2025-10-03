import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/auth/profile - Get user profile by userId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First get the user from auth.users
    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(userId);

    if (authError || !authUser.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Then get or create the user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = not found
      console.error("Error fetching user profile:", profileError);
      return NextResponse.json(
        { error: "Error fetching profile" },
        { status: 500 }
      );
    }

    // If no profile exists, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          email: authUser.user.email || "",
          full_name:
            `${authUser.user.user_metadata?.first_name || ""} ${
              authUser.user.user_metadata?.last_name || ""
            }`.trim() || null,
          role: "client",
          phone: authUser.user.user_metadata?.phone || null,
          country: authUser.user.user_metadata?.country || null,
          profile_completed: false,
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user profile:", createError);
        return NextResponse.json(
          { error: "Error creating profile" },
          { status: 500 }
        );
      }

      const userProfile = {
        uid: userId,
        email: authUser.user.email,
        role: newProfile.role.toLowerCase(),
        firstName: newProfile.full_name?.split(" ")[0] || "",
        lastName: newProfile.full_name?.split(" ").slice(1).join(" ") || "",
        phoneNumber: newProfile.phone || "",
        country: newProfile.country || "",
        isActive: newProfile.is_active,
        isVerified: false,
        kycStatus: "pending" as const,
        language: "fr" as const,
        currency: "HTG" as const,
        createdAt: newProfile.created_at,
        updatedAt: newProfile.updated_at,
      };

      return NextResponse.json({ user: userProfile });
    }

    const userProfile = {
      uid: userId,
      email: authUser.user.email,
      role: profile.role.toLowerCase(),
      firstName: profile.full_name?.split(" ")[0] || "",
      lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
      phoneNumber: profile.phone || "",
      country: profile.country || "",
      isActive: profile.is_active,
      isVerified: false,
      kycStatus: "pending" as const,
      language: "fr" as const,
      currency: "HTG" as const,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
