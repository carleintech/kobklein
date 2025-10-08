/**
 * 🌟 REVOLUTIONARY AUTH CONTEXT
 * The most advanced authentication system with AI behavioral analytics
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AdaptiveTheme,
  AdaptiveUXState,
  calculateAdaptiveUX,
  calculateQuantumPermissions,
  Permissions,
  predictNextAction,
  REVOLUTIONARY_THEMES,
  UserProfile,
  UserRole,
} from "../core/rbac";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  // Core Authentication
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Revolutionary Features
  permissions: Permissions;
  theme: AdaptiveTheme;
  adaptiveUX: AdaptiveUXState;
  predictedAction: string;
  behaviorScore: number;

  // Authentication Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;

  // Biometric Authentication
  enableBiometric: () => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;

  // AI-Powered Methods (REVOLUTIONARY)
  updateBehaviorPattern: (action: string) => void;
  adaptInterface: () => void;
  switchRole: (newRole: UserRole) => Promise<void>; // For hybrid users

  // Security
  lockApp: () => void;
  unlockApp: (method: "pin" | "biometric") => Promise<boolean>;
  isLocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const RevolutionaryAuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Core State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // Revolutionary State
  const [permissions, setPermissions] = useState<Permissions>(
    {} as Permissions
  );
  const [theme, setTheme] = useState<AdaptiveTheme>(
    REVOLUTIONARY_THEMES.individual
  );
  const [adaptiveUX, setAdaptiveUX] = useState<AdaptiveUXState>(
    {} as AdaptiveUXState
  );
  const [predictedAction, setPredictedAction] = useState("check_balance");
  const [behaviorScore, setBehaviorScore] = useState(75); // Default starting score

  // Refs for AI tracking
  const actionHistory = useRef<string[]>([]);
  const sessionStart = useRef<Date>(new Date());

  useEffect(() => {
    checkAuthState();
    startBehaviorTracking();
  }, []);

  useEffect(() => {
    if (user) {
      updateAdaptiveSettings();
    }
  }, [user, behaviorScore]);

  const checkAuthState = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error("Auth state check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          usage_patterns,
          merchant_data,
          distributor_data,
          diaspora_data
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUser(data);

      // Calculate behavior score from stored patterns
      const storedScore = await AsyncStorage.getItem(
        `behavior_score_${userId}`
      );
      setBehaviorScore(storedScore ? parseInt(storedScore) : 75);
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  };

  const updateAdaptiveSettings = () => {
    if (!user) return;

    // Calculate quantum permissions
    const newPermissions = calculateQuantumPermissions(
      user.role,
      user.verified_level,
      behaviorScore
    );
    setPermissions(newPermissions);

    // Set adaptive theme
    setTheme(REVOLUTIONARY_THEMES[user.role]);

    // Calculate adaptive UX
    const newAdaptiveUX = calculateAdaptiveUX(user);
    setAdaptiveUX(newAdaptiveUX);

    // Predict next action
    const nextAction = predictNextAction(user);
    setPredictedAction(nextAction);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        trackAction("sign_in");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with AI defaults
        const profile: Partial<UserProfile> = {
          id: data.user.id,
          email,
          phone,
          full_name: fullName,
          role,
          verified_level: "basic",
          country_code: "HT",
          preferred_currency: "HTG",
          wallet_balance: 0,
          risk_rating: "low",
          usage_patterns: {
            peak_hours: [],
            favorite_actions: [],
            transaction_frequency: "low",
            security_consciousness: 75,
          },
          predicted_needs: {
            likely_next_action: "check_balance",
            confidence_score: 50,
          },
        };

        await supabase.from("profiles").insert([profile]);
        await fetchUserProfile(data.user.id);
        trackAction("sign_up");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.clear();
      setUser(null);
      setIsLocked(false);
      trackAction("sign_out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // 🚀 REVOLUTIONARY BIOMETRIC AUTHENTICATION
  const enableBiometric = async (): Promise<boolean> => {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isAvailable || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric authentication for KobKlein",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (result.success) {
        await SecureStore.setItemAsync("biometric_enabled", "true");
        trackAction("enable_biometric");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Biometric setup error:", error);
      return false;
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access KobKlein",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
        trackAction("biometric_auth");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Biometric auth error:", error);
      return false;
    }
  };

  // 🧠 AI BEHAVIOR TRACKING (REVOLUTIONARY)
  const startBehaviorTracking = () => {
    sessionStart.current = new Date();
  };

  const updateBehaviorPattern = (action: string) => {
    trackAction(action);

    // Update behavior score based on action patterns
    const sessionDuration = Date.now() - sessionStart.current.getTime();
    const actionsPerMinute =
      actionHistory.current.length / (sessionDuration / 60000);

    // AI scoring algorithm
    let scoreAdjustment = 0;

    if (action.includes("security") || action.includes("biometric")) {
      scoreAdjustment += 2; // Security-conscious actions increase score
    }

    if (actionsPerMinute > 10) {
      scoreAdjustment -= 1; // Too many actions might indicate suspicious behavior
    }

    if (actionHistory.current.filter((a) => a === action).length > 5) {
      scoreAdjustment += 1; // Consistent usage patterns increase score
    }

    const newScore = Math.min(
      100,
      Math.max(0, behaviorScore + scoreAdjustment)
    );
    setBehaviorScore(newScore);

    // Store behavior score
    if (user) {
      AsyncStorage.setItem(`behavior_score_${user.id}`, newScore.toString());
    }
  };

  const trackAction = (action: string) => {
    actionHistory.current.push(action);

    // Keep only last 100 actions
    if (actionHistory.current.length > 100) {
      actionHistory.current = actionHistory.current.slice(-100);
    }

    // Update usage patterns in database
    if (user) {
      const currentHour = new Date().getHours();
      const updatedPatterns = {
        ...user.usage_patterns,
        peak_hours: Array.from(
          new Set([...user.usage_patterns.peak_hours, currentHour])
        ),
        favorite_actions: Array.from(
          new Set([...user.usage_patterns.favorite_actions, action])
        ),
      };

      supabase
        .from("profiles")
        .update({ usage_patterns: updatedPatterns })
        .eq("id", user.id)
        .then(() => {
          setUser((prev) =>
            prev ? { ...prev, usage_patterns: updatedPatterns } : prev
          );
        });
    }
  };

  const adaptInterface = () => {
    if (user) {
      updateAdaptiveSettings();
      trackAction("adapt_interface");
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", user.id);

      if (error) throw error;

      setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
      trackAction(`switch_role_${newRole}`);
    } catch (error) {
      console.error("Role switch error:", error);
    }
  };

  const lockApp = () => {
    setIsLocked(true);
    trackAction("lock_app");
  };

  const unlockApp = async (method: "pin" | "biometric"): Promise<boolean> => {
    if (method === "biometric") {
      return await authenticateWithBiometric();
    } else {
      // PIN unlock logic would go here
      setIsLocked(false);
      trackAction("unlock_pin");
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // Core
        user,
        isLoading,
        isAuthenticated: !!user,

        // Revolutionary Features
        permissions,
        theme,
        adaptiveUX,
        predictedAction,
        behaviorScore,

        // Methods
        signIn,
        signUp,
        signOut,
        enableBiometric,
        authenticateWithBiometric,
        updateBehaviorPattern,
        adaptInterface,
        switchRole,
        lockApp,
        unlockApp,
        isLocked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useRevolutionaryAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useRevolutionaryAuth must be used within RevolutionaryAuthProvider"
    );
  }
  return context;
};

// Alias for convenience
export const useAuth = useRevolutionaryAuth;
