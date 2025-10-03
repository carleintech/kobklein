"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/lib/push-notifications";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  CreditCard,
  Gift,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useState } from "react";

interface NotificationSettingsProps {
  onClose?: () => void;
  compact?: boolean;
}

export function NotificationSettings({
  onClose,
  compact = false,
}: NotificationSettingsProps) {
  const {
    isInitialized,
    isSubscribed,
    permission,
    categories,
    requestPermission,
    updateCategoryPreference,
    unsubscribe,
  } = usePushNotifications();

  const [isRequesting, setIsRequesting] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "normal":
        return "text-blue-500";
      case "low":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "high":
        return "High";
      case "normal":
        return "Normal";
      case "low":
        return "Low";
      default:
        return "Normal";
    }
  };

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      await requestPermission();
    } catch (error) {
      console.error("Failed to request permission:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    try {
      await unsubscribe();
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    updateCategoryPreference(categoryId, enabled);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Notifications</span>
          <div className="flex items-center space-x-2">
            {permission.granted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : permission.denied ? (
              <X className="h-4 w-4 text-destructive" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warning" />
            )}
            <span className="text-xs text-muted-foreground">
              {permission.granted
                ? "Enabled"
                : permission.denied
                ? "Denied"
                : "Not set"}
            </span>
          </div>
        </div>

        {permission.granted && (
          <div className="text-xs text-muted-foreground">
            {categories.filter((c) => c.enabled).length} of {categories.length}{" "}
            categories enabled
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Permission Status</h3>

          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              permission.granted
                ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
                : permission.denied
                ? "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
                : "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
            )}
          >
            <div className="flex items-center space-x-3">
              {permission.granted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : permission.denied ? (
                <BellOff className="h-5 w-5 text-destructive" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}

              <div>
                <p className="font-medium text-sm">
                  {permission.granted
                    ? "Notifications Enabled"
                    : permission.denied
                    ? "Notifications Blocked"
                    : "Permission Required"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {permission.granted
                    ? "You'll receive important updates"
                    : permission.denied
                    ? "Enable in browser settings to receive alerts"
                    : "Allow notifications to stay informed"}
                </p>
              </div>
            </div>

            {!permission.granted && !permission.denied && (
              <Button
                size="sm"
                onClick={handleRequestPermission}
                disabled={isRequesting || !permission.supported}
              >
                {isRequesting ? "Requesting..." : "Enable"}
              </Button>
            )}
          </div>

          {!permission.supported && (
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-muted-foreground">
                  Push notifications are not supported on this device
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Status */}
        {permission.granted && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Subscription</h3>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {isSubscribed ? "Active" : "Inactive"}
              </Badge>
            </div>

            {isSubscribed && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUnsubscribe}
                  disabled={isUnsubscribing}
                >
                  {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Notification Categories */}
        {permission.granted && categories.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Notification Categories</h3>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        category.enabled
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                      )}
                    >
                      {getCategoryIcon(category.id)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{category.name}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getPriorityColor(category.priority)
                          )}
                        >
                          {getPriorityLabel(category.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>

                      {category.vibration && (
                        <div className="flex items-center space-x-1 mt-1">
                          {category.enabled ? (
                            <Volume2 className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <VolumeX className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            Vibration
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Switch
                    checked={category.enabled}
                    onCheckedChange={(enabled) =>
                      handleCategoryToggle(category.id, enabled)
                    }
                    disabled={!isSubscribed}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {permission.denied && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">How to Enable Notifications</h3>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Chrome/Edge:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click the lock icon in the address bar</li>
                <li>Set Notifications to "Allow"</li>
                <li>Reload the page</li>
              </ul>

              <p>
                <strong>Safari:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Go to Safari → Settings → Websites</li>
                <li>Click Notifications</li>
                <li>Set this site to "Allow"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Statistics */}
        {permission.granted && isSubscribed && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Statistics</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-lg font-bold text-primary">
                  {categories.filter((c) => c.enabled).length}
                </p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-lg font-bold text-primary">
                  {
                    categories.filter(
                      (c) => c.enabled && c.priority === "urgent"
                    ).length
                  }
                </p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick notification toggle for navigation
export function NotificationToggle() {
  const { permission, isSubscribed } = usePushNotifications();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSettings(true)}
        className="relative"
      >
        {permission.granted ? (
          isSubscribed ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <Bell className="h-4 w-4 text-warning" />
        )}
      </Button>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur p-4 flex items-center justify-center">
          <NotificationSettings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </>
  );
}

