import { NextRequest, NextResponse } from "next/server";

// Unsubscribe from push notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, userId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID required" },
        { status: 400 }
      );
    }

    // In a real app, remove subscription from database
    // await removeSubscription(deviceId);

    console.log("Push unsubscription received:", { deviceId, userId });

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from push notifications",
    });
  } catch (error) {
    console.error("Failed to process unsubscription:", error);
    return NextResponse.json(
      { error: "Failed to process unsubscription" },
      { status: 500 }
    );
  }
}
