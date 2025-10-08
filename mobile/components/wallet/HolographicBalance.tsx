/**
 * 💰 HOLOGRAPHIC BALANCE COMPONENT
 * Revolutionary 3D balance display with currency morphing and quantum effects
 * Features: Multi-currency 3D rotation, predictive balance, holographic numbers
 */

import { Ionicons } from "@expo/vector-icons";
import { Canvas } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AdaptiveUX, ThemeColors } from "../../types/theme";

const { width } = Dimensions.get("window");

interface HolographicBalanceProps {
  balance: number;
  currency: string;
  theme: ThemeColors;
  adaptiveUX: AdaptiveUX;
  hideBalance?: boolean;
  onToggleVisibility?: () => void;
  onCurrencyChange?: () => void;
  predictedChange?: number;
  secondaryCurrencies?: Array<{
    code: string;
    balance: number;
    rate: number;
  }>;
}

export const HolographicBalance: React.FC<HolographicBalanceProps> = ({
  balance,
  currency,
  theme,
  adaptiveUX,
  hideBalance = false,
  onToggleVisibility,
  onCurrencyChange,
  predictedChange = 0,
  secondaryCurrencies = [],
}) => {
  // Holographic Animation Values
  const balanceScale = useSharedValue(1);
  const hologramRotation = useSharedValue(0);
  const glowPulse = useSharedValue(0.5);
  const currencyRotateY = useSharedValue(0);
  const numbersFloat = useSharedValue(0);
  const predictionOpacity = useSharedValue(0);

  // State
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!hideBalance);

  // All currencies including primary
  const allCurrencies = [
    { code: currency, balance, rate: 1 },
    ...secondaryCurrencies,
  ];

  useEffect(() => {
    initializeHolographicEffects();
  }, []);

  useEffect(() => {
    if (predictedChange !== 0) {
      showPrediction();
    }
  }, [predictedChange]);

  const initializeHolographicEffects = () => {
    // Continuous holographic rotation
    hologramRotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    // Glow pulse effect
    glowPulse.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);

    // Floating numbers effect
    numbersFloat.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  };

  const showPrediction = () => {
    predictionOpacity.value = withTiming(1, { duration: 500 });
    setTimeout(() => {
      predictionOpacity.value = withTiming(0, { duration: 1000 });
    }, 3000);
  };

  const handleBalancePress = () => {
    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    balanceScale.value = withSpring(0.95, { damping: 20 });
    setTimeout(() => {
      balanceScale.value = withSpring(1);
      setIsVisible(!isVisible);
      onToggleVisibility?.();
    }, 100);
  };

  const handleCurrencySwitch = () => {
    if (allCurrencies.length <= 1) return;

    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // 3D currency rotation animation
    currencyRotateY.value = withTiming(90, { duration: 200 }, () => {
      runOnJS(() => {
        const nextIndex = (currentCurrencyIndex + 1) % allCurrencies.length;
        setCurrentCurrencyIndex(nextIndex);
      })();
      currencyRotateY.value = withTiming(0, { duration: 200 });
    });

    onCurrencyChange?.();
  };

  // Animation Styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: balanceScale.value },
        { rotateZ: `${hologramRotation.value * 0.1}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const glowIntensity = interpolate(glowPulse.value, [0, 1], [0.3, 0.8]);

    return {
      opacity: glowIntensity,
      shadowRadius: interpolate(glowIntensity, [0.3, 0.8], [8, 20]),
      shadowColor: theme.primary,
    };
  });

  const numbersStyle = useAnimatedStyle(() => {
    const floatY = interpolate(numbersFloat.value, [0, 1], [0, -2]);

    return {
      transform: [{ translateY: floatY }],
    };
  });

  const currencyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${currencyRotateY.value}deg` },
      ],
    };
  });

  const predictionStyle = useAnimatedStyle(() => {
    return {
      opacity: predictionOpacity.value,
      transform: [
        {
          translateY: interpolate(predictionOpacity.value, [0, 1], [10, 0]),
        },
      ],
    };
  });

  const currentCurrency = allCurrencies[currentCurrencyIndex];
  const formattedBalance = isVisible
    ? formatCurrency(currentCurrency.balance, currentCurrency.code)
    : "••••••";

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Holographic Background */}
      <View style={styles.holographicBackground}>
        <LinearGradient
          colors={[
            `${theme.primary}15`,
            `${theme.primary}08`,
            `${theme.primary}15`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />

        {/* Quantum Grid Overlay */}
        <Canvas style={styles.quantumGrid}>
          {/* Quantum grid pattern would be rendered here */}
        </Canvas>
      </View>

      {/* Main Balance Display */}
      <TouchableOpacity
        style={styles.balanceContainer}
        onPress={handleBalancePress}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.balanceContent, glowStyle]}>
          {/* Balance Label */}
          <Text style={[styles.balanceLabel, { color: theme.text_secondary }]}>
            Available Balance
          </Text>

          {/* Currency Symbol & Balance */}
          <View style={styles.balanceRow}>
            <Animated.View style={[styles.currencyContainer, currencyStyle]}>
              <TouchableOpacity
                onPress={handleCurrencySwitch}
                style={styles.currencyButton}
              >
                <Text style={[styles.currencySymbol, { color: theme.primary }]}>
                  {getCurrencySymbol(currentCurrency.code)}
                </Text>
                {allCurrencies.length > 1 && (
                  <Ionicons
                    name="swap-horizontal"
                    size={16}
                    color={theme.text_secondary}
                    style={styles.swapIcon}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.balanceNumbers, numbersStyle]}>
              <Text
                style={[styles.balanceAmount, { color: theme.text_primary }]}
              >
                {formattedBalance}
              </Text>
            </Animated.View>

            {/* Balance Visibility Toggle */}
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={handleBalancePress}
            >
              <Ionicons
                name={isVisible ? "eye" : "eye-off"}
                size={20}
                color={theme.text_secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Predictive Balance Change */}
          {predictedChange !== 0 && (
            <Animated.View
              style={[styles.predictionContainer, predictionStyle]}
            >
              <LinearGradient
                colors={[
                  predictedChange > 0
                    ? `${theme.success}20`
                    : `${theme.error}20`,
                  "transparent",
                ]}
                style={styles.predictionGradient}
              >
                <Ionicons
                  name={predictedChange > 0 ? "trending-up" : "trending-down"}
                  size={14}
                  color={predictedChange > 0 ? theme.success : theme.error}
                />
                <Text
                  style={[
                    styles.predictionText,
                    {
                      color: predictedChange > 0 ? theme.success : theme.error,
                    },
                  ]}
                >
                  {predictedChange > 0 ? "+" : ""}
                  {formatCurrency(predictedChange, currentCurrency.code)}
                </Text>
                <Text
                  style={[
                    styles.predictionLabel,
                    { color: theme.text_secondary },
                  ]}
                >
                  predicted
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Secondary Currencies Carousel */}
      {secondaryCurrencies.length > 0 && isVisible && (
        <View style={styles.secondaryCurrencies}>
          {secondaryCurrencies.map((curr, index) => (
            <TouchableOpacity
              key={curr.code}
              style={[
                styles.secondaryCurrency,
                {
                  borderColor:
                    currentCurrencyIndex === index + 1
                      ? theme.primary
                      : theme.border,
                },
              ]}
              onPress={() => {
                setCurrentCurrencyIndex(index + 1);
                onCurrencyChange?.();
              }}
            >
              <Text
                style={[
                  styles.secondarySymbol,
                  { color: theme.text_secondary },
                ]}
              >
                {getCurrencySymbol(curr.code)}
              </Text>
              <Text
                style={[
                  styles.secondaryAmount,
                  { color: theme.text_secondary },
                ]}
              >
                {formatCurrency(curr.balance, curr.code)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Holographic Particles */}
      <View style={styles.particleContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                backgroundColor: theme.primary,
                left: `${index * 20 + 10}%`,
                animationDelay: `${index * 200}ms`,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Helper Functions
const getCurrencySymbol = (currencyCode: string): string => {
  const symbols = {
    USD: "$",
    HTG: "G",
    EUR: "€",
    CAD: "C$",
    GBP: "£",
  };
  return symbols[currencyCode] || currencyCode;
};

const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  holographicBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
    borderRadius: 20,
  },
  quantumGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceContainer: {
    padding: 24,
  },
  balanceContent: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    opacity: 0.8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyContainer: {
    marginRight: 8,
  },
  currencyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "700",
  },
  swapIcon: {
    marginLeft: 4,
  },
  balanceNumbers: {
    flex: 1,
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  visibilityToggle: {
    padding: 8,
    marginLeft: 8,
  },
  predictionContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  predictionGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  predictionText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 6,
  },
  predictionLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  secondaryCurrencies: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "center",
  },
  secondaryCurrency: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  secondarySymbol: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryAmount: {
    fontSize: 12,
    marginTop: 2,
  },
  particleContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 4,
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.6,
  },
});
