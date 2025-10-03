import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/wallets - Get user wallets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const currency = searchParams.get("currency");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const where: any = {
      userId,
      status: "ACTIVE",
    };
    if (currency) where.currency = currency.toUpperCase();

    const wallets = await prisma.wallet.findMany({
      where,
      include: {
        // balances: true, // Wallet has direct balance field
        users: {
          include: {
            client_profiles: true,
            merchant_profiles: true,
            distributor_profiles: true,
            diaspora_profiles: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ wallets });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

// POST /api/wallets - Create new wallet for user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currency, type } = body;

    if (!userId || !currency) {
      return NextResponse.json(
        { error: "User ID and currency are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a wallet for this currency
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        user_id: userId,
        currency: currency.toUpperCase(),
        status: "ACTIVE",
      },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "User already has an active wallet for this currency" },
        { status: 400 }
      );
    }

    // Create wallet with initial balance
    const wallet = await prisma.wallet.create({
      data: {
        user_id: userId,
        currency: currency.toUpperCase(),
        // type: type || "PRIMARY", // Remove invalid field
        status: "ACTIVE",
        balance: 0,
        // balances: {
        //   create: {
        //     currency: currency.toUpperCase(),
        //     availableBalance: 0,
        //     pendingBalance: 0,
        //     totalBalance: 0,
        //   },
        // },
      },
      include: {
        // balances: true, // Direct balance field
        users: {
          include: {
            client_profiles: true,
            merchant_profiles: true,
            distributor_profiles: true,
            diaspora_profiles: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Wallet created successfully",
        wallet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
