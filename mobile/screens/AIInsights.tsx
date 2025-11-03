import { Ionicons } from "@expo/vector-icons";
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
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
} from "victory-native";

const { width } = Dimensions.get("window");

export default function AIInsights() {
  const [activeInsight, setActiveInsight] = useState(0);
  const [predictiveMode, setPredictiveMode] = useState(true);

  // AI Animation Values
  const aiPulse = useSharedValue(1);
  const brainRotation = useSharedValue(0);
  const dataFlow = useSharedValue(0);
  const insightGlow = useSharedValue(0);

  // Mock predictive data
  const predictiveData = [
    { x: 1, y: 1200 },
    { x: 2, y: 1350 },
    { x: 3, y: 1180 },
    { x: 4, y: 1420 },
    { x: 5, y: 1650 },
    { x: 6, y: 1800 },
    { x: 7, y: 2100 },
  ];

  useEffect(() => {
    // AI pulse animation
    aiPulse.value = withRepeat(
      withSpring(1.1, { damping: 12, stiffness: 150 }),
      -1,
      true
    );

    // Brain rotation
    brainRotation.value = withRepeat(
      withTiming(360, { duration: 25000 }),
      -1,
      false
    );

    // Data flow animation
    dataFlow.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);

    // Insight glow
    insightGlow.value = withRepeat(withTiming(1, { duration: 2500 }), -1, true);
  }, []);

  // Animated styles
  const aiPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: aiPulse.value }],
  }));

  const brainRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${brainRotation.value}deg` }],
  }));

  const dataFlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dataFlow.value, [0, 1], [0.3, 1]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(insightGlow.value, [0, 1], [0.3, 0.8]),
  }));

  // AI Brain Header
  const AIBrainHeader = () => (
    <View style={styles.brainHeader}>
      <LinearGradient
        colors={["rgba(139, 92, 246, 0.15)", "rgba(124, 58, 237, 0.08)"]}
        style={styles.brainContainer}
      >
        <Animated.View style={[styles.brainCore, aiPulseStyle]}>
          <Animated.View style={brainRotationStyle}>
            <Ionicons name="analytics" size={40} color="#8B5CF6" />
          </Animated.View>
          <Text style={styles.brainTitle}>AI Engine</Text>
          <Text style={styles.brainSubtitle}>Quantum Predictions Active</Text>
        </Animated.View>

        {/* Neural Network Effect */}
        <View style={styles.neuralNetwork}>
          {[...Array(8)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.neuralNode,
                dataFlowStyle,
                {
                  top: `${20 + i * 10}%`,
                  left: `${15 + (i % 3) * 25}%`,
                },
              ]}
            >
              <View style={styles.nodeDot} />
            </Animated.View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );

  // Predictive Chart
  const PredictiveChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>
        📈 Spending Prediction - Next 7 Days
      </Text>
      <View style={styles.chartWrapper}>
        <VictoryChart
          width={width - 40}
          height={200}
          padding={{ left: 40, top: 20, right: 20, bottom: 40 }}
        >
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "rgba(255, 255, 255, 0.3)" },
              tickLabels: { fill: "#A5B4FC", fontSize: 12 },
              grid: {
                stroke: "rgba(255, 255, 255, 0.1)",
                strokeDasharray: "3,3",
              },
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "rgba(255, 255, 255, 0.3)" },
              tickLabels: { fill: "#A5B4FC", fontSize: 12 },
            }}
          />
          <VictoryArea
            data={predictiveData}
            style={{
              data: {
                fill: "url(#gradient)",
                fillOpacity: 0.6,
                stroke: "#8B5CF6",
                strokeWidth: 3,
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          />
          <VictoryLine
            data={predictiveData}
            style={{
              data: { stroke: "#8B5CF6", strokeWidth: 3 },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );

  // AI Insights Cards
  const AIInsightsCards = () => {
    const insights = [
      {
        type: "savings",
        icon: "trending-down",
        title: "Smart Savings Opportunity",
        description:
          "AI detected you could save $127/month by optimizing subscription services.",
        confidence: 94,
        color: "#10B981",
        action: "Optimize Now",
      },
      {
        type: "investment",
        icon: "trending-up",
        title: "Investment Recommendation",
        description:
          "Based on your risk profile, consider diversifying into emerging markets.",
        confidence: 87,
        color: "#3B82F6",
        action: "Learn More",
      },
      {
        type: "budget",
        icon: "alert-circle",
        title: "Budget Alert",
        description:
          "You're 15% over your dining budget this month. AI suggests 3 cost-saving restaurants.",
        confidence: 96,
        color: "#F59E0B",
        action: "View Suggestions",
      },
      {
        type: "cashflow",
        icon: "swap-horizontal",
        title: "Cash Flow Prediction",
        description:
          "Expected surplus of $450 next week. Consider high-yield savings transfer.",
        confidence: 91,
        color: "#8B5CF6",
        action: "Set Reminder",
      },
    ];

    return (
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>🤖 AI-Powered Insights</Text>

        {insights.map((insight, index) => (
          <Animated.View key={index} style={[styles.insightCard, glowStyle]}>
            <TouchableOpacity
              onPress={() => setActiveInsight(index)}
              style={[
                styles.insightContent,
                activeInsight === index && styles.activeInsight,
              ]}
            >
              <LinearGradient
                colors={[
                  `${insight.color}20`,
                  `${insight.color}10`,
                  "rgba(255, 255, 255, 0.02)",
                ]}
                style={styles.insightGradient}
              >
                <View style={styles.insightHeader}>
                  <View
                    style={[
                      styles.insightIcon,
                      { backgroundColor: `${insight.color}25` },
                    ]}
                  >
                    <Ionicons
                      name={insight.icon as any}
                      size={24}
                      color={insight.color}
                    />
                  </View>
                  <View style={styles.insightMeta}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceLabel}>Confidence:</Text>
                      <Text
                        style={[
                          styles.confidenceValue,
                          { color: insight.color },
                        ]}
                      >
                        {insight.confidence}%
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>

                <TouchableOpacity style={styles.insightAction}>
                  <LinearGradient
                    colors={[`${insight.color}30`, `${insight.color}20`]}
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionText, { color: insight.color }]}>
                      {insight.action}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={insight.color}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Confidence Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: insight.color,
                          width: `${insight.confidence}%`,
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
  };

  // Behavioral Patterns
  const BehaviorPatterns = () => (
    <View style={styles.patternsContainer}>
      <Text style={styles.sectionTitle}>🧠 Behavioral Analysis</Text>

      <View style={styles.patternCard}>
        <LinearGradient
          colors={["rgba(59, 130, 246, 0.1)", "rgba(37, 99, 235, 0.05)"]}
          style={styles.patternGradient}
        >
          <View style={styles.patternHeader}>
            <Ionicons name="pulse" size={24} color="#3B82F6" />
            <Text style={styles.patternTitle}>Spending Patterns</Text>
          </View>

          <View style={styles.patternStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Peak Spending</Text>
              <Text style={styles.statValue}>Weekends</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Category Preference</Text>
              <Text style={styles.statValue}>Food & Dining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budget Adherence</Text>
              <Text style={[styles.statValue, { color: "#10B981" }]}>85%</Text>
            </View>
          </View>
        </LinearGradient>
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
          {/* AI Brain Header */}
          <AIBrainHeader />

          {/* Predictive Chart */}
          <PredictiveChart />

          {/* AI Insights Cards */}
          <AIInsightsCards />

          {/* Behavioral Patterns */}
          <BehaviorPatterns />
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
  brainHeader: {
    margin: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  brainContainer: {
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.3)",
    position: "relative",
  },
  brainCore: {
    alignItems: "center",
    zIndex: 10,
  },
  brainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 15,
    marginBottom: 5,
  },
  brainSubtitle: {
    fontSize: 14,
    color: "#8B5CF6",
    fontStyle: "italic",
  },
  neuralNetwork: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  neuralNode: {
    position: "absolute",
    width: 8,
    height: 8,
  },
  nodeDot: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  chartWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  insightCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  insightContent: {
    borderRadius: 15,
  },
  activeInsight: {
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  insightGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  insightMeta: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#A5B4FC",
    marginRight: 6,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  insightDescription: {
    fontSize: 14,
    color: "#E0E7FF",
    lineHeight: 20,
    marginBottom: 15,
  },
  insightAction: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  progressContainer: {
    width: "100%",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
  },
  patternsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  patternCard: {
    borderRadius: 15,
    overflow: "hidden",
  },
  patternGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  patternHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  patternTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  patternStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#A5B4FC",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
