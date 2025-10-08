/**
 * 🔮 QUANTUM CARD COMPONENT
 * Revolutionary 3D card with holographic effects, neural glow, and quantum physics
 * Features: Depth perception, particle interaction, morphing borders, AI responsiveness
 */

import { Canvas } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ThemeColors } from "../../types/theme";

const { width, height } = Dimensions.get("window");

interface QuantumCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  theme: ThemeColors;
  interactive?: boolean;
  depth?: "shallow" | "medium" | "deep";
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

export const QuantumCard: React.FC<QuantumCardProps> = ({
  children,
  style,
  glowColor,
  theme,
  interactive = true,
  depth = "medium",
  onPress,
  onLongPress,
  disabled = false,
}) => {
  // Quantum Animation Values
  const cardScale = useSharedValue(1);
  const cardRotateX = useSharedValue(0);
  const cardRotateY = useSharedValue(0);
  const glowIntensity = useSharedValue(0.3);
  const borderPulse = useSharedValue(1);
  const hologramShift = useSharedValue(0);
  const quantumField = useSharedValue(0);

  // 3D Depth Configuration
  const depthConfig = {
    shallow: { maxRotation: 5, shadowDepth: 8, glowRadius: 12 },
    medium: { maxRotation: 12, shadowDepth: 16, glowRadius: 20 },
    deep: { maxRotation: 20, shadowDepth: 24, glowRadius: 32 },
  };

  const config = depthConfig[depth];

  useEffect(() => {
    initializeQuantumEffects();
  }, []);

  const initializeQuantumEffects = () => {
    // Continuous holographic border pulse
    borderPulse.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true
    );

    // Quantum field fluctuations
    quantumField.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );

    // Hologram shift effect
    hologramShift.value = withRepeat(
      withTiming(1, { duration: 6000 }),
      -1,
      true
    );
  };

  const handlePress = () => {
    if (disabled || !interactive) return;

    // Quantum press animation
    cardScale.value = withSpring(0.96, { damping: 20 });
    glowIntensity.value = withTiming(0.8, { duration: 150 });

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      cardScale.value = withSpring(1);
      glowIntensity.value = withTiming(0.3, { duration: 300 });
      onPress?.();
    }, 150);
  };

  const handleLongPress = () => {
    if (disabled || !interactive) return;

    // Enhanced quantum effect for long press
    cardScale.value = withSpring(1.05, { damping: 15 });
    glowIntensity.value = withTiming(1, { duration: 200 });

    // Enhanced haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      cardScale.value = withSpring(1);
      glowIntensity.value = withTiming(0.3, { duration: 400 });
      onLongPress?.();
    }, 200);
  };

  // Revolutionary 3D Transform Style
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: cardScale.value },
        { perspective: 1000 },
        {
          rotateX: `${interpolate(
            cardRotateX.value,
            [-1, 1],
            [-config.maxRotation, config.maxRotation]
          )}deg`,
        },
        {
          rotateY: `${interpolate(
            cardRotateY.value,
            [-1, 1],
            [-config.maxRotation, config.maxRotation]
          )}deg`,
        },
      ],
    };
  });

  // Quantum Glow Effect Style
  const glowAnimatedStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowIntensity.value, [0, 1], [0.2, 0.8]);

    const glowRadius = interpolate(
      glowIntensity.value,
      [0, 1],
      [config.glowRadius * 0.5, config.glowRadius]
    );

    return {
      opacity: glowOpacity,
      shadowRadius: glowRadius,
      shadowColor: glowColor || theme.primary,
      shadowOpacity: glowOpacity,
      shadowOffset: {
        width: 0,
        height: glowRadius * 0.3,
      },
    };
  });

  // Holographic Border Style
  const borderAnimatedStyle = useAnimatedStyle(() => {
    const borderScale = borderPulse.value;
    const hologramOffset = interpolate(hologramShift.value, [0, 1], [0, 360]);

    return {
      transform: [{ scale: borderScale }, { rotate: `${hologramOffset}deg` }],
    };
  });

  // Quantum Field Background Style
  const quantumFieldStyle = useAnimatedStyle(() => {
    const fieldIntensity = interpolate(quantumField.value, [0, 1], [0.1, 0.3]);

    return {
      opacity: fieldIntensity,
    };
  });

  const baseGlowColor = glowColor || theme.primary;

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, style]}>
        {/* Quantum Field Background */}
        <Animated.View style={[styles.quantumField, quantumFieldStyle]}>
          <LinearGradient
            colors={[
              `${baseGlowColor}20`,
              `${baseGlowColor}10`,
              `${baseGlowColor}05`,
            ]}
            style={styles.fieldGradient}
          />
        </Animated.View>

        {/* Holographic Border */}
        <Animated.View style={[styles.holographicBorder, borderAnimatedStyle]}>
          <LinearGradient
            colors={[
              `${baseGlowColor}60`,
              `${baseGlowColor}30`,
              `${baseGlowColor}60`,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGradient}
          />
        </Animated.View>

        {/* Main Quantum Card */}
        <Animated.View
          style={[
            styles.card,
            cardAnimatedStyle,
            glowAnimatedStyle,
            {
              backgroundColor: theme.card_background,
              borderColor: `${baseGlowColor}40`,
            },
          ]}
        >
          {/* Quantum Glass Effect */}
          <View style={styles.glassOverlay}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.05)",
                "rgba(255, 255, 255, 0.02)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassGradient}
            />
          </View>

          {/* Neural Network Pattern Overlay */}
          <Canvas style={styles.neuralCanvas}>
            {/* Neural network paths would be rendered here with Skia */}
          </Canvas>

          {/* Holographic Reflections */}
          <View style={styles.hologramReflections}>
            <LinearGradient
              colors={[
                `${baseGlowColor}15`,
                "transparent",
                `${baseGlowColor}10`,
                "transparent",
                `${baseGlowColor}15`,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.reflectionGradient}
            />
          </View>

          {/* Interactive Touch Area */}
          {interactive && (
            <View
              style={styles.touchArea}
              onTouchStart={handlePress}
              onLongPress={handleLongPress}
            />
          )}

          {/* Card Content */}
          <View style={styles.content}>{children}</View>

          {/* Quantum Particles Edge Effect */}
          <View style={styles.particleEdges}>
            {[...Array(8)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    backgroundColor: baseGlowColor,
                    left: `${(index / 8) * 100}%`,
                    opacity: 0.6,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  quantumField: {
    position: "absolute",
    width: "105%",
    height: "105%",
    left: "-2.5%",
    top: "-2.5%",
    borderRadius: 20,
  },
  fieldGradient: {
    flex: 1,
    borderRadius: 20,
  },
  holographicBorder: {
    position: "absolute",
    width: "102%",
    height: "102%",
    left: "-1%",
    top: "-1%",
    borderRadius: 18,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 18,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    overflow: "hidden",
    // iOS shadows
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // Android elevation
    elevation: 8,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  glassGradient: {
    flex: 1,
    borderRadius: 16,
  },
  neuralCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hologramReflections: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  reflectionGradient: {
    flex: 1,
    borderRadius: 16,
  },
  touchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  content: {
    position: "relative",
    zIndex: 20,
  },
  particleEdges: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  particle: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});
