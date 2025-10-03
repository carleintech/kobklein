"use client";

import { apiClient } from "@/lib/api-client";
import { WebSocketMessage } from "@/types/api-client";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
  reconnectAttempts: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
  maxReconnectAttempts?: number;
}

export function WebSocketProvider({
  children,
  autoConnect = true,
  maxReconnectAttempts = 5,
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const queryClient = useQueryClient();

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      // Handle different message types and update React Query cache
      switch (message.type) {
        case "wallet_balance_updated":
          queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
          break;

        case "transaction_status_changed":
        case "new_transaction":
          queryClient.invalidateQueries({
            queryKey: ["wallet", "transactions"],
          });
          queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
          break;

        case "notification":
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          break;

        case "merchant_sale":
          queryClient.invalidateQueries({ queryKey: ["merchant", "stats"] });
          break;

        case "distributor_update":
          queryClient.invalidateQueries({ queryKey: ["distributor", "stats"] });
          break;

        default:
          console.log("Unhandled WebSocket message type:", message.type);
      }
    },
    [queryClient]
  );

  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting");

      const ws = await apiClient.connectWebSocket({
        reconnect: true,
        maxReconnectAttempts: maxReconnectAttempts,
      });

      // Set up event handlers after connection
      ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus("connected");
        setReconnectAttempts(0);
        console.log("WebSocket connected");
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus("disconnected");
        console.log("WebSocket disconnected");

        // Auto-reconnect logic
        if (reconnectAttempts < maxReconnectAttempts) {
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            30000
          );
          setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, timeout);
        }
      };

      ws.onerror = (error: Event) => {
        setConnectionStatus("error");
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      setConnectionStatus("error");
      console.error("Failed to connect WebSocket:", error);
    }
  }, [reconnectAttempts, maxReconnectAttempts, handleWebSocketMessage]);

  const disconnect = useCallback(() => {
    apiClient.disconnectWebSocket();
    setIsConnected(false);
    setConnectionStatus("disconnected");
    setReconnectAttempts(0);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    try {
      apiClient.sendWebSocketMessage(message);
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  const value: WebSocketContextType = {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    lastMessage,
    reconnectAttempts,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

// Specific hooks for different types of real-time updates
export function useRealtimeTransactions() {
  const { lastMessage } = useWebSocket();
  const [realtimeTransaction, setRealtimeTransaction] = useState<any>(null);

  useEffect(() => {
    if (
      lastMessage?.type === "new_transaction" ||
      lastMessage?.type === "transaction_status_changed"
    ) {
      setRealtimeTransaction(lastMessage.data);
    }
  }, [lastMessage]);

  return realtimeTransaction;
}

export function useRealtimeBalance() {
  const { lastMessage } = useWebSocket();
  const [realtimeBalance, setRealtimeBalance] = useState<any>(null);

  useEffect(() => {
    if (lastMessage?.type === "wallet_balance_updated") {
      setRealtimeBalance(lastMessage.data);
    }
  }, [lastMessage]);

  return realtimeBalance;
}

export function useRealtimeNotifications() {
  const { lastMessage } = useWebSocket();
  const [realtimeNotification, setRealtimeNotification] = useState<any>(null);

  useEffect(() => {
    if (lastMessage?.type === "notification") {
      setRealtimeNotification(lastMessage.data);
    }
  }, [lastMessage]);

  return realtimeNotification;
}

