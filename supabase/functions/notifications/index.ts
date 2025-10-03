import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  authenticateUser,
  createForbiddenResponse,
  createUnauthorizedResponse,
  hasPermission,
} from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface NotificationPayload {
  id?: string;
  user_id: string;
  type: "EMAIL" | "SMS" | "PUSH" | "IN_APP";
  title: string;
  message: string;
  data?: Record<string, any>;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "READ";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  scheduled_at?: string;
  sent_at?: string;
  read_at?: string;
  created_at?: string;
}

interface EmailTemplate {
  template_id: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables?: Record<string, any>;
}

interface SMSPayload {
  to: string;
  message: string;
  from?: string;
}

const supabaseUrl = (globalThis as any).Deno.env.get("SUPABASE_URL")!;
const supabaseKey = (globalThis as any).Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!;
const twilioAccountSid = (globalThis as any).Deno.env.get(
  "TWILIO_ACCOUNT_SID"
)!;
const twilioAuthToken = (globalThis as any).Deno.env.get("TWILIO_AUTH_TOKEN")!;
const twilioPhoneNumber = (globalThis as any).Deno.env.get(
  "TWILIO_PHONE_NUMBER"
)!;
const sendgridApiKey = (globalThis as any).Deno.env.get("SENDGRID_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  templateId?: string,
  dynamicTemplateData?: Record<string, any>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const emailData: any = {
      personalizations: [
        {
          to: [{ email: to }],
          ...(dynamicTemplateData && {
            dynamic_template_data: dynamicTemplateData,
          }),
        },
      ],
      from: { email: "noreply@kobklein.com", name: "KobKlein" },
    };

    if (templateId) {
      emailData.template_id = templateId;
    } else {
      emailData.subject = subject;
      emailData.content = [{ type: "text/html", value: htmlContent }];
      if (textContent) {
        emailData.content.push({ type: "text/plain", value: textContent });
      }
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SendGrid error:", error);
      return { success: false, error: `SendGrid error: ${error}` };
    }

    const messageId = response.headers.get("X-Message-Id");
    return { success: true, messageId: messageId || undefined };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Email service error" };
  }
}

async function sendSMS(
  to: string,
  message: string,
  from?: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const fromNumber = from || twilioPhoneNumber;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${twilioAccountSid}:${twilioAuthToken}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio error:", error);
      return { success: false, error: `Twilio error: ${error}` };
    }

    const result = await response.json();
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("SMS sending error:", error);
    return { success: false, error: "SMS service error" };
  }
}

async function createNotificationRecord(
  notification: NotificationPayload
): Promise<NotificationPayload | null> {
  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        status: notification.status,
        priority: notification.priority,
        scheduled_at: notification.scheduled_at,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating notification record:", error);
    return null;
  }

  return data;
}

async function updateNotificationStatus(
  notificationId: string,
  status: NotificationPayload["status"],
  sentAt?: string
): Promise<boolean> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (sentAt) {
    updateData.sent_at = sentAt;
  }

  if (status === "READ") {
    updateData.read_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("notifications")
    .update(updateData)
    .eq("id", notificationId);

  if (error) {
    console.error("Error updating notification status:", error);
    return false;
  }

  return true;
}

async function getUserNotifications(
  userId: string,
  limit: number = 50,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<NotificationPayload[]> {
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (unreadOnly) {
    query = query.neq("status", "READ");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data || [];
}

async function sendBulkNotifications(
  userIds: string[],
  notification: Omit<NotificationPayload, "id" | "user_id">
): Promise<{ success: boolean; sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      const notificationRecord = await createNotificationRecord({
        ...notification,
        user_id: userId,
      });

      if (notificationRecord) {
        // Get user contact information
        const { data: user } = await supabase
          .from("users")
          .select("email, phone_number, notification_preferences")
          .eq("id", userId)
          .single();

        if (user) {
          const preferences = user.notification_preferences || {};

          // Send based on notification type and user preferences
          if (
            notification.type === "EMAIL" &&
            user.email &&
            preferences.email !== false
          ) {
            const emailResult = await sendEmail(
              user.email,
              notification.title,
              notification.message
            );

            if (emailResult.success) {
              await updateNotificationStatus(
                notificationRecord.id!,
                "SENT",
                new Date().toISOString()
              );
              sent++;
            } else {
              await updateNotificationStatus(notificationRecord.id!, "FAILED");
              failed++;
            }
          } else if (
            notification.type === "SMS" &&
            user.phone_number &&
            preferences.sms !== false
          ) {
            const smsResult = await sendSMS(
              user.phone_number,
              notification.message
            );

            if (smsResult.success) {
              await updateNotificationStatus(
                notificationRecord.id!,
                "SENT",
                new Date().toISOString()
              );
              sent++;
            } else {
              await updateNotificationStatus(notificationRecord.id!, "FAILED");
              failed++;
            }
          } else {
            // For IN_APP notifications, mark as sent immediately
            await updateNotificationStatus(
              notificationRecord.id!,
              "SENT",
              new Date().toISOString()
            );
            sent++;
          }
        }
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error);
      failed++;
    }
  }

  return { success: true, sent, failed };
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
    if (pathname.endsWith("/send")) {
      if (method === "POST") {
        // Send single notification
        const body = await req.json();
        const {
          recipient_id,
          type,
          title,
          message,
          data,
          priority,
          scheduled_at,
        } = body;

        if (!recipient_id || !type || !title || !message) {
          return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Check permissions - users can only send to themselves, admins/merchants can send to anyone
        if (
          recipient_id !== user.id &&
          !hasPermission(user.role, ["ADMIN", "MERCHANT"])
        ) {
          return createForbiddenResponse();
        }

        const notification = await createNotificationRecord({
          user_id: recipient_id,
          type,
          title,
          message,
          data,
          status: "PENDING",
          priority: priority || "NORMAL",
          scheduled_at,
        });

        if (!notification) {
          return new Response(
            JSON.stringify({ error: "Failed to create notification" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Send immediately if not scheduled
        if (!scheduled_at) {
          const { data: recipient } = await supabase
            .from("users")
            .select("email, phone_number, notification_preferences")
            .eq("id", recipient_id)
            .single();

          if (recipient) {
            let sent = false;

            if (type === "EMAIL" && recipient.email) {
              const result = await sendEmail(recipient.email, title, message);
              sent = result.success;
            } else if (type === "SMS" && recipient.phone_number) {
              const result = await sendSMS(recipient.phone_number, message);
              sent = result.success;
            } else if (type === "IN_APP") {
              sent = true; // In-app notifications are always "sent"
            }

            if (sent) {
              await updateNotificationStatus(
                notification.id!,
                "SENT",
                new Date().toISOString()
              );
            } else {
              await updateNotificationStatus(notification.id!, "FAILED");
            }
          }
        }

        return new Response(JSON.stringify({ notification }), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/bulk-send")) {
      if (method === "POST") {
        // Send bulk notifications - admin/merchant only
        if (!hasPermission(user.role, ["ADMIN", "MERCHANT"])) {
          return createForbiddenResponse();
        }

        const body = await req.json();
        const { user_ids, type, title, message, data, priority } = body;

        if (
          !user_ids ||
          !Array.isArray(user_ids) ||
          !type ||
          !title ||
          !message
        ) {
          return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const result = await sendBulkNotifications(user_ids, {
          type,
          title,
          message,
          data,
          status: "PENDING",
          priority: priority || "NORMAL",
        });

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.endsWith("/notifications")) {
      if (method === "GET") {
        // Get user notifications
        const targetUserId = url.searchParams.get("user_id") || user.id;
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const unreadOnly = url.searchParams.get("unread_only") === "true";

        if (targetUserId !== user.id && !hasPermission(user.role, ["ADMIN"])) {
          return createForbiddenResponse();
        }

        const notifications = await getUserNotifications(
          targetUserId,
          limit,
          offset,
          unreadOnly
        );
        return new Response(JSON.stringify({ notifications }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (pathname.includes("/mark-read/")) {
      if (method === "PUT") {
        // Mark notification as read
        const notificationId = pathname.split("/").pop();

        // Verify notification belongs to user (unless admin)
        const { data: notification } = await supabase
          .from("notifications")
          .select("user_id")
          .eq("id", notificationId)
          .single();

        if (!notification) {
          return new Response(
            JSON.stringify({ error: "Notification not found" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        if (
          notification.user_id !== user.id &&
          !hasPermission(user.role, ["ADMIN"])
        ) {
          return createForbiddenResponse();
        }

        const success = await updateNotificationStatus(notificationId!, "READ");

        if (!success) {
          return new Response(
            JSON.stringify({ error: "Failed to mark notification as read" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notifications error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
