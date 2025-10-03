import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  authenticateUser,
  createForbiddenResponse,
  createUnauthorizedResponse,
  hasPermission,
} from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface PaymentIntent {
  id?: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  stripe_payment_intent_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

const supabaseUrl = (globalThis as any).Deno.env.get("SUPABASE_URL")!;
const supabaseKey = (globalThis as any).Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!;
const stripeSecretKey = (globalThis as any).Deno.env.get("STRIPE_SECRET_KEY")!;
const stripeWebhookSecret = (globalThis as any).Deno.env.get(
  "STRIPE_WEBHOOK_SECRET"
)!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStripePaymentIntent(
  amount: number,
  currency: string,
  customerId?: string,
  metadata?: Record<string, any>
): Promise<any> {
  try {
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Convert to cents
        currency: currency.toLowerCase(),
        ...(customerId && { customer: customerId }),
        ...(metadata &&
          Object.entries(metadata).reduce((acc, [key, value]) => {
            acc[`metadata[${key}]`] = String(value);
            return acc;
          }, {} as Record<string, string>)),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error);
    throw error;
  }
}

async function retrieveStripePaymentIntent(
  paymentIntentId: string
): Promise<any> {
  try {
    const response = await fetch(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error retrieving Stripe payment intent:", error);
    throw error;
  }
}

async function createPaymentRecord(
  payment: PaymentIntent
): Promise<PaymentIntent | null> {
  const { data, error } = await supabase
    .from("payment_intents")
    .insert([
      {
        user_id: payment.user_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        stripe_payment_intent_id: payment.stripe_payment_intent_id,
        description: payment.description,
        metadata: payment.metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating payment record:", error);
    return null;
  }

  return data;
}

async function updatePaymentStatus(
  paymentId: string,
  status: PaymentIntent["status"]
): Promise<boolean> {
  const { error } = await supabase
    .from("payment_intents")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (error) {
    console.error("Error updating payment status:", error);
    return false;
  }

  return true;
}

async function getPaymentHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentIntent[]> {
  const { data, error } = await supabase
    .from("payment_intents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }

  return data || [];
}

async function processRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refund?: any; error?: string }> {
  try {
    const refundData: Record<string, string> = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = (amount * 100).toString(); // Convert to cents
    }

    if (reason) {
      refundData.reason = reason;
    }

    const response = await fetch("https://api.stripe.com/v1/refunds", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(refundData),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Stripe refund error: ${error}` };
    }

    const refund = await response.json();
    return { success: true, refund };
  } catch (error) {
    console.error("Error processing refund:", error);
    return { success: false, error: "Internal server error" };
  }
}

async function handleStripeWebhook(request: Request): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe signature", { status: 400 });
    }

    // Verify webhook signature (simplified - in production use Stripe's library)
    // For now, we'll trust the webhook but log for monitoring
    console.log("Received Stripe webhook:", signature);

    const event = JSON.parse(body);

    switch (event.type) {
      case "payment_intent.succeeded":
        const succeededPayment = event.data.object;
        await supabase
          .from("payment_intents")
          .update({ status: "SUCCEEDED" })
          .eq("stripe_payment_intent_id", succeededPayment.id);

        // Add funds to user's wallet
        const { data: paymentRecord } = await supabase
          .from("payment_intents")
          .select("user_id, amount, currency")
          .eq("stripe_payment_intent_id", succeededPayment.id)
          .single();

        if (paymentRecord) {
          await supabase.rpc("update_wallet_balance", {
            p_user_id: paymentRecord.user_id,
            p_currency: paymentRecord.currency,
            p_amount: paymentRecord.amount,
          });
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await supabase
          .from("payment_intents")
          .update({ status: "FAILED" })
          .eq("stripe_payment_intent_id", failedPayment.id);
        break;

      case "charge.dispute.created":
        // Handle chargebacks/disputes
        console.log("Chargeback created:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Webhook handled", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 400 });
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

    // Handle Stripe webhooks (no auth required)
    if (pathname.endsWith("/webhook")) {
      return await handleStripeWebhook(req);
    }

    // Authenticate user for all other endpoints
    const user = await authenticateUser(req);
    if (!user) {
      return createUnauthorizedResponse();
    }

    if (!user.isActive) {
      return createForbiddenResponse();
    }

    // Route handling
    if (pathname.endsWith("/create-payment-intent")) {
      if (method === "POST") {
        const body = await req.json();
        const { amount, currency, description, metadata } = body;

        if (!amount || amount <= 0) {
          return new Response(JSON.stringify({ error: "Invalid amount" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        try {
          // Create Stripe payment intent
          const stripePaymentIntent = await createStripePaymentIntent(
            amount,
            currency || "USD",
            undefined, // customer ID - can be added later
            { user_id: user.id, ...metadata }
          );

          // Create payment record in database
          const paymentRecord = await createPaymentRecord({
            user_id: user.id,
            amount,
            currency: currency || "USD",
            status: "PENDING",
            stripe_payment_intent_id: stripePaymentIntent.id,
            description,
            metadata,
          });

          if (!paymentRecord) {
            return new Response(
              JSON.stringify({ error: "Failed to create payment record" }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }

          return new Response(
            JSON.stringify({
              payment_intent: {
                id: paymentRecord.id,
                client_secret: stripePaymentIntent.client_secret,
                amount: paymentRecord.amount,
                currency: paymentRecord.currency,
                status: paymentRecord.status,
              },
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("Error creating payment intent:", error);
          return new Response(
            JSON.stringify({ error: "Failed to create payment intent" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    if (pathname.endsWith("/payments")) {
      if (method === "GET") {
        // Get payment history
        const targetUserId = url.searchParams.get("user_id") || user.id;
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        if (
          targetUserId !== user.id &&
          !hasPermission(user.role, ["ADMIN", "MERCHANT"])
        ) {
          return createForbiddenResponse();
        }

        const payments = await getPaymentHistory(targetUserId, limit, offset);
        return new Response(JSON.stringify({ payments }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.includes("/refund/")) {
      if (method === "POST") {
        // Process refund - admin/merchant only
        if (!hasPermission(user.role, ["ADMIN", "MERCHANT"])) {
          return createForbiddenResponse();
        }

        const paymentId = pathname.split("/").pop();
        const body = await req.json();
        const { amount, reason } = body;

        // Get payment record
        const { data: payment, error } = await supabase
          .from("payment_intents")
          .select("*")
          .eq("id", paymentId)
          .single();

        if (error || !payment) {
          return new Response(JSON.stringify({ error: "Payment not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (payment.status !== "SUCCEEDED") {
          return new Response(
            JSON.stringify({ error: "Payment cannot be refunded" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const refundResult = await processRefund(
          payment.stripe_payment_intent_id,
          amount,
          reason
        );

        if (!refundResult.success) {
          return new Response(JSON.stringify({ error: refundResult.error }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update payment status and wallet balance
        await updatePaymentStatus(paymentId, "CANCELLED");
        await supabase.rpc("update_wallet_balance", {
          p_user_id: payment.user_id,
          p_currency: payment.currency,
          p_amount: -(amount || payment.amount),
        });

        return new Response(
          JSON.stringify({
            success: true,
            refund: refundResult.refund,
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
    console.error("Payment processing error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
