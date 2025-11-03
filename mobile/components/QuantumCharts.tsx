import { Ionicons } from "@expo/vector-icons";
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
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

interface PieDataPoint {
  x: string;
  y: number;
}

// Revolutionary Quantum Charts Component
export default function QuantumCharts() {
  const [activeChart, setActiveChart] = useState<
    "line" | "bar" | "area" | "pie"
  >("line");
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1W");

  // Quantum animation values
  const pulseAnimation = useSharedValue(1);
  const chartAnimation = useSharedValue(0);
  const particleAnimation = useSharedValue(0);

  // Sample data - In real app, this would come from API
  const generateFinancialData = (): ChartDataPoint[] => {
    const baseValue = 1000;
    return Array.from({ length: 20 }, (_, i) => ({
      x: i + 1,
      y: baseValue + Math.random() * 500 - 250 + i * 50,
    }));
  };

  const generateBarData = (): ChartDataPoint[] => {
    return Array.from({ length: 7 }, (_, i) => ({
      x: i + 1,
      y: Math.random() * 1000 + 200,
      label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    }));
  };

  const generatePieData = (): PieDataPoint[] => [
    { x: "Income", y: 45 },
    { x: "Expenses", y: 25 },
    { x: "Savings", y: 20 },
    { x: "Investments", y: 10 },
  ];

  const [lineData, setLineData] = useState(generateFinancialData);
  const [barData, setBarData] = useState(generateBarData);
  const [pieData, setPieData] = useState(generatePieData);

  // Initialize quantum animations
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSpring(1.05, { damping: 15, stiffness: 100 }),
      -1,
      true
    );

    chartAnimation.value = withTiming(1, { duration: 1000 });

    particleAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setLineData(generateFinancialData());
      setBarData(generateBarData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartAnimation.value,
    transform: [
      {
        translateY: interpolate(chartAnimation.value, [0, 1], [50, 0]),
      },
    ],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(particleAnimation.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  const handleChartChange = (chart: "line" | "bar" | "area" | "pie") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveChart(chart);
    chartAnimation.value = 0;
    chartAnimation.value = withTiming(1, { duration: 800 });
  };

  const handleTimeframeChange = (tf: "1D" | "1W" | "1M" | "1Y") => {
    Haptics.selectionAsync();
    setTimeframe(tf);
    setLineData(generateFinancialData());
  };

  const renderChart = () => {
    const commonTheme = {
      ...VictoryTheme.material,
      axis: {
        style: {
          axis: { stroke: "rgba(255, 255, 255, 0.3)" },
          tickLabels: { fill: "#E0E7FF", fontSize: 12 },
          grid: { stroke: "rgba(255, 255, 255, 0.1)" },
        },
      },
    };

    switch (activeChart) {
      case "line":
        return (
          <VictoryChart
            theme={commonTheme}
            width={chartWidth}
            height={200}
            padding={{ left: 50, right: 50, top: 20, bottom: 40 }}
            animate={{ duration: 1000, onLoad: { duration: 500 } }}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryLine
              data={lineData}
              style={{
                data: {
                  stroke: "#10B981",
                  strokeWidth: 3,
                  filter: "drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.6))",
                },
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
            />
            <VictoryScatter
              data={lineData.slice(-5)}
              size={4}
              style={{
                data: {
                  fill: "#10B981",
                  filter: "drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.8))",
                },
              }}
            />
          </VictoryChart>
        );

      case "bar":
        return (
          <VictoryChart
            theme={commonTheme}
            width={chartWidth}
            height={200}
            padding={{ left: 50, right: 50, top: 20, bottom: 40 }}
            animate={{ duration: 1000, onLoad: { duration: 500 } }}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryBar
              data={barData}
              style={{
                data: {
                  fill: ({ datum }) => {
                    const colors = [
                      "#3B82F6",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                      "#EC4899",
                    ];
                    return colors[datum.x - 1] || "#10B981";
                  },
                  filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))",
                },
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 },
              }}
            />
          </VictoryChart>
        );

      case "area":
        return (
          <VictoryChart
            theme={commonTheme}
            width={chartWidth}
            height={200}
            padding={{ left: 50, right: 50, top: 20, bottom: 40 }}
            animate={{ duration: 1000, onLoad: { duration: 500 } }}
          >
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryArea
              data={lineData}
              style={{
                data: {
                  fill: "url(#areaGradient)",
                  stroke: "#10B981",
                  strokeWidth: 2,
                  fillOpacity: 0.7,
                },
              }}
              animate={{
                duration: 1500,
                onLoad: { duration: 1000 },
              }}
            />
          </VictoryChart>
        );

      case "pie":
        return (
          <View style={styles.pieContainer}>
            <VictoryPie
              data={pieData}
              width={chartWidth}
              height={200}
              innerRadius={40}
              colorScale={["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]}
              labelStyle={{
                fontSize: 12,
                fill: "#FFFFFF",
                fontWeight: "bold",
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 },
              }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Quantum Particle Effects */}
      <Animated.View style={[styles.particleEffect, particleStyle]} />

      {/* Charts Header */}
      <Animated.View style={[styles.header, pulseStyle]}>
        <LinearGradient
          colors={["rgba(59, 130, 246, 0.1)", "rgba(16, 185, 129, 0.1)"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons name="analytics" size={24} color="#10B981" />
            <Text style={styles.headerTitle}>Quantum Analytics</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.livePoint} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Chart Type Selector */}
      <View style={styles.chartSelector}>
        {(["line", "bar", "area", "pie"] as const).map((chart) => (
          <TouchableOpacity
            key={chart}
            style={[
              styles.chartButton,
              activeChart === chart && styles.chartButtonActive,
            ]}
            onPress={() => handleChartChange(chart)}
          >
            <Ionicons
              name={
                chart === "line"
                  ? "trending-up"
                  : chart === "bar"
                  ? "bar-chart"
                  : chart === "area"
                  ? "pulse"
                  : "pie-chart"
              }
              size={18}
              color={activeChart === chart ? "#000000" : "#E0E7FF"}
            />
            <Text
              style={[
                styles.chartButtonText,
                activeChart === chart && styles.chartButtonTextActive,
              ]}
            >
              {chart.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.timeframeButton,
              timeframe === tf && styles.timeframeButtonActive,
            ]}
            onPress={() => handleTimeframeChange(tf)}
          >
            <Text
              style={[
                styles.timeframeText,
                timeframe === tf && styles.timeframeTextActive,
              ]}
            >
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Container */}
      <Animated.View style={[styles.chartContainer, chartStyle]}>
        <LinearGradient
          colors={[
            "rgba(59, 130, 246, 0.05)",
            "rgba(16, 185, 129, 0.05)",
            "rgba(139, 92, 246, 0.05)",
          ]}
          style={styles.chartBackground}
        >
          {renderChart()}
        </LinearGradient>
      </Animated.View>

      {/* Chart Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Value</Text>
          <Text style={styles.statValue}>$24,580.00</Text>
          <Text style={styles.statChange}>+12.5% ↗</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h Change</Text>
          <Text style={styles.statValue}>+$1,240.00</Text>
          <Text style={styles.statChange}>+5.3% ↗</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>$128.5K</Text>
          <Text style={styles.statChange}>+8.7% ↗</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  particleEffect: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: "rgba(16, 185, 129, 0.03)",
    borderRadius: 20,
  },
  header: {
    marginBottom: 15,
  },
  headerGradient: {
    borderRadius: 15,
    padding: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginLeft: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  livePoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 5,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#10B981",
  },
  chartSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  chartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  chartButtonActive: {
    backgroundColor: "#10B981",
  },
  chartButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#E0E7FF",
    marginLeft: 4,
  },
  chartButtonTextActive: {
    color: "#000000",
  },
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 2,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E0E7FF",
  },
  timeframeTextActive: {
    color: "#10B981",
    fontWeight: "bold",
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartBackground: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  pieContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#E0E7FF",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statChange: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
});
