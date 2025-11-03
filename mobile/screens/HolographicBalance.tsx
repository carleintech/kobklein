import { Ionicons } from "@expo/vector-icons";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
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
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function HolographicBalance() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Quantum animations
  const holographicPulse = useSharedValue(1);
  const particleRotation = useSharedValue(0);
  const balanceGlow = useSharedValue(0);
  const currencyFloat = useSharedValue(0);

  useEffect(() => {
    // Holographic pulse effect
    holographicPulse.value = withRepeat(
      withSpring(1.05, { damping: 15, stiffness: 200 }),
      -1,
      true
    );

    // Particle rotation
    particleRotation.value = withRepeat(
      withTiming(360, { duration: 15000 }),
      -1,
      false
    );

    // Balance glow effect
    balanceGlow.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);

    // Currency float
    currencyFloat.value = withRepeat(
      withSpring(8, { damping: 10, stiffness: 100 }),
      -1,
      true
    );
  }, []);

  // Animated styles
  const holographicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: holographicPulse.value }],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${particleRotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(balanceGlow.value, [0, 1], [0.6, 1]),
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: currencyFloat.value }],
  }));

  // 3D Holographic Balance Display
  const HolographicDisplay = () => (
    <View style={styles.holographicContainer}>
      <LinearGradient
        colors={[
          "rgba(16, 185, 129, 0.15)",
          "rgba(5, 150, 105, 0.08)",
          "rgba(6, 95, 70, 0.05)",
        ]}
        style={styles.holographicBackground}
      >
        {/* Quantum Particle Effects */}
        <View style={styles.particleContainer}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                particleStyle,
                {
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 12}%`,
                  animationDelay: `${i * 0.2}s`,
                },
              ]}
            >
              <View
                style={[styles.particleDot, { backgroundColor: "#10B981" }]}
              />
            </Animated.View>
          ))}
        </View>

        {/* Main Balance */}
        <Animated.View style={[styles.balanceCore, holographicStyle]}>
          <Text style={styles.balanceLabel}>Total Portfolio</Text>
          <Animated.View style={glowStyle}>
            <Text style={styles.mainBalance}>$12,847.32</Text>
          </Animated.View>
          <Text style={styles.balanceSubtext}>+$347.21 (2.78%) Today</Text>
        </Animated.View>

        {/* Holographic Grid Effect */}
        <Canvas style={styles.canvasOverlay}>
          <Group>
            {[...Array(10)].map((_, i) => (
              <Circle
                key={i}
                cx={width * 0.1 + i * width * 0.08}
                cy={height * 0.15}
                r={2}
                color="rgba(16, 185, 129, 0.3)"
              />
            ))}
          </Group>
        </Canvas>
      </LinearGradient>
    </View>
  );

  // Currency Portfolio
  const CurrencyPortfolio = () => (
    <View style={styles.portfolioContainer}>
      <Text style={styles.sectionTitle}>💎 Multi-Currency Portfolio</Text>

      {[
        {
          code: "USD",
          name: "US Dollar",
          amount: "8,250.00",
          percentage: "64%",
          color: "#10B981",
        },
        {
          code: "EUR",
          name: "Euro",
          amount: "2,847.32",
          percentage: "22%",
          color: "#3B82F6",
        },
        {
          code: "GBP",
          name: "British Pound",
          amount: "1,125.50",
          percentage: "9%",
          color: "#F59E0B",
        },
        {
          code: "JPY",
          name: "Japanese Yen",
          amount: "624.50",
          percentage: "5%",
          color: "#EF4444",
        },
      ].map((currency, index) => (
        <Animated.View
          key={currency.code}
          style={[styles.currencyCard, floatStyle]}
        >
          <TouchableOpacity
            onPress={() => setSelectedCurrency(currency.code)}
            style={[
              styles.currencyContent,
              selectedCurrency === currency.code && styles.selectedCurrency,
            ]}
          >
            <LinearGradient
              colors={[
                `${currency.color}20`,
                `${currency.color}10`,
                "rgba(255, 255, 255, 0.02)",
              ]}
              style={styles.currencyGradient}
            >
              <View style={styles.currencyHeader}>
                <View style={styles.currencyInfo}>
                  <Text
                    style={[styles.currencyCode, { color: currency.color }]}
                  >
                    {currency.code}
                  </Text>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                </View>
                <View style={styles.currencyStats}>
                  <Text style={styles.currencyAmount}>${currency.amount}</Text>
                  <Text
                    style={[
                      styles.currencyPercentage,
                      { color: currency.color },
                    ]}
                  >
                    {currency.percentage}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: currency.color,
                        width: currency.percentage,
                      },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  // Quantum Actions
  const QuantumActions = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>⚡ Quantum Actions</Text>

      <View style={styles.actionsGrid}>
        {[
          { icon: "add-circle", label: "Add Funds", color: "#10B981" },
          { icon: "remove-circle", label: "Withdraw", color: "#EF4444" },
          { icon: "swap-horizontal", label: "Exchange", color: "#F59E0B" },
          { icon: "trending-up", label: "Invest", color: "#8B5CF6" },
        ].map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton}>
            <LinearGradient
              colors={[`${action.color}25`, `${action.color}10`]}
              style={styles.actionGradient}
            >
              <Animated.View style={holographicStyle}>
                <Ionicons
                  name={action.icon as any}
                  size={32}
                  color={action.color}
                />
              </Animated.View>
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Holographic Balance</Text>
            <Text style={styles.headerSubtitle}>Quantum Financial Reality</Text>
          </View>

          {/* 3D Holographic Display */}
          <HolographicDisplay />

          {/* Currency Portfolio */}
          <CurrencyPortfolio />

          {/* Quantum Actions */}
          <QuantumActions />
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
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#A5B4FC",
    fontStyle: "italic",
  },
  holographicContainer: {
    margin: 20,
    borderRadius: 25,
    overflow: "hidden",
    height: 280,
  },
  holographicBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  particleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  particleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceCore: {
    alignItems: "center",
    zIndex: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#A5B4FC",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  mainBalance: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "#10B981",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
  },
  canvasOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  portfolioContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  currencyCard: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: "hidden",
  },
  currencyContent: {
    borderRadius: 15,
  },
  selectedCurrency: {
    borderWidth: 2,
    borderColor: "#10B981",
  },
  currencyGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    color: "#A5B4FC",
  },
  currencyStats: {
    alignItems: "flex-end",
  },
  currencyAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  currencyPercentage: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
});
