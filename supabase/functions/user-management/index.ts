import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface UserProfile {
  id: string;
  email: string;
  role: "client" | "merchant" | "distributor" | "diaspora" | "admin";
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessName?: string;
  businessId?: string;
  distributorTerritory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserUpdateRequest {
  userId: string;
  updates: Partial<UserProfile>;
  adminUserId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    // Get user's role from the database
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("User")
      .select("role, isActive")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      throw new Error("User profile not found");
    }

    const { method } = req;
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const action = pathSegments[pathSegments.length - 1]; // Last segment after function name

    switch (method) {
      case "GET":
        return await handleGetUser(
          supabaseClient,
          userProfile,
          url.searchParams
        );

      case "PUT":
        return await handleUpdateUser(supabaseClient, userProfile, req);

      case "POST":
        if (action === "create") {
          return await handleCreateUser(supabaseClient, userProfile, req);
        } else if (action === "activate") {
          return await handleActivateUser(supabaseClient, userProfile, req);
        } else if (action === "deactivate") {
          return await handleDeactivateUser(supabaseClient, userProfile, req);
        }
        break;

      case "DELETE":
        return await handleDeleteUser(supabaseClient, userProfile, req);

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleGetUser(
  supabaseClient: any,
  userProfile: any,
  searchParams: URLSearchParams
) {
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  // If requesting specific user
  if (userId) {
    // Check permissions
    if (userProfile.role !== "admin" && userId !== userProfile.id) {
      throw new Error("Insufficient permissions");
    }

    const { data, error } = await supabaseClient
      .from("User")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ user: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // If requesting users by role (admin only)
  if (role) {
    if (userProfile.role !== "admin") {
      throw new Error("Admin access required");
    }

    const { data, error } = await supabaseClient
      .from("User")
      .select("*")
      .eq("role", role)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({ users: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Return current user profile
  const { data, error } = await supabaseClient
    .from("User")
    .select("*")
    .eq("id", userProfile.id)
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({ user: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleUpdateUser(
  supabaseClient: any,
  userProfile: any,
  req: Request
) {
  const body = (await req.json()) as UserUpdateRequest;
  const { userId, updates } = body;

  // Check permissions
  if (userProfile.role !== "admin" && userId !== userProfile.id) {
    throw new Error("Insufficient permissions");
  }

  // Prevent non-admins from changing role
  if (userProfile.role !== "admin" && updates.role) {
    throw new Error("Cannot change user role");
  }

  const { data, error } = await supabaseClient
    .from("User")
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ user: data, message: "User updated successfully" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleCreateUser(
  supabaseClient: any,
  userProfile: any,
  req: Request
) {
  // Only admins can create users via API
  if (userProfile.role !== "admin") {
    throw new Error("Admin access required");
  }

  const userData = await req.json();

  // Create the user in Supabase Auth first
  const { data: authUser, error: authError } =
    await supabaseClient.auth.admin.createUser({
      email: userData.email,
      password: userData.temporaryPassword || "TempPass123!",
      email_confirm: true,
      user_metadata: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
    });

  if (authError) throw authError;

  // Create the user profile
  const { data, error } = await supabaseClient
    .from("User")
    .insert({
      id: authUser.user.id,
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      businessName: userData.businessName,
      businessId: userData.businessId,
      distributorTerritory: userData.distributorTerritory,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ user: data, message: "User created successfully" }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function handleActivateUser(
  supabaseClient: any,
  userProfile: any,
  req: Request
) {
  if (userProfile.role !== "admin") {
    throw new Error("Admin access required");
  }

  const { userId } = await req.json();

  const { data, error } = await supabaseClient
    .from("User")
    .update({
      isActive: true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ user: data, message: "User activated successfully" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleDeactivateUser(
  supabaseClient: any,
  userProfile: any,
  req: Request
) {
  if (userProfile.role !== "admin") {
    throw new Error("Admin access required");
  }

  const { userId } = await req.json();

  const { data, error } = await supabaseClient
    .from("User")
    .update({
      isActive: false,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ user: data, message: "User deactivated successfully" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleDeleteUser(
  supabaseClient: any,
  userProfile: any,
  req: Request
) {
  if (userProfile.role !== "admin") {
    throw new Error("Admin access required");
  }

  const { userId } = await req.json();

  // Soft delete - just deactivate
  const { error } = await supabaseClient
    .from("User")
    .update({
      isActive: false,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;

  return new Response(
    JSON.stringify({ message: "User deleted successfully" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
