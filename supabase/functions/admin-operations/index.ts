import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  authenticateUser,
  createForbiddenResponse,
  createUnauthorizedResponse,
  hasPermission,
} from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SystemStats {
  total_users: number;
  active_users: number;
  total_transactions: number;
  total_volume: number;
  pending_payments: number;
  active_merchants: number;
  total_revenue: number;
}

interface AuditLog {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

interface UserUpdate {
  role?: "CLIENT" | "MERCHANT" | "DISTRIBUTOR" | "DIASPORA" | "ADMIN";
  is_active?: boolean;
  verification_status?: "PENDING" | "VERIFIED" | "REJECTED";
  kyc_status?: "PENDING" | "APPROVED" | "REJECTED";
}

const supabaseUrl = (globalThis as any).Deno.env.get("SUPABASE_URL")!;
const supabaseKey = (globalThis as any).Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function logAuditEvent(auditLog: AuditLog): Promise<boolean> {
  try {
    const { error } = await supabase.from("audit_logs").insert([
      {
        user_id: auditLog.user_id,
        action: auditLog.action,
        resource_type: auditLog.resource_type,
        resource_id: auditLog.resource_id,
        details: auditLog.details,
        ip_address: auditLog.ip_address,
        user_agent: auditLog.user_agent,
      },
    ]);

    if (error) {
      console.error("Error logging audit event:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Audit logging error:", error);
    return false;
  }
}

async function getSystemStats(): Promise<SystemStats | null> {
  try {
    // Get user statistics
    const { data: userStats } = await supabase
      .from("users")
      .select("role, is_active, created_at");

    if (!userStats) return null;

    const totalUsers = userStats.length;
    const activeUsers = userStats.filter((u) => u.is_active).length;
    const activeMerchants = userStats.filter(
      (u) => u.role === "MERCHANT" && u.is_active
    ).length;

    // Get transaction statistics
    const { data: transactionStats } = await supabase
      .from("wallet_transactions")
      .select("amount, currency, status, created_at");

    const totalTransactions = transactionStats?.length || 0;
    const totalVolume =
      transactionStats?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;

    // Get payment statistics
    const { data: paymentStats } = await supabase
      .from("payment_intents")
      .select("amount, status, created_at");

    const pendingPayments =
      paymentStats?.filter((p) => p.status === "PENDING").length || 0;
    const totalRevenue =
      paymentStats
        ?.filter((p) => p.status === "SUCCEEDED")
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      total_transactions: totalTransactions,
      total_volume: totalVolume,
      pending_payments: pendingPayments,
      active_merchants: activeMerchants,
      total_revenue: totalRevenue,
    };
  } catch (error) {
    console.error("Error getting system stats:", error);
    return null;
  }
}

async function getAllUsers(
  limit: number = 50,
  offset: number = 0,
  role?: string,
  isActive?: boolean
): Promise<any[]> {
  try {
    let query = supabase
      .from("users")
      .select(
        `
        id, email, role, is_active, verification_status, kyc_status,
        created_at, updated_at, profile:user_profiles(*)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) {
      query = query.eq("role", role);
    }

    if (isActive !== undefined) {
      query = query.eq("is_active", isActive);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}

async function updateUserStatus(
  userId: string,
  updates: UserUpdate,
  adminUserId: string,
  auditDetails: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, error: "Failed to update user" };
    }

    // Log audit event
    await logAuditEvent({
      user_id: adminUserId,
      action: "USER_UPDATE",
      resource_type: "USER",
      resource_id: userId,
      details: { updates, ...auditDetails },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return { success: false, error: "Internal server error" };
  }
}

async function getAuditLogs(
  limit: number = 100,
  offset: number = 0,
  userId?: string,
  action?: string,
  resourceType?: string
): Promise<AuditLog[]> {
  try {
    let query = supabase
      .from("audit_logs")
      .select(
        `
        *,
        user:users(email, role)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (action) {
      query = query.eq("action", action);
    }

    if (resourceType) {
      query = query.eq("resource_type", resourceType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAuditLogs:", error);
    return [];
  }
}

async function generateSystemReport(
  startDate: string,
  endDate: string
): Promise<{ success: boolean; report?: any; error?: string }> {
  try {
    // User growth statistics
    const { data: newUsers } = await supabase
      .from("users")
      .select("role, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    // Transaction volume by period
    const { data: transactions } = await supabase
      .from("wallet_transactions")
      .select("amount, currency, type, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    // Payment statistics
    const { data: payments } = await supabase
      .from("payment_intents")
      .select("amount, currency, status, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    const report = {
      period: { start: startDate, end: endDate },
      user_growth: {
        total_new_users: newUsers?.length || 0,
        by_role:
          newUsers?.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {},
      },
      transaction_volume: {
        total_transactions: transactions?.length || 0,
        total_volume:
          transactions?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0,
        by_type:
          transactions?.reduce((acc, tx) => {
            acc[tx.type] = (acc[tx.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {},
      },
      payment_statistics: {
        total_payments: payments?.length || 0,
        successful_payments:
          payments?.filter((p) => p.status === "SUCCEEDED").length || 0,
        failed_payments:
          payments?.filter((p) => p.status === "FAILED").length || 0,
        total_revenue:
          payments
            ?.filter((p) => p.status === "SUCCEEDED")
            .reduce((sum, p) => sum + p.amount, 0) || 0,
      },
    };

    return { success: true, report };
  } catch (error) {
    console.error("Error generating system report:", error);
    return { success: false, error: "Failed to generate report" };
  }
}

(globalThis as any).Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const method = req.method;
    const pathname = url.pathname;

    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return createUnauthorizedResponse();
    }

    if (!user.isActive) {
      return createForbiddenResponse();
    }

    // Admin-only operations
    if (!hasPermission(user.role, ["ADMIN"])) {
      return createForbiddenResponse();
    }

    // Get client IP for audit logging
    const clientIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Route handling
    if (pathname.endsWith("/stats")) {
      if (method === "GET") {
        const stats = await getSystemStats();
        if (!stats) {
          return new Response(
            JSON.stringify({ error: "Failed to fetch system statistics" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        await logAuditEvent({
          user_id: user.id,
          action: "VIEW_STATS",
          resource_type: "SYSTEM",
          ip_address: clientIP,
          user_agent: userAgent,
        });

        return new Response(JSON.stringify({ stats }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/users")) {
      if (method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const role = url.searchParams.get("role") || undefined;
        const isActive =
          url.searchParams.get("is_active") === "true"
            ? true
            : url.searchParams.get("is_active") === "false"
            ? false
            : undefined;

        const users = await getAllUsers(limit, offset, role, isActive);

        await logAuditEvent({
          user_id: user.id,
          action: "VIEW_USERS",
          resource_type: "USER",
          details: { filters: { role, is_active: isActive } },
          ip_address: clientIP,
          user_agent: userAgent,
        });

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.includes("/users/") && pathname.includes("/update")) {
      if (method === "PUT") {
        const userId =
          pathname.split("/")[pathname.split("/").indexOf("users") + 1];
        const body = await req.json();
        const { role, is_active, verification_status, kyc_status } = body;

        if (!userId) {
          return new Response(JSON.stringify({ error: "User ID required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const updates: UserUpdate = {};
        if (role !== undefined) updates.role = role;
        if (is_active !== undefined) updates.is_active = is_active;
        if (verification_status !== undefined)
          updates.verification_status = verification_status;
        if (kyc_status !== undefined) updates.kyc_status = kyc_status;

        const result = await updateUserStatus(userId, updates, user.id, {
          ip_address: clientIP,
          user_agent: userAgent,
        });

        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/audit-logs")) {
      if (method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "100");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const userId = url.searchParams.get("user_id") || undefined;
        const action = url.searchParams.get("action") || undefined;
        const resourceType = url.searchParams.get("resource_type") || undefined;

        const auditLogs = await getAuditLogs(
          limit,
          offset,
          userId,
          action,
          resourceType
        );

        await logAuditEvent({
          user_id: user.id,
          action: "VIEW_AUDIT_LOGS",
          resource_type: "AUDIT_LOG",
          details: {
            filters: { user_id: userId, action, resource_type: resourceType },
          },
          ip_address: clientIP,
          user_agent: userAgent,
        });

        return new Response(JSON.stringify({ audit_logs: auditLogs }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/reports/generate")) {
      if (method === "POST") {
        const body = await req.json();
        const { start_date, end_date } = body;

        if (!start_date || !end_date) {
          return new Response(
            JSON.stringify({ error: "Start date and end date required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const result = await generateSystemReport(start_date, end_date);

        await logAuditEvent({
          user_id: user.id,
          action: "GENERATE_REPORT",
          resource_type: "REPORT",
          details: { period: { start_date, end_date } },
          ip_address: clientIP,
          user_agent: userAgent,
        });

        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ report: result.report }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin operations error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
