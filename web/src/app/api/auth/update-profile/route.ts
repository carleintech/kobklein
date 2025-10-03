import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/update-profile - Update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First, get the user to determine their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract different types of updates
    const {
      first_name,
      last_name,
      phone,
      address,
      city,
      country,
      language,
      date_of_birth,
      // Profile-specific fields
      business_name,
      business_registration_number,
      business_type,
      ...otherUpdates
    } = updates;

    // Update user record for basic fields
    const userUpdates: any = {};
    if (first_name !== undefined) userUpdates.first_name = first_name;
    if (last_name !== undefined) userUpdates.last_name = last_name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (address !== undefined) userUpdates.address = address;
    if (city !== undefined) userUpdates.city = city;
    if (country !== undefined) userUpdates.country = country;
    if (language !== undefined) userUpdates.language = language;
    if (date_of_birth !== undefined)
      userUpdates.date_of_birth = new Date(date_of_birth);

    if (Object.keys(userUpdates).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdates,
      });
    }

    // Update role-specific profile if profile-related fields are present
    const profileUpdates: any = {};
    if (business_name !== undefined)
      profileUpdates.business_name = business_name;
    if (business_registration_number !== undefined)
      profileUpdates.business_registration_number =
        business_registration_number;
    if (business_type !== undefined)
      profileUpdates.business_type = business_type;

    if (Object.keys(profileUpdates).length > 0) {
      // Update the appropriate profile table based on user role
      switch (user.role) {
        case "CLIENT":
          // Client profiles don't have business fields, skip
          break;
        case "MERCHANT":
          await prisma.merchantProfile.upsert({
            where: { user_id: userId },
            update: profileUpdates,
            create: {
              user_id: userId,
              ...profileUpdates,
            },
          });
          break;
        case "DISTRIBUTOR":
          await prisma.distributorProfile.upsert({
            where: { user_id: userId },
            update: profileUpdates,
            create: {
              user_id: userId,
              ...profileUpdates,
            },
          });
          break;
        case "DIASPORA":
          await prisma.diasporaProfile.upsert({
            where: { user_id: userId },
            update: profileUpdates,
            create: {
              user_id: userId,
              ...profileUpdates,
            },
          });
          break;
      }
    }

    // Fetch updated user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        client_profiles: true,
        merchant_profiles: true,
        distributor_profiles: true,
        diaspora_profiles: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action: "UPDATE",
        resource: "UserProfile",
        resource_id: userId,
        ip_address:
          request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1",
        user_agent: request.headers.get("user-agent") || "",
        metadata: {
          updates,
        },
      },
    });

    // Transform to match expected response structure
    const profile =
      updatedUser.client_profiles ||
      updatedUser.merchant_profiles ||
      updatedUser.distributor_profiles ||
      updatedUser.diaspora_profiles;

    const userProfile = {
      uid: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role.toLowerCase(),
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      country: updatedUser.country,
      language: updatedUser.language,
      date_of_birth: updatedUser.date_of_birth,
      profile: profile,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
