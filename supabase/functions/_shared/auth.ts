import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthUser {
  id: string;
  email: string;
  role: "CLIENT" | "MERCHANT" | "DISTRIBUTOR" | "DIASPORA" | "ADMIN";
  isActive: boolean;
}

export async function authenticateUser(
  request: Request
): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const supabaseUrl = (globalThis as any).Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = (globalThis as any).Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    // Fetch user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, email, role, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      isActive: profile.is_active,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  return requiredRoles.includes(userRole);
}

export function createUnauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export function createForbiddenResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Forbidden - Insufficient permissions" }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
}
