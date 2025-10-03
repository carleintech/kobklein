import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  authenticateUser,
  createForbiddenResponse,
  createUnauthorizedResponse,
  hasPermission,
} from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface WalletTransaction {
  id?: string;
  user_id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "PAYMENT" | "REFUND";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  description?: string;
  reference_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface WalletBalance {
  user_id: string;
  currency: string;
  balance: number;
  reserved_balance: number;
  last_updated: string;
}

const supabaseUrl = (globalThis as any).Deno.env.get("SUPABASE_URL")!;
const supabaseKey = (globalThis as any).Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getWalletBalance(
  userId: string,
  currency: string = "USD"
): Promise<WalletBalance | null> {
  const { data, error } = await supabase
    .from("wallet_balances")
    .select("*")
    .eq("user_id", userId)
    .eq("currency", currency)
    .single();

  if (error) {
    console.error("Error fetching wallet balance:", error);
    return null;
  }

  return data;
}

async function createTransaction(
  transaction: WalletTransaction
): Promise<WalletTransaction | null> {
  const { data, error } = await supabase
    .from("wallet_transactions")
    .insert([
      {
        user_id: transaction.user_id,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        description: transaction.description,
        reference_id: transaction.reference_id,
        metadata: transaction.metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    return null;
  }

  return data;
}

async function updateWalletBalance(
  userId: string,
  currency: string,
  amount: number,
  operation: "ADD" | "SUBTRACT"
): Promise<boolean> {
  try {
    // Use Supabase RPC for atomic balance updates
    const { error } = await supabase.rpc("update_wallet_balance", {
      p_user_id: userId,
      p_currency: currency,
      p_amount: operation === "ADD" ? amount : -amount,
    });

    if (error) {
      console.error("Error updating wallet balance:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateWalletBalance:", error);
    return false;
  }
}

async function getTransactionHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<WalletTransaction[]> {
  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }

  return data || [];
}

async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number,
  currency: string = "USD",
  description?: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Check sender's balance
    const senderBalance = await getWalletBalance(fromUserId, currency);
    if (!senderBalance || senderBalance.balance < amount) {
      return { success: false, error: "Insufficient funds" };
    }

    // Create transfer transaction
    const transferTransaction = await createTransaction({
      user_id: fromUserId,
      type: "TRANSFER",
      amount: -amount, // Negative for sender
      currency,
      status: "PENDING",
      description: description || `Transfer to user ${toUserId}`,
      metadata: { recipient_id: toUserId, transfer_type: "OUTGOING" },
    });

    if (!transferTransaction) {
      return { success: false, error: "Failed to create transfer transaction" };
    }

    // Create corresponding deposit transaction for recipient
    const depositTransaction = await createTransaction({
      user_id: toUserId,
      type: "TRANSFER",
      amount: amount, // Positive for recipient
      currency,
      status: "PENDING",
      description: description || `Transfer from user ${fromUserId}`,
      metadata: {
        sender_id: fromUserId,
        transfer_type: "INCOMING",
        reference_transaction: transferTransaction.id,
      },
    });

    if (!depositTransaction) {
      return { success: false, error: "Failed to create deposit transaction" };
    }

    // Update balances atomically
    const senderUpdate = await updateWalletBalance(
      fromUserId,
      currency,
      amount,
      "SUBTRACT"
    );
    const recipientUpdate = await updateWalletBalance(
      toUserId,
      currency,
      amount,
      "ADD"
    );

    if (!senderUpdate || !recipientUpdate) {
      return { success: false, error: "Failed to update wallet balances" };
    }

    // Update transaction statuses to completed
    await supabase
      .from("wallet_transactions")
      .update({ status: "COMPLETED" })
      .in("id", [transferTransaction.id, depositTransaction.id]);

    return {
      success: true,
      transactionId: transferTransaction.id,
    };
  } catch (error) {
    console.error("Error in transferFunds:", error);
    return { success: false, error: "Internal server error" };
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

    // Route handling
    if (pathname.endsWith("/balance")) {
      if (method === "GET") {
        // Get wallet balance - users can access their own balance, admins can access any
        const targetUserId = url.searchParams.get("user_id") || user.id;
        const currency = url.searchParams.get("currency") || "USD";

        if (targetUserId !== user.id && !hasPermission(user.role, ["ADMIN"])) {
          return createForbiddenResponse();
        }

        const balance = await getWalletBalance(targetUserId, currency);
        if (!balance) {
          return new Response(
            JSON.stringify({ error: "Wallet balance not found" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify({ balance }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/transactions")) {
      if (method === "GET") {
        // Get transaction history
        const targetUserId = url.searchParams.get("user_id") || user.id;
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        if (
          targetUserId !== user.id &&
          !hasPermission(user.role, ["ADMIN", "MERCHANT", "DISTRIBUTOR"])
        ) {
          return createForbiddenResponse();
        }

        const transactions = await getTransactionHistory(
          targetUserId,
          limit,
          offset
        );
        return new Response(JSON.stringify({ transactions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (method === "POST") {
        // Create new transaction (deposits, payments, etc.)
        if (!hasPermission(user.role, ["ADMIN", "MERCHANT", "DISTRIBUTOR"])) {
          return createForbiddenResponse();
        }

        const body = await req.json();
        const {
          type,
          amount,
          currency,
          description,
          reference_id,
          metadata,
          target_user_id,
        } = body;

        if (!type || !amount || amount <= 0) {
          return new Response(
            JSON.stringify({ error: "Invalid transaction data" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const userId = target_user_id || user.id;
        const transaction = await createTransaction({
          user_id: userId,
          type,
          amount,
          currency: currency || "USD",
          status: "PENDING",
          description,
          reference_id,
          metadata,
        });

        if (!transaction) {
          return new Response(
            JSON.stringify({ error: "Failed to create transaction" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Update balance for certain transaction types
        if (["DEPOSIT", "REFUND"].includes(type)) {
          await updateWalletBalance(userId, currency || "USD", amount, "ADD");
          await supabase
            .from("wallet_transactions")
            .update({ status: "COMPLETED" })
            .eq("id", transaction.id);
        }

        return new Response(JSON.stringify({ transaction }), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/transfer")) {
      if (method === "POST") {
        // Transfer funds between users
        const body = await req.json();
        const { to_user_id, amount, currency, description } = body;

        if (!to_user_id || !amount || amount <= 0) {
          return new Response(
            JSON.stringify({ error: "Invalid transfer data" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const result = await transferFunds(
          user.id,
          to_user_id,
          amount,
          currency || "USD",
          description
        );

        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({
            success: true,
            transaction_id: result.transactionId,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Wallet management error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
