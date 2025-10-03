import { checkDatabaseHealth, prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/health - Database and system health check
export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    const dbHealth = await checkDatabaseHealth();

    // Check environment configuration
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      supabase: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
      nextauth: !!process.env.NEXTAUTH_SECRET,
    };

    // Count some basic entities to verify schema
    const [userCount, transactionCount, walletCount] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.wallet.count(),
    ]);

    const response = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      environment: process.env.NODE_ENV,
      database: {
        ...dbHealth,
        counts: {
          users: userCount,
          transactions: transactionCount,
          wallets: walletCount,
        },
      },
      configuration: envCheck,
      uptime: process.uptime(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
