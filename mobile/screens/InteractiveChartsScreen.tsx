import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import {
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryBoxPlot,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryZoomContainer,
} from "victory-native";

const { width, height } = Dimensions.get("window");

interface AdvancedChartData {
  x: number;
  y: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

// Revolutionary Interactive Charts Screen
export default function InteractiveChartsScreen() {
  const [chartType, setChartType] = useState<
    "candlestick" | "volume" | "trend" | "correlation"
  >("trend");
  const [timeRange, setTimeRange] = useState<"1H" | "4H" | "1D" | "1W" | "1M">(
    "1D"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Advanced animation values
  const headerAnimation = useSharedValue(0);
  const chartAnimation = useSharedValue(0);
  const particleAnimation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Generate advanced financial data
  const generateAdvancedData = (): AdvancedChartData[] => {
    const basePrice = 1000;
    return Array.from({ length: 50 }, (_, i) => {
      const variance = Math.sin(i * 0.1) * 100 + Math.random() * 200 - 100;
      const price = basePrice + variance + i * 10;
      return {
        x: i + 1,
        y: price,
        volume: Math.random() * 1000000 + 500000,
        high: price + Math.random() * 50,
        low: price - Math.random() * 50,
        open: price + (Math.random() - 0.5) * 20,
        close: price + (Math.random() - 0.5) * 30,
      };
    });
  };

  const [chartData, setChartData] = useState<AdvancedChartData[]>(
    generateAdvancedData()
  );

  useEffect(() => {
    // Initialize animations
    headerAnimation.value = withTiming(1, { duration: 1000 });
    chartAnimation.value = withTiming(1, { duration: 1200 });

    particleAnimation.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      false
    );

    // Real-time data simulation
    const interval = setInterval(() => {
      setChartData(generateAdvancedData());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Gesture handlers for zoom and pan
  const pinchHandler = useAnimatedGestureHandler({
    onStart: () => {
      Haptics.selectionAsync();
    },
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(3, event.scale));
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnimation.value,
    transform: [
      {
        translateY: interpolate(headerAnimation.value, [0, 1], [-50, 0]),
      },
    ],
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartAnimation.value,
    transform: [
      { scale: scale.value },
      { translateX: translateX.value * 0.1 },
      { translateY: translateY.value * 0.1 },
    ],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      particleAnimation.value,
      [0, 0.3, 0.7, 1],
      [0.2, 0.8, 0.8, 0.2]
    ),
    transform: [
      {
        rotate: `${particleAnimation.value * 360}deg`,
      },
    ],
  }));

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3000);
  };

  const renderAdvancedChart = () => {
    const theme = {
      ...VictoryTheme.material,
      axis: {
        style: {
          axis: { stroke: "rgba(255, 255, 255, 0.3)" },
          tickLabels: { fill: "#E0E7FF", fontSize: 10 },
          grid: { stroke: "rgba(255, 255, 255, 0.08)" },
        },
      },
    };

    switch (chartType) {
      case "trend":
        return (
          <VictoryChart
            theme={theme}
            width={width - 20}
            height={300}
            padding={{ left: 60, right: 40, top: 20, bottom: 50 }}
            containerComponent={<VictoryZoomContainer />}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />

            {/* Background area */}
            <VictoryArea
              data={chartData}
              style={{
                data: {
                  fill: "rgba(16, 185, 129, 0.1)",
                  stroke: "transparent",
                },
              }}
            />

            {/* Main trend line */}
            <VictoryLine
              data={chartData}
              style={{
                data: {
                  stroke: "#10B981",
                  strokeWidth: 2,
                  filter: "drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.6))",
                },
              }}
              animate={{ duration: 1000 }}
            />

            {/* Scatter points for recent data */}
            <VictoryScatter
              data={chartData.slice(-10)}
              size={3}
              style={{
                data: {
                  fill: "#10B981",
                  filter: "drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.8))",
                },
              }}
            />
          </VictoryChart>
        );

      case "volume":
        return (
          <View>
            <VictoryChart
              theme={theme}
              width={width - 20}
              height={200}
              padding={{ left: 60, right: 40, top: 20, bottom: 40 }}
            >
              <VictoryAxis dependentAxis />
              <VictoryAxis />
              <VictoryLine
                data={chartData}
                style={{
                  data: { stroke: "#3B82F6", strokeWidth: 2 },
                }}
              />
            </VictoryChart>

            <VictoryChart
              theme={theme}
              width={width - 20}
              height={100}
              padding={{ left: 60, right: 40, top: 0, bottom: 40 }}
            >
              <VictoryAxis dependentAxis />
              <VictoryAxis />
              <VictoryBar
                data={chartData.map((d) => ({ x: d.x, y: d.volume || 0 }))}
                style={{
                  data: { fill: "rgba(59, 130, 246, 0.6)" },
                }}
              />
            </VictoryChart>
          </View>
        );

      case "candlestick":
        return (
          <VictoryChart
            theme={theme}
            width={width - 20}
            height={300}
            padding={{ left: 60, right: 40, top: 20, bottom: 50 }}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryBoxPlot
              data={chartData.map((d) => ({
                x: d.x,
                min: d.low || d.y - 20,
                q1: d.open || d.y - 10,
                median: d.y,
                q3: d.close || d.y + 10,
                max: d.high || d.y + 20,
              }))}
              boxWidth={8}
              style={{
                min: { stroke: "#EF4444" },
                max: { stroke: "#10B981" },
                q1: { fill: "#F59E0B" },
                q3: { fill: "#10B981" },
                median: { stroke: "#FFFFFF", strokeWidth: 2 },
              }}
            />
          </VictoryChart>
        );

      case "correlation":
        return (
          <VictoryChart
            theme={theme}
            width={width - 20}
            height={300}
            padding={{ left: 60, right: 40, top: 20, bottom: 50 }}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryScatter
              data={chartData}
              size={({ datum }) => (datum.volume || 100000) / 100000}
              style={{
                data: {
                  fill: ({ datum }) => (datum.y > 1000 ? "#10B981" : "#EF4444"),
                  fillOpacity: 0.7,
                },
              }}
              animate={{ duration: 1000 }}
            />
          </VictoryChart>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0F1629", "#1E293B", "#1E40AF"]}
        style={styles.background}
      >
        {/* Quantum Particles */}
        <Animated.View style={[styles.particles, particleStyle]} />

        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Interactive Analytics</Text>
            <Text style={styles.subtitle}>Quantum Financial Visualization</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              isAnalyzing && styles.analyzingButton,
            ]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Ionicons
              name={isAnalyzing ? "refresh" : "analytics"}
              size={20}
              color={isAnalyzing ? "#F59E0B" : "#10B981"}
            />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Chart Type Selector */}
          <View style={styles.chartTypeSelector}>
            {(["trend", "volume", "candlestick", "correlation"] as const).map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    chartType === type && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    setChartType(type);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      chartType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Time Range Selector */}
          <View style={styles.timeRangeSelector}>
            {(["1H", "4H", "1D", "1W", "1M"] as const).map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeButton,
                  timeRange === range && styles.rangeButtonActive,
                ]}
                onPress={() => {
                  setTimeRange(range);
                  setChartData(generateAdvancedData());
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.rangeButtonText,
                    timeRange === range && styles.rangeButtonTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Interactive Chart Container */}
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View>
              <PanGestureHandler onGestureEvent={panHandler}>
                <Animated.View style={[styles.chartContainer, chartStyle]}>
                  <LinearGradient
                    colors={[
                      "rgba(16, 185, 129, 0.05)",
                      "rgba(59, 130, 246, 0.05)",
                      "rgba(139, 92, 246, 0.05)",
                    ]}
                    style={styles.chartBackground}
                  >
                    {renderAdvancedChart()}
                  </LinearGradient>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>

          {/* Analytics Panel */}
          <View style={styles.analyticsPanel}>
            <Text style={styles.panelTitle}>Real-time Analytics</Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="trending-up" size={20} color="#10B981" />
                <Text style={styles.metricValue}>+24.5%</Text>
                <Text style={styles.metricLabel}>Growth Rate</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="pulse" size={20} color="#3B82F6" />
                <Text style={styles.metricValue}>0.87</Text>
                <Text style={styles.metricLabel}>Volatility</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="stats-chart" size={20} color="#F59E0B" />
                <Text style={styles.metricValue}>$2.4M</Text>
                <Text style={styles.metricLabel}>Volume</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="diamond" size={20} color="#8B5CF6" />
                <Text style={styles.metricValue}>95.2</Text>
                <Text style={styles.metricLabel}>AI Score</Text>
              </View>
            </View>
          </View>

          {/* Gesture Instructions */}
          <View style={styles.instructionsPanel}>
            <Text style={styles.instructionsTitle}>Quantum Interactions</Text>
            <View style={styles.instructionItem}>
              <Ionicons name="resize" size={16} color="#10B981" />
              <Text style={styles.instructionText}>Pinch to zoom chart</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="move" size={16} color="#3B82F6" />
              <Text style={styles.instructionText}>Drag to pan view</Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="analytics" size={16} color="#F59E0B" />
              <Text style={styles.instructionText}>
                Tap analyze for AI insights
              </Text>
            </View>
          </View>
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
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16, 185, 129, 0.02)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 2,
  },
  analyzeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  analyzingButton: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chartTypeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#E0E7FF",
  },
  typeButtonTextActive: {
    color: "#10B981",
    fontWeight: "bold",
  },
  timeRangeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 10,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 7,
  },
  rangeButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E0E7FF",
  },
  rangeButtonTextActive: {
    color: "#10B981",
    fontWeight: "bold",
  },
  chartContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  chartBackground: {
    borderRadius: 15,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  analyticsPanel: {
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: "#E0E7FF",
  },
  instructionsPanel: {
    marginHorizontal: 10,
    marginBottom: 30,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 15,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: "#E0E7FF",
    marginLeft: 10,
  },
});
