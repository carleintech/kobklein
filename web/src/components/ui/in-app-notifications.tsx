"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PushNotification } from "@/lib/push-notifications";
import { cn } from "@/lib/utils";
import {
  Bell,
  Clock,
  CreditCard,
  Gift,
  Settings as SettingsIcon,
  Shield,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface InAppNotificationProps {
  notification: PushNotification;
  onDismiss: () => void;
  onAction?: (actionId: string) => void;
}

function InAppNotification({
  notification,
  onDismiss,
  onAction,
}: InAppNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 5 seconds for non-urgent notifications
    if (
      notification.category !== "security" &&
      !notification.requireInteraction
    ) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "transaction":
        return <CreditCard className="h-5 w-5" />;
      case "security":
        return <Shield className="h-5 w-5" />;
      case "account":
        return <User className="h-5 w-5" />;
      case "promotions":
        return <Gift className="h-5 w-5" />;
      case "reminders":
        return <Clock className="h-5 w-5" />;
      case "system":
        return <SettingsIcon className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "transaction":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "security":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
      case "account":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "promotions":
        return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950";
      case "reminders":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";
      case "system":
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
    }
  };

  const handleAction = (actionId: string) => {
    if (onAction) {
      onAction(actionId);
    }
    onDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card
      className={cn(
        "border shadow-lg transition-all duration-300 ease-in-out",
        "animate-in slide-in-from-top-2 fade-in-50",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        getCategoryColor(notification.category)
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getCategoryIcon(notification.category)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.body}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="ml-2 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Additional content */}
            {notification.image && (
              <div className="mt-3">
                <img
                  src={notification.image}
                  alt=""
                  className="rounded-lg max-w-full h-auto max-h-32 object-cover"
                />
              </div>
            )}

            {/* Data display */}
            {notification.data && (
              <div className="mt-3 space-y-1">
                {notification.data.amount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ${notification.data.amount}{" "}
                      {notification.data.currency || "USD"}
                    </span>
                  </div>
                )}

                {notification.data.recipient && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">
                      {notification.data.recipient}
                    </span>
                  </div>
                )}

                {notification.data.timestamp && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {new Date(
                        notification.data.timestamp
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {notification.actions.map((action) => (
                  <Button
                    key={action.action}
                    size="sm"
                    variant={
                      action.action === "primary" ? "default" : "outline"
                    }
                    onClick={() => handleAction(action.action)}
                  >
                    {action.title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InAppNotificationManagerProps {
  maxNotifications?: number;
}

export function InAppNotificationManager({
  maxNotifications = 3,
}: InAppNotificationManagerProps) {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);

  useEffect(() => {
    const handleInAppNotification = (event: CustomEvent<PushNotification>) => {
      const notification = event.detail;

      setNotifications((prev) => {
        // Remove old notifications if we exceed the limit
        const newNotifications = [...prev, notification];
        return newNotifications.slice(-maxNotifications);
      });

      // Trigger vibration if supported and enabled
      if (notification.vibrate && "vibrate" in navigator) {
        navigator.vibrate(notification.vibrate);
      }
    };

    window.addEventListener(
      "in-app-notification",
      handleInAppNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "in-app-notification",
        handleInAppNotification as EventListener
      );
    };
  }, [maxNotifications]);

  const handleDismiss = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleAction = (notificationId: string, actionId: string) => {
    // Handle notification actions
    console.log("Notification action:", { notificationId, actionId });

    // You can implement specific action handling here
    switch (actionId) {
      case "view":
        // Navigate to relevant page
        break;
      case "dismiss":
        handleDismiss(notificationId);
        break;
      case "primary":
        // Handle primary action
        break;
      default:
        console.log("Unknown action:", actionId);
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <InAppNotification
          key={notification.id}
          notification={notification}
          onDismiss={() => handleDismiss(notification.id)}
          onAction={(actionId) => handleAction(notification.id, actionId)}
        />
      ))}
    </div>
  );
}

// Test notification component for development
export function TestNotificationButton() {
  const [counter, setCounter] = useState(1);

  const sendTestNotification = () => {
    const testNotification: PushNotification = {
      id: `test-${counter}`,
      category: "transaction",
      title: "Test Notification",
      body: `This is test notification #${counter}`,
      data: {
        amount: "25.00",
        currency: "USD",
        recipient: "John Doe",
        timestamp: Date.now(),
      },
      actions: [
        { action: "view", title: "View Details" },
        { action: "dismiss", title: "Dismiss" },
      ],
      timestamp: Date.now(),
      vibrate: [200, 100, 200],
    };

    // Dispatch the test notification
    const event = new CustomEvent("in-app-notification", {
      detail: testNotification,
    });
    window.dispatchEvent(event);

    setCounter((prev) => prev + 1);
  };

  return (
    <Button onClick={sendTestNotification} variant="outline" size="sm">
      <Bell className="h-4 w-4 mr-2" />
      Test Notification
    </Button>
  );
}

