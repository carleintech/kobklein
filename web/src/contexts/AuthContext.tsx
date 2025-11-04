"use client";

import {
  useLogin,
  useLogout,
  useRegister,
  useUpdateProfile,
  useUser,
} from "@/hooks/use-api";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: (failureCount: number, error: any) => {
        // Don't retry on 401 errors
        if (error?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // React Query hooks
  const {
    data: userData,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useUser({
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const updateProfileMutation = useUpdateProfile();

  // Check for existing token on mount
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Update authentication state based on token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kobklein_auth_tokens" || e.key === "auth_token") {
        const hasToken = !!e.newValue;
        setIsAuthenticated(hasToken);

        if (!hasToken) {
          // Token was removed, clear user data
          queryClient.clear();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success && result.data?.token) {
        apiClient.setToken(result.data.token);
        setIsAuthenticated(true);
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message || "Login failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local auth state
      apiClient.clearToken();
      setIsAuthenticated(false);
      queryClient.clear();
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) => {
    try {
      const result = await registerMutation.mutateAsync(userData);
      if (result.success && result.data?.token) {
        apiClient.setToken(result.data.token);
        setIsAuthenticated(true);
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message || "Registration failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      await updateProfileMutation.mutateAsync(userData);
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const refreshUser = () => {
    if (isAuthenticated) {
      refetchUser();
    }
  };

  const contextValue: AuthContextType = {
    user: userData?.data || null,
    isLoading:
      userLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export query client for use in other parts of the app
export { queryClient };

