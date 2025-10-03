"use client";

import { useEffect, useState } from "react";

export interface DevUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  avatar?: string;
  businessName?: string;
  location?: string;
  balance?: { htg: number; usd: number };
  networkSize?: number;
  permissions?: string[];
  description?: string;
}

export function useDevMode() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [devUser, setDevUser] = useState<DevUser | null>(null);

  useEffect(() => {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === "development";
    const hasDevUser = localStorage.getItem("dev-mode") === "true";
    const userDataString = localStorage.getItem("dev-user");

    setIsDevMode(isDev && hasDevUser);

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setDevUser(userData);
      } catch (error) {
        console.error("Failed to parse dev user data:", error);
        setDevUser(null);
      }
    }
  }, []);

  const clearDevMode = () => {
    localStorage.removeItem("dev-mode");
    localStorage.removeItem("dev-user");
    setIsDevMode(false);
    setDevUser(null);
  };

  const getCurrentUser = () => {
    if (isDevMode && devUser) {
      return {
        ...devUser,
        isDevUser: true,
      };
    }
    return null;
  };

  return {
    isDevMode,
    devUser,
    clearDevMode,
    getCurrentUser,
  };
}
