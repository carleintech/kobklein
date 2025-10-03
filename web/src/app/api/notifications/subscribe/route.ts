import { NextRequest, NextResponse } from "next/server";

// Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys, deviceId, userId } = body;

    // Validate required fields
    if (!endpoint || !keys || !deviceId) {
      return NextResponse.json(
        { error: "Missing required subscription data" },
        { status: 400 }
      );
    }

    // In a real app, you would store this in your database
    // For now, we'll just log it and return success
    console.log("Push subscription received:", {
      endpoint,
      keys: {
        p256dh: keys.p256dh.substring(0, 20) + "...",
        auth: keys.auth.substring(0, 20) + "...",
      },
      deviceId,
      userId,
    });

    // Store subscription in database (implement this with your DB)
    // await storeSubscription({ endpoint, keys, deviceId, userId });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to push notifications",
        subscriptionId: `sub_${deviceId}_${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to process push subscription:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}

// Get subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID required" },
        { status: 400 }
      );
    }

    // In a real app, check if subscription exists in database
    // const subscription = await getSubscription(deviceId);

    return NextResponse.json({
      subscribed: false, // Replace with actual check
      deviceId,
      lastUpdate: null,
    });
  } catch (error) {
    console.error("Failed to get subscription status:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
