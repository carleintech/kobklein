import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma Client with global instance for development
declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// User creation and authentication helpers
export const createUser = async (userData: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: "CLIENT" | "MERCHANT" | "DISTRIBUTOR" | "DIASPORA" | "ADMIN";
}) => {
  // Hash the password
  const hashedPassword = await hashPassword(userData.password);

  // Create user with proper schema field names
  return prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      role: userData.role || "CLIENT",
      status: "PENDING_VERIFICATION",
      wallets: {
        create: {
          currency: "HTG",
          balance: 0,
          status: "ACTIVE",
        },
      },
    },
    include: {
      wallets: true,
    },
  });
};

export const validateUserPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (!user || !user.password) {
    return false;
  }

  return verifyPassword(password, user.password);
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      wallets: true,
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallets: true,
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  updateData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    language?: string;
  }
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...updateData,
      updated_at: new Date(),
    },
  });
};

// Transaction helpers
export const createTransaction = async (transactionData: {
  sender_id: string;
  receiver_id: string;
  sender_wallet_id: string;
  receiver_wallet_id: string;
  amount: number;
  currency: string;
  type:
    | "SEND"
    | "RECEIVE"
    | "REFILL"
    | "WITHDRAW"
    | "PAYMENT"
    | "COMMISSION"
    | "FEE"
    | "EXCHANGE";
  method:
    | "NFC"
    | "QR_CODE"
    | "CARD"
    | "BANK_TRANSFER"
    | "CASH"
    | "APPLE_PAY"
    | "GOOGLE_PAY";
  description?: string;
}) => {
  // Generate a unique reference
  const reference = `TXN-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  return prisma.transaction.create({
    data: {
      sender_id: transactionData.sender_id,
      receiver_id: transactionData.receiver_id,
      sender_wallet_id: transactionData.sender_wallet_id,
      receiver_wallet_id: transactionData.receiver_wallet_id,
      amount: transactionData.amount,
      currency: transactionData.currency,
      type: transactionData.type,
      method: transactionData.method,
      status: "PENDING",
      description: transactionData.description || "",
      reference,
      fee: 0,
      metadata: {},
    },
  });
};

export const getTransactionsByUserId = async (userId: string) => {
  return prisma.transaction.findMany({
    where: {
      OR: [{ sender_id: userId }, { receiver_id: userId }],
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

// Wallet balance helpers
export const updateWalletBalance = async (
  userId: string,
  currency: string,
  amount: number,
  operation: "ADD" | "SUBTRACT"
) => {
  const wallet = await prisma.wallet.findFirst({
    where: {
      user_id: userId,
      currency,
      status: "ACTIVE",
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const currentBalance = Number(wallet.balance);
  const newBalance =
    operation === "ADD" ? currentBalance + amount : currentBalance - amount;

  if (newBalance < 0) {
    throw new Error("Insufficient funds");
  }

  return prisma.wallet.update({
    where: {
      id: wallet.id,
    },
    data: {
      balance: newBalance,
      updated_at: new Date(),
    },
  });
};

export const getWalletByUserId = async (
  userId: string,
  currency: string = "HTG"
) => {
  return prisma.wallet.findFirst({
    where: {
      user_id: userId,
      currency,
      status: "ACTIVE",
    },
  });
};

// KYC helpers
export const createKYCDocument = async (
  userId: string,
  documentType:
    | "PASSPORT"
    | "NATIONAL_ID"
    | "DRIVERS_LICENSE"
    | "UTILITY_BILL"
    | "BIRTH_CERTIFICATE",
  documentNumber?: string,
  documentUrl?: string
) => {
  return prisma.kYCVerification.create({
    data: {
      user_id: userId,
      document_type: documentType,
      document_number: documentNumber || "",
      document_url: documentUrl || "",
      status: "PENDING",
      verification_data: {},
    },
  });
};

export const updateKYCStatus = async (
  userId: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  rejectionReason?: string
) => {
  return prisma.kYCVerification.update({
    where: { user_id: userId },
    data: {
      status,
      rejection_reason: rejectionReason,
      reviewed_at: new Date(),
      updated_at: new Date(),
    },
  });
};

// Audit log helper
export const createAuditLog = async (
  userId: string,
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "TRANSACTION"
    | "ADMIN_ACTION",
  resource: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress: string = "0.0.0.0",
  userAgent?: string
) => {
  return prisma.auditLog.create({
    data: {
      user_id: userId,
      action,
      resource,
      resource_id: resourceId,
      old_values: oldValues || {},
      new_values: newValues || {},
      ip_address: ipAddress,
      user_agent: userAgent || "",
      metadata: {},
    },
  });
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

// User security helpers (Note: These fields don't exist in the current schema)
// These functions are placeholders and may need adjustment based on actual requirements
export const incrementLoginAttempts = async (email: string) => {
  // Note: login_attempts field doesn't exist in current schema
  // This would need to be added to the User model or handled differently
  return prisma.user.update({
    where: { email },
    data: {
      updated_at: new Date(),
    },
  });
};

export const resetLoginAttempts = async (email: string) => {
  // Reset login attempts after successful login
  return prisma.user.update({
    where: { email },
    data: {
      last_login_at: new Date(),
      updated_at: new Date(),
    },
  });
};

export const lockUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: "SUSPENDED",
      updated_at: new Date(),
    },
  });
};

export const unlockUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: "ACTIVE",
      updated_at: new Date(),
    },
  });
};

export { prisma };
export default prisma;
