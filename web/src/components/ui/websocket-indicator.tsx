"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { RotateCcw, Wifi, WifiOff } from "lucide-react";
import React from "react";

interface WebSocketIndicatorProps {
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}

export function WebSocketIndicator({
  showLabel = false,
  size = "default",
}: WebSocketIndicatorProps) {
  const { isConnected, connectionStatus, connect, reconnectAttempts } =
    useWebSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          variant: "default" as const,
          icon: <Wifi className="h-3 w-3" />,
          label: "Connected",
          color: "text-green-600",
        };
      case "connecting":
        return {
          variant: "secondary" as const,
          icon: <RotateCcw className="h-3 w-3 animate-spin" />,
          label: "Connecting...",
          color: "text-yellow-600",
        };
      case "disconnected":
        return {
          variant: "outline" as const,
          icon: <WifiOff className="h-3 w-3" />,
          label: "Disconnected",
          color: "text-gray-600",
        };
      case "error":
        return {
          variant: "destructive" as const,
          icon: <WifiOff className="h-3 w-3" />,
          label: "Connection Error",
          color: "text-red-600",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: <WifiOff className="h-3 w-3" />,
          label: "Unknown",
          color: "text-gray-600",
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (!showLabel) {
    return (
      <div className="flex items-center space-x-1">
        <div className={statusConfig.color}>{statusConfig.icon}</div>
        {connectionStatus === "error" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={connect}
            className="h-6 px-2 text-xs"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={statusConfig.variant}
        className="flex items-center space-x-1"
      >
        {statusConfig.icon}
        <span>{statusConfig.label}</span>
      </Badge>
      {connectionStatus === "error" && reconnectAttempts > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={connect}
          className="h-6 px-2 text-xs"
        >
          Retry ({reconnectAttempts})
        </Button>
      )}
    </div>
  );
}

// Real-time transaction notification component
export function RealtimeTransactionNotification() {
  const { lastMessage } = useWebSocket();
  const [showNotification, setShowNotification] = React.useState(false);

  React.useEffect(() => {
    if (
      lastMessage?.type === "new_transaction" ||
      lastMessage?.type === "transaction_status_changed"
    ) {
      setShowNotification(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  if (!showNotification || !lastMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        <div className="text-sm font-medium">
          {lastMessage.type === "new_transaction"
            ? "New Transaction"
            : "Transaction Updated"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNotification(false)}
          className="h-6 w-6 p-0 ml-auto"
        >
          ×
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Real-time update received
      </div>
    </div>
  );
}

