import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingQRButton from "../components/FloatingQRButton";
import QuantumCharts from "../components/QuantumCharts";

const { width, height } = Dimensions.get("window");

// Revolutionary Adaptive Dashboard Component
export default function RevolutionaryDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole] = useState("Individual"); // Will be dynamic later

  // Quantum animation values
  const pulseAnimation = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);
  const floatAnimation = useSharedValue(0);

  // Initialize quantum animations
  useEffect(() => {
    // Pulse effect for holographic elements
    pulseAnimation.value = withRepeat(
      withSpring(1.1, { damping: 10, stiffness: 100 }),
      -1,
      true
    );

    // Rotation for AI insights
    rotateAnimation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );

    // Float animation for balance cards
    floatAnimation.value = withRepeat(
      withSpring(10, { damping: 8, stiffness: 80 }),
      -1,
      true
    );

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnimation.value }],
  }));

  // Revolutionary balance display
  const HolographicBalance = () => (
    <Animated.View style={[styles.balanceCard, floatStyle]}>
      <LinearGradient
        colors={["rgba(16, 185, 129, 0.1)", "rgba(5, 150, 105, 0.05)"]}
        style={styles.balanceGradient}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Animated.View style={rotateStyle}>
            <Ionicons name="sparkles" size={20} color="#10B981" />
          </Animated.View>
        </View>

        <Animated.View style={pulseStyle}>
          <Text style={styles.balanceAmount}>$12,847.32</Text>
        </Animated.View>

        <View style={styles.balanceChange}>
          <Ionicons name="trending-up" size={16} color="#10B981" />
          <Text style={styles.changeText}>+2.4% today</Text>
        </View>

        {/* Holographic effect overlay */}
        <View style={styles.holographicOverlay} />
      </LinearGradient>
    </Animated.View>
  );

  // AI-Powered Quick Actions
  const QuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {[
          {
            icon: "paper-plane",
            label: "Send",
            color: "#3B82F6",
            action: () => console.log("Send"),
          },
          {
            icon: "qr-code",
            label: "QR Scanner",
            color: "#8B5CF6",
            action: () => router.push("/qr-scanner"),
          },
          {
            icon: "analytics",
            label: "Charts",
            color: "#10B981",
            action: () => router.push("/interactive-charts"),
          },
          {
            icon: "swap-horizontal",
            label: "Exchange",
            color: "#F59E0B",
            action: () => console.log("Exchange"),
          },
          {
            icon: "card",
            label: "Pay",
            color: "#EF4444",
            action: () => console.log("Pay"),
          },
        ].map((action, index) => (
          <TouchableOpacity
            key={`${action.label}-${index}`}
            style={styles.actionButton}
            onPress={action.action}
          >
            <LinearGradient
              colors={[`${action.color}20`, `${action.color}10`]}
              style={styles.actionGradient}
            >
              <Ionicons
                name={action.icon as any}
                size={24}
                color={action.color}
              />
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Revolutionary Insights Panel
  const AIInsights = () => (
    <View style={styles.insightsPanel}>
      <View style={styles.insightsHeader}>
        <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
        <Animated.View style={rotateStyle}>
          <Ionicons name="bulb" size={20} color="#F59E0B" />
        </Animated.View>
      </View>

      <View style={styles.insightCard}>
        <LinearGradient
          colors={["rgba(245, 158, 11, 0.1)", "rgba(217, 119, 6, 0.05)"]}
          style={styles.insightGradient}
        >
          <Text style={styles.insightText}>
            💡 Based on your spending patterns, you could save $127 this month
            by optimizing recurring subscriptions.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#F59E0B" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  // Recent Activity with morphing animations
  const RecentActivity = () => (
    <View style={styles.activitySection}>
      <Text style={styles.sectionTitle}>📊 Recent Activity</Text>
      {[
        {
          type: "receive",
          amount: "+$250.00",
          desc: "Salary Deposit",
          time: "2h ago",
          icon: "arrow-down",
          color: "#10B981",
        },
        {
          type: "send",
          amount: "-$45.99",
          desc: "Grocery Store",
          time: "4h ago",
          icon: "arrow-up",
          color: "#EF4444",
        },
        {
          type: "exchange",
          amount: "$500.00",
          desc: "USD to EUR",
          time: "1d ago",
          icon: "swap-horizontal",
          color: "#F59E0B",
        },
      ].map((activity, index) => (
        <Animated.View key={index} style={[styles.activityItem, floatStyle]}>
          <View
            style={[
              styles.activityIcon,
              { backgroundColor: `${activity.color}20` },
            ]}
          >
            <Ionicons
              name={activity.icon as any}
              size={20}
              color={activity.color}
            />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityDesc}>{activity.desc}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
          <Text style={[styles.activityAmount, { color: activity.color }]}>
            {activity.amount}
          </Text>
        </Animated.View>
      ))}
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
          {/* Revolutionary Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>
                  Good{" "}
                  {currentTime.getHours() < 12
                    ? "Morning"
                    : currentTime.getHours() < 17
                    ? "Afternoon"
                    : "Evening"}
                </Text>
                <Text style={styles.userName}>Revolutionary User 🚀</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Animated.View style={pulseStyle}>
                  <Ionicons name="person-circle" size={40} color="#10B981" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Role indicator */}
            <View style={styles.roleIndicator}>
              <LinearGradient
                colors={["rgba(16, 185, 129, 0.2)", "rgba(5, 150, 105, 0.1)"]}
                style={styles.roleGradient}
              >
                <Ionicons name="diamond" size={16} color="#10B981" />
                <Text style={styles.roleText}>{userRole} Account</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Holographic Balance */}
          <HolographicBalance />

          {/* Quick Actions */}
          <QuickActions />

          {/* Quantum Charts */}
          <QuantumCharts />

          {/* AI Insights */}
          <AIInsights />

          {/* Recent Activity */}
          <RecentActivity />

          {/* Status Footer */}
          <View style={styles.statusFooter}>
            <Text style={styles.statusText}>
              ✨ Revolutionary Dashboard Active •{" "}
              {currentTime.toLocaleTimeString()}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Floating QR Button */}
      <FloatingQRButton />
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
    paddingBottom: 100, // Space for floating tab bar
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  greeting: {
    fontSize: 16,
    color: "#E0E7FF",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileButton: {
    padding: 4,
  },
  roleIndicator: {
    alignSelf: "flex-start",
  },
  roleGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  roleText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  balanceCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  balanceGradient: {
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  balanceLabel: {
    color: "#A5B4FC",
    fontSize: 16,
    fontWeight: "500",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  balanceChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  holographicOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    pointerEvents: "none",
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 15,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  insightsPanel: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  insightCard: {
    borderRadius: 15,
    overflow: "hidden",
  },
  insightGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  insightText: {
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  insightAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightActionText: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    color: "#A5B4FC",
    fontSize: 12,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusFooter: {
    alignItems: "center",
    paddingVertical: 20,
  },
  statusText: {
    color: "#A5B4FC",
    fontSize: 12,
    fontStyle: "italic",
  },
});
