/**
 * 🎯 INDIVIDUAL DASHBOARD MODULE
 * AI-powered personal finance management with predictive insights
 * Features: Smart budgeting, habit analysis, goal tracking, social payments
 */

import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { QuickActionsGrid } from "../../components/actions/QuickActionsGrid";
import { AISavingsCoach } from "../../components/ai/AISavingsCoach";
import { SmartSpendingInsights } from "../../components/ai/SmartSpendingInsights";
import { QuantumCard } from "../../components/cards/QuantumCard";
import { FinancialGoalsWidget } from "../../components/personal/FinancialGoalsWidget";
import { HabitTracker } from "../../components/personal/HabitTracker";
import { SocialPayments } from "../../components/social/SocialPayments";
import { TransactionHistory } from "../../components/transactions/TransactionHistory";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface IndividualDashboardProps {
  onNavigate?: (route: string) => void;
}

export const IndividualDashboard: React.FC<IndividualDashboardProps> = ({
  onNavigate,
}) => {
  const {
    user,
    theme,
    adaptiveUX,
    updateBehaviorPattern,
    permissions,
    predictedAction,
  } = useAuth();

  // Animation values
  const fadeInProgress = useSharedValue(0);
  const cardsScale = useSharedValue(0.95);

  // Dashboard state
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [weeklySpending, setWeeklySpending] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const [savingsGoal, setSavingsGoal] = useState({
    current: 1250,
    target: 5000,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    initializeEntrance();
    loadDashboardData();
  }, []);

  const initializeEntrance = () => {
    fadeInProgress.value = withTiming(1, { duration: 800 });
    cardsScale.value = withSpring(1, {
      damping: 20,
      stiffness: 150,
    });
  };

  const loadDashboardData = async () => {
    // TODO: Load real data from API
    setWeeklySpending(456.78);
    setRecentTransactions([
      {
        id: "1",
        type: "expense",
        amount: 45.99,
        description: "Grocery Store",
        category: "food",
        timestamp: new Date(),
      },
      // More mock data...
    ]);
  };

  const handleQuickAction = (action: string) => {
    updateBehaviorPattern(`individual_${action}`);

    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    switch (action) {
      case "send_money":
        onNavigate?.("send");
        break;
      case "request_money":
        onNavigate?.("request");
        break;
      case "pay_bill":
        onNavigate?.("bills");
        break;
      case "add_money":
        onNavigate?.("topup");
        break;
      case "scan_qr":
        onNavigate?.("scanner");
        break;
      case "budget":
        onNavigate?.("budget");
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInProgress.value,
      transform: [
        {
          scale: cardsScale.value,
        },
      ],
    };
  });

  const spendingPercentage = (weeklySpending / (monthlyBudget / 4)) * 100;
  const savingsPercentage = (savingsGoal.current / savingsGoal.target) * 100;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* AI Spending Insights Card */}
      <QuantumCard
        style={styles.insightsCard}
        glowColor={theme.glow}
        theme={theme}
      >
        <SmartSpendingInsights
          weeklySpending={weeklySpending}
          monthlyBudget={monthlyBudget}
          spendingTrend="decreasing"
          aiSuggestions={[
            "You're 12% under budget this week! 🎉",
            "Consider moving $50 to savings",
            "Coffee spending up 23% vs last week",
          ]}
          theme={theme}
        />
      </QuantumCard>

      {/* Quick Actions Grid */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text_primary }]}>
          Quick Actions
        </Text>
        <QuickActionsGrid
          actions={[
            {
              id: "send_money",
              icon: "send",
              label: "Send",
              color: theme.success,
            },
            {
              id: "request_money",
              icon: "call-received",
              label: "Request",
              color: theme.info,
            },
            {
              id: "pay_bill",
              icon: "receipt",
              label: "Bills",
              color: theme.warning,
            },
            {
              id: "add_money",
              icon: "add-circle",
              label: "Top Up",
              color: theme.primary,
            },
            {
              id: "scan_qr",
              icon: "qr-code-scanner",
              label: "Scan",
              color: theme.secondary,
            },
            {
              id: "budget",
              icon: "pie-chart",
              label: "Budget",
              color: theme.accent,
            },
          ]}
          onActionPress={handleQuickAction}
          theme={theme}
          adaptiveUX={adaptiveUX}
        />
      </View>

      {/* Financial Goals Widget */}
      <QuantumCard
        style={styles.goalsCard}
        glowColor={theme.success}
        theme={theme}
      >
        <FinancialGoalsWidget
          goals={[
            {
              id: "emergency",
              title: "Emergency Fund",
              current: savingsGoal.current,
              target: savingsGoal.target,
              category: "savings",
              deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
              color: theme.success,
            },
            {
              id: "vacation",
              title: "Haiti Trip",
              current: 750,
              target: 2000,
              category: "travel",
              deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months
              color: theme.info,
            },
          ]}
          theme={theme}
          onGoalPress={(goalId) => {
            updateBehaviorPattern(`goal_view_${goalId}`);
            onNavigate?.("goals");
          }}
        />
      </QuantumCard>

      {/* AI Savings Coach */}
      <QuantumCard
        style={styles.coachCard}
        glowColor={theme.accent}
        theme={theme}
      >
        <AISavingsCoach
          spendingData={{
            weekly: weeklySpending,
            monthly: monthlyBudget,
            categories: {
              food: 180.5,
              transport: 120.25,
              entertainment: 95.75,
              utilities: 60.28,
            },
          }}
          savingsGoals={[savingsGoal]}
          personalizedTips={[
            "Switch to cooking 2 more meals per week to save $40",
            "Use public transport on Tuesdays to save $15/week",
            "Your entertainment spending is optimal! Keep it up 👍",
          ]}
          theme={theme}
          onTipSelect={(tip) => {
            updateBehaviorPattern(`savings_tip_${tip.category}`);
          }}
        />
      </QuantumCard>

      {/* Habit Tracker */}
      <QuantumCard
        style={styles.habitsCard}
        glowColor={theme.warning}
        theme={theme}
      >
        <HabitTracker
          habits={[
            {
              id: "daily_budget_check",
              title: "Check Daily Budget",
              streak: 12,
              target: 30,
              category: "financial",
              completedToday: true,
            },
            {
              id: "no_impulse_buying",
              title: "No Impulse Purchases",
              streak: 5,
              target: 21,
              category: "spending",
              completedToday: false,
            },
            {
              id: "save_daily",
              title: "Daily $5 Save",
              streak: 8,
              target: 30,
              category: "savings",
              completedToday: true,
            },
          ]}
          theme={theme}
          onHabitToggle={(habitId, completed) => {
            updateBehaviorPattern(
              `habit_${completed ? "complete" : "skip"}_${habitId}`
            );
          }}
        />
      </QuantumCard>

      {/* Social Payments */}
      <QuantumCard
        style={styles.socialCard}
        glowColor={theme.secondary}
        theme={theme}
      >
        <SocialPayments
          friends={[
            { id: "1", name: "Marie", avatar: null, status: "online" },
            { id: "2", name: "Jean", avatar: null, status: "offline" },
            { id: "3", name: "Sophie", avatar: null, status: "online" },
          ]}
          recentActivity={[
            {
              id: "1",
              type: "received",
              from: "Marie",
              amount: 25,
              timestamp: new Date(),
            },
            {
              id: "2",
              type: "sent",
              to: "Jean",
              amount: 50,
              timestamp: new Date(),
            },
          ]}
          theme={theme}
          onFriendSelect={(friendId) => {
            updateBehaviorPattern(`social_send_${friendId}`);
            onNavigate?.(`send/${friendId}`);
          }}
        />
      </QuantumCard>

      {/* Recent Transactions */}
      <QuantumCard
        style={styles.transactionsCard}
        glowColor={theme.info}
        theme={theme}
      >
        <TransactionHistory
          transactions={recentTransactions}
          limit={5}
          theme={theme}
          onViewAll={() => {
            updateBehaviorPattern("view_all_transactions");
            onNavigate?.("transactions");
          }}
          onTransactionPress={(transactionId) => {
            updateBehaviorPattern(`transaction_detail_${transactionId}`);
            onNavigate?.(`transaction/${transactionId}`);
          }}
        />
      </QuantumCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  insightsCard: {
    marginBottom: 20,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  goalsCard: {
    marginBottom: 20,
  },
  coachCard: {
    marginBottom: 20,
  },
  habitsCard: {
    marginBottom: 20,
  },
  socialCard: {
    marginBottom: 20,
  },
  transactionsCard: {
    marginBottom: 40, // Extra space at bottom
  },
});
