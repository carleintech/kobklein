"use client";

import { supabase } from "@/lib/supabase";
import type { UserProfile, UserRole } from "@/types/auth";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      role?: UserRole;
    }
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      const response = await fetch(`/api/auth/profile?userId=${userId}`);
      if (response.ok) {
        const { user } = await response.json();
        return user;
      }

      // If profile doesn't exist (404), try to create it from Supabase user metadata
      if (response.status === 404) {
        console.log(
          "User profile not found in database, attempting to create..."
        );
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();

        if (supabaseUser) {
          const createResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: supabaseUser.id,
              email: supabaseUser.email,
              firstName: supabaseUser.user_metadata?.firstName || "",
              lastName: supabaseUser.user_metadata?.lastName || "",
              phoneNumber: supabaseUser.user_metadata?.phoneNumber || "",
              role: supabaseUser.user_metadata?.role || "CLIENT",
            }),
          });

          if (createResponse.ok) {
            console.log("User profile created successfully");
            // Fetch the newly created profile
            const newProfileResponse = await fetch(
              `/api/auth/profile?userId=${userId}`
            );
            if (newProfileResponse.ok) {
              const { user } = await newProfileResponse.json();
              return user;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setUser(userProfile);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      role?: UserRole;
    }
  ) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            phoneNumber: userData?.phoneNumber || "",
            role: userData?.role || "CLIENT",
          },
        },
      });

      if (error) {
        return { user: null, error };
      }

      // Create user profile in database via API
      if (data.user) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            phoneNumber: userData?.phoneNumber || "",
            role: userData?.role || "CLIENT",
          }),
        });

        if (!response.ok) {
          console.error("Failed to create user profile in database");
        }
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      // Update last login
      if (data.user) {
        await fetch("/api/auth/update-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
          }),
        });
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        setUser(null);
        setSession(null);
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const { user: updatedUser } = await response.json();
      setUser(updatedUser);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

