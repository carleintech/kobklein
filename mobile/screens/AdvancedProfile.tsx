import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface UserProfile {
  name: string;
  email: string;
  role: "Individual" | "Diaspora" | "Merchant" | "Distributor";
  avatar: string;
  verified: boolean;
  premiumMember: boolean;
}

export default function AdvancedProfile() {
  // User state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Revolutionary User",
    email: "user@kobklein.com",
    role: "Individual",
    avatar: "🚀",
    verified: true,
    premiumMember: true,
  });

  // Security settings
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Biometric capabilities
  const [biometricType, setBiometricType] = useState<string>("");
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  // Animations
  const securityPulse = useSharedValue(1);
  const roleRotation = useSharedValue(0);
  const settingFloat = useSharedValue(0);
  const premiumGlow = useSharedValue(0);

  useEffect(() => {
    checkBiometricCapabilities();
    initializeAnimations();
  }, []);

  const initializeAnimations = () => {
    // Security pulse animation
    securityPulse.value = withRepeat(
      withSpring(1.05, { damping: 15, stiffness: 200 }),
      -1,
      true
    );

    // Role rotation
    roleRotation.value = withRepeat(
      withTiming(360, { duration: 30000 }),
      -1,
      false
    );

    // Settings float
    settingFloat.value = withRepeat(
      withSpring(5, { damping: 12, stiffness: 100 }),
      -1,
      true
    );

    // Premium glow
    premiumGlow.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  };

  const checkBiometricCapabilities = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      setCanUseBiometric(compatible && enrolled);

      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        setBiometricType("Face ID");
      } else if (
        types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ) {
        setBiometricType("Fingerprint");
      } else {
        setBiometricType("Biometric");
      }
    } catch (error) {
      console.log("Biometric check error:", error);
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      if (hapticFeedback) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access security settings",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        if (hapticFeedback) {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        }
        Alert.alert(
          "✅ Authentication Successful",
          "Biometric authentication completed successfully!"
        );
      } else {
        if (hapticFeedback) {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
        }
        Alert.alert(
          "❌ Authentication Failed",
          "Biometric authentication was not successful."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Authentication error occurred.");
    }
  };

  const toggleBiometric = async () => {
    if (!biometricEnabled) {
      await authenticateWithBiometric();
    }
    setBiometricEnabled(!biometricEnabled);
  };

  const switchRole = (newRole: UserProfile["role"]) => {
    if (hapticFeedback) {
      Haptics.selectionAsync();
    }
    setUserProfile((prev) => ({ ...prev, role: newRole }));
    Alert.alert("🔄 Role Changed", `Switched to ${newRole} dashboard mode`);
  };

  // Animated styles
  const securityStyle = useAnimatedStyle(() => ({
    transform: [{ scale: securityPulse.value }],
  }));

  const roleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${roleRotation.value}deg` }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: settingFloat.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(premiumGlow.value, [0, 1], [0.3, 0.8]),
  }));

  // Profile Header Component
  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <LinearGradient
        colors={["rgba(16, 185, 129, 0.15)", "rgba(5, 150, 105, 0.08)"]}
        style={styles.headerGradient}
      >
        {/* Avatar and Info */}
        <View style={styles.avatarSection}>
          <Animated.View style={[styles.avatarContainer, glowStyle]}>
            <Text style={styles.avatarEmoji}>{userProfile.avatar}</Text>
            {userProfile.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              </View>
            )}
          </Animated.View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>

            {/* Premium Badge */}
            {userProfile.premiumMember && (
              <Animated.View style={[styles.premiumBadge, glowStyle]}>
                <LinearGradient
                  colors={[
                    "rgba(251, 191, 36, 0.3)",
                    "rgba(245, 158, 11, 0.2)",
                  ]}
                  style={styles.premiumGradient}
                >
                  <Ionicons name="diamond" size={14} color="#F59E0B" />
                  <Text style={styles.premiumText}>Premium Member</Text>
                </LinearGradient>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Role Selector */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Account Type</Text>
          <View style={styles.roleSelector}>
            {(
              ["Individual", "Diaspora", "Merchant", "Distributor"] as const
            ).map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => switchRole(role)}
                style={[
                  styles.roleButton,
                  userProfile.role === role && styles.activeRole,
                ]}
              >
                <Animated.View
                  style={userProfile.role === role ? roleStyle : {}}
                >
                  <Text
                    style={[
                      styles.roleText,
                      userProfile.role === role && styles.activeRoleText,
                    ]}
                  >
                    {role}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Security Settings Component
  const SecuritySettings = () => (
    <Animated.View style={[styles.settingsSection, floatStyle]}>
      <View style={styles.sectionHeader}>
        <Animated.View style={securityStyle}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
        </Animated.View>
        <Text style={styles.sectionTitle}>🔐 Security & Privacy</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Biometric Authentication */}
        <View style={styles.settingItem}>
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.1)", "rgba(5, 150, 105, 0.05)"]}
            style={styles.settingGradient}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name={
                    biometricType === "Face ID" ? "face-id" : "finger-print"
                  }
                  size={24}
                  color="#10B981"
                />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingTitle}>
                    {biometricType} Authentication
                  </Text>
                  <Text style={styles.settingDesc}>
                    {canUseBiometric
                      ? "Secure access with biometrics"
                      : "Not available on this device"}
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometric}
                trackColor={{ false: "#374151", true: "#10B98180" }}
                thumbColor={biometricEnabled ? "#10B981" : "#9CA3AF"}
                disabled={!canUseBiometric}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.settingItem}>
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.1)", "rgba(37, 99, 235, 0.05)"]}
            style={styles.settingGradient}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Ionicons name="key" size={24} color="#3B82F6" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingTitle}>
                    Two-Factor Authentication
                  </Text>
                  <Text style={styles.settingDesc}>
                    Extra security for your account
                  </Text>
                </View>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: "#374151", true: "#3B82F680" }}
                thumbColor={twoFactorEnabled ? "#3B82F6" : "#9CA3AF"}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Security Test Button */}
        <TouchableOpacity
          onPress={authenticateWithBiometric}
          style={styles.securityTest}
          disabled={!canUseBiometric}
        >
          <LinearGradient
            colors={
              canUseBiometric ? ["#10B981", "#059669"] : ["#6B7280", "#4B5563"]
            }
            style={styles.securityTestGradient}
          >
            <Ionicons name="scan" size={20} color="#FFFFFF" />
            <Text style={styles.securityTestText}>
              {canUseBiometric
                ? `Test ${biometricType}`
                : "Biometric Unavailable"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // App Settings Component
  const AppSettings = () => (
    <Animated.View style={[styles.settingsSection, floatStyle]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="settings" size={24} color="#8B5CF6" />
        <Text style={styles.sectionTitle}>⚙️ App Settings</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Push Notifications */}
        <View style={styles.settingItem}>
          <LinearGradient
            colors={["rgba(139, 92, 246, 0.1)", "rgba(124, 58, 237, 0.05)"]}
            style={styles.settingGradient}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color="#8B5CF6" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDesc}>
                    Receive important updates
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#374151", true: "#8B5CF680" }}
                thumbColor={pushNotifications ? "#8B5CF6" : "#9CA3AF"}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Dark Mode */}
        <View style={styles.settingItem}>
          <LinearGradient
            colors={["rgba(245, 158, 11, 0.1)", "rgba(217, 119, 6, 0.05)"]}
            style={styles.settingGradient}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon" size={24} color="#F59E0B" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDesc}>
                    Revolutionary dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#374151", true: "#F59E0B80" }}
                thumbColor={darkMode ? "#F59E0B" : "#9CA3AF"}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Haptic Feedback */}
        <View style={styles.settingItem}>
          <LinearGradient
            colors={["rgba(239, 68, 68, 0.1)", "rgba(220, 38, 38, 0.05)"]}
            style={styles.settingGradient}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Ionicons name="phone-portrait" size={24} color="#EF4444" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingDesc}>
                    Physical response to actions
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: "#374151", true: "#EF444480" }}
                thumbColor={hapticFeedback ? "#EF4444" : "#9CA3AF"}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );

  // Action Buttons
  const ActionButtons = () => (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (hapticFeedback) Haptics.selectionAsync();
          Alert.alert("🔄 Account", "Account management coming soon!");
        }}
      >
        <LinearGradient
          colors={["rgba(59, 130, 246, 0.2)", "rgba(37, 99, 235, 0.1)"]}
          style={styles.actionGradient}
        >
          <Ionicons name="person-circle" size={24} color="#3B82F6" />
          <Text style={[styles.actionText, { color: "#3B82F6" }]}>
            Manage Account
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (hapticFeedback) Haptics.selectionAsync();
          Alert.alert("💎 Premium", "Premium features coming soon!");
        }}
      >
        <LinearGradient
          colors={["rgba(245, 158, 11, 0.2)", "rgba(217, 119, 6, 0.1)"]}
          style={styles.actionGradient}
        >
          <Ionicons name="diamond" size={24} color="#F59E0B" />
          <Text style={[styles.actionText, { color: "#F59E0B" }]}>
            Upgrade Premium
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (hapticFeedback)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert("🚪 Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign Out",
              style: "destructive",
              onPress: () => router.replace("/"),
            },
          ]);
        }}
      >
        <LinearGradient
          colors={["rgba(239, 68, 68, 0.2)", "rgba(220, 38, 38, 0.1)"]}
          style={styles.actionGradient}
        >
          <Ionicons name="log-out" size={24} color="#EF4444" />
          <Text style={[styles.actionText, { color: "#EF4444" }]}>
            Sign Out
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0F2A6B", "#1E3A8A", "#1E40AF", "#3B82F6"]}
        style={styles.background}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <ProfileHeader />

          {/* Security Settings */}
          <SecuritySettings />

          {/* App Settings */}
          <AppSettings />

          {/* Action Buttons */}
          <ActionButtons />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    margin: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    position: "relative",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "rgba(15, 42, 107, 0.9)",
    borderRadius: 12,
    padding: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#A5B4FC",
    marginBottom: 10,
  },
  premiumBadge: {
    alignSelf: "flex-start",
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  premiumText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  roleSection: {
    alignItems: "center",
  },
  roleLabel: {
    fontSize: 16,
    color: "#A5B4FC",
    marginBottom: 15,
    fontWeight: "500",
  },
  roleSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeRole: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    borderColor: "#10B981",
  },
  roleText: {
    color: "#A5B4FC",
    fontSize: 14,
    fontWeight: "500",
  },
  activeRoleText: {
    color: "#10B981",
    fontWeight: "600",
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    borderRadius: 15,
    overflow: "hidden",
  },
  settingGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingDetails: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
    color: "#A5B4FC",
  },
  securityTest: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  securityTestGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  securityTestText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  actionsSection: {
    paddingHorizontal: 20,
    gap: 15,
  },
  actionButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});
