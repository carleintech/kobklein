import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role.toUpperCase();
    if (status) where.status = status.toUpperCase();

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          client_profiles: true,
          merchant_profiles: true,
          distributor_profiles: true,
          diaspora_profiles: true,
          wallets: true,
          _count: {
            select: {
              transactions_transactions_sender_idTousers: true,
              transactions_transactions_receiver_idTousers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        // profile: user.profile,
        // wallets: user.wallets,
        transactionCount: 0, // Fix later
        // user._count.transactions_transactions_sender_idTousers + user._count.transactions_transactions_receiver_idTousers,
        created_at: user.created_at,
        last_login_at: user.last_login_at,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, phoneNumber, country } =
      body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user with profile and wallet
    const user = await prisma.user.create({
      data: {
        email,
        password: password, // In real app, this should be hashed
        role: role || "CLIENT",
        status: "ACTIVE",
        first_name: firstName || "",
        last_name: lastName || "",
        phone: phoneNumber || "",
        country: country || "HT",
        language: "fr",
        // profile: {
        //   create: {
        //     firstName: firstName || "",
        //     lastName: lastName || "",
        //     phoneNumber: phoneNumber || "",
        //     country: country || "HT",
        //     preferredLanguage: "fr",
        //     timezone: "America/Port-au-Prince",
        //   },
        // },
        wallets: {
          create: {
            currency: "HTG",
            // type: "PRIMARY", // Remove this invalid field
            status: "ACTIVE",
            balance: 0,
            // balances: {
            //   create: {
            //     currency: "HTG",
            //     availableBalance: 0,
            //     pendingBalance: 0,
            //     totalBalance: 0,
            //   },
            // },
          },
        },
      },
      include: {
        client_profiles: true,
        merchant_profiles: true,
        distributor_profiles: true,
        diaspora_profiles: true,
        wallets: {
          include: {
            // balances: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          // profile: user.profile,
          // wallets: user.wallets,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
