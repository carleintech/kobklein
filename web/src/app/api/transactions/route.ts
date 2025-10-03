import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

interface TransactionRequestBody {
  fromUserId?: string;
  toUserId?: string;
  amount: number;
  currency: string;
  type:
    | "PAYMENT"
    | "TRANSFER"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "COMMISSION"
    | "FEE"
    | "REFUND";
  description?: string;
  paymentMethodId?: string;
}

// GET /api/transactions - Get transactions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const currency = searchParams.get("currency");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) {
      where.OR = [{ fromUserId: userId }, { toUserId: userId }];
    }
    if (type) where.type = type.toUpperCase();
    if (status) where.status = status.toUpperCase();
    if (currency) where.currency = currency.toUpperCase();

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          users_transactions_sender_idTousers: {
            include: {
              client_profiles: true,
              merchant_profiles: true,
              distributor_profiles: true,
              diaspora_profiles: true,
            },
          },
          users_transactions_receiver_idTousers: {
            include: {
              client_profiles: true,
              merchant_profiles: true,
              distributor_profiles: true,
              diaspora_profiles: true,
            },
          },
          wallets_transactions_sender_wallet_idTowallets: true,
          wallets_transactions_receiver_wallet_idTowallets: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body: TransactionRequestBody = await request.json();
    const {
      fromUserId,
      toUserId,
      amount,
      currency,
      type,
      description,
      paymentMethodId,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (!currency) {
      return NextResponse.json(
        { error: "Currency is required" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Transaction type is required" },
        { status: 400 }
      );
    }

    // For transfers and payments, validate users exist
    if (
      (type === "TRANSFER" || type === "PAYMENT") &&
      (!fromUserId || !toUserId)
    ) {
      return NextResponse.json(
        {
          error: "Both sender and receiver are required for transfers/payments",
        },
        { status: 400 }
      );
    }

    // Check if users exist
    if (fromUserId) {
      const fromUser = await prisma.user.findUnique({
        where: { id: fromUserId },
      });
      if (!fromUser) {
        return NextResponse.json(
          { error: "Sender user not found" },
          { status: 404 }
        );
      }
    }

    if (toUserId) {
      const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
      if (!toUser) {
        return NextResponse.json(
          { error: "Receiver user not found" },
          { status: 404 }
        );
      }
    }

    // Validate required fields
    if (!fromUserId || !toUserId) {
      return NextResponse.json(
        { error: "Sender and receiver IDs are required" },
        { status: 400 }
      );
    }

    // Get wallet IDs for sender and receiver
    const [senderWallet, receiverWallet] = await Promise.all([
      prisma.wallet.findFirst({
        where: { user_id: fromUserId, currency: currency },
      }),
      prisma.wallet.findFirst({
        where: { user_id: toUserId, currency: currency },
      }),
    ]);

    if (!senderWallet || !receiverWallet) {
      return NextResponse.json(
        { error: "Sender or receiver wallet not found" },
        { status: 400 }
      );
    }

    // Check wallet balance for debiting transactions
    if (["TRANSFER", "PAYMENT", "WITHDRAWAL"].includes(type)) {
      if (!senderWallet.balance || senderWallet.balance.lt(amount)) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        sender_id: fromUserId,
        receiver_id: toUserId,
        sender_wallet_id: senderWallet.id,
        receiver_wallet_id: receiverWallet.id,
        amount,
        currency: currency.toUpperCase(),
        type: type.toUpperCase() as any,
        status: "PENDING",
        method: "CARD", // Default method
        reference: `TXN-${Date.now()}`, // Generate unique reference
        description: description || "",
        fee: 0, // Calculate fees based on business logic
        metadata: {
          paymentMethodId,
          userAgent: request.headers.get("user-agent"),
          ipAddress: request.ip || request.headers.get("x-forwarded-for"),
        },
      },
      include: {
        users_transactions_sender_idTousers: {
          include: {
            client_profiles: true,
            merchant_profiles: true,
            distributor_profiles: true,
            diaspora_profiles: true,
          },
        },
        users_transactions_receiver_idTousers: {
          include: {
            client_profiles: true,
            merchant_profiles: true,
            distributor_profiles: true,
            diaspora_profiles: true,
          },
        },
      },
    });

    // Here you would typically:
    // 1. Process the transaction asynchronously
    // 2. Update wallet balances
    // 3. Send notifications
    // 4. Create audit logs

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
