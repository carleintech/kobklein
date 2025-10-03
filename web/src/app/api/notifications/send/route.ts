import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// Configure web-push (you'll need to set these environment variables)
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    "mailto:notifications@kobklein.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

// Send push notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notification } = body;

    // Validate required fields
    if (!userId || !notification) {
      return NextResponse.json(
        { error: "Missing required notification data" },
        { status: 400 }
      );
    }

    // In a real app, get user's subscriptions from database
    // const subscriptions = await getUserSubscriptions(userId);

    // For demo purposes, we'll just log the notification
    console.log("Sending push notification:", {
      userId,
      notification: {
        title: notification.title,
        body: notification.body,
        category: notification.category,
      },
    });

    // Example of sending to actual subscriptions:
    /*
    const promises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth
            }
          },
          JSON.stringify(notification)
        );
        return { success: true, endpoint: sub.endpoint };
      } catch (error) {
        console.error('Failed to send to endpoint:', sub.endpoint, error);
        return { success: false, endpoint: sub.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    */

    // For now, return success
    const results = [
      { success: true, message: "Notification logged for development" },
    ];

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
      results,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    });
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

// Get notification history (for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // In a real app, get notification history from database
    // const notifications = await getNotificationHistory(userId);

    // Return mock data for development
    const mockNotifications = [
      {
        id: "1",
        title: "Transaction Completed",
        body: "Your payment to John Doe has been processed",
        category: "transaction",
        timestamp: Date.now() - 3600000, // 1 hour ago
        read: false,
      },
      {
        id: "2",
        title: "Security Alert",
        body: "New login detected from iPhone",
        category: "security",
        timestamp: Date.now() - 7200000, // 2 hours ago
        read: true,
      },
    ];

    return NextResponse.json({
      notifications: mockNotifications,
      total: mockNotifications.length,
      unread: mockNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Failed to get notification history:", error);
    return NextResponse.json(
      { error: "Failed to get notifications" },
      { status: 500 }
    );
  }
}
