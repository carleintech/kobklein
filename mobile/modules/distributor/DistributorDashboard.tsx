/**
 * 🌐 DISTRIBUTOR DASHBOARD MODULE
 * AI-powered distribution network & logistics management
 * Features: Agent network, commission tracking, territory analytics, supply chain optimization
 */

import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { QuantumCard } from "../../components/cards/QuantumCard";
import { AgentPerformance } from "../../components/distributor/AgentPerformance";
import { CommissionTracker } from "../../components/distributor/CommissionTracker";
import { ComplianceMonitor } from "../../components/distributor/ComplianceMonitor";
import { GrowthOpportunities } from "../../components/distributor/GrowthOpportunities";
import { NetworkOverview } from "../../components/distributor/NetworkOverview";
import { SupplyChainWidget } from "../../components/distributor/SupplyChainWidget";
import { TerritoryAnalytics } from "../../components/distributor/TerritoryAnalytics";
import { TrainingProgress } from "../../components/distributor/TrainingProgress";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface DistributorDashboardProps {
  onNavigate?: (route: string) => void;
}

export const DistributorDashboard: React.FC<DistributorDashboardProps> = ({
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
  const networkScale = useSharedValue(0.95);

  // Distribution network state
  const [networkStats, setNetworkStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalCommissions: 0,
    monthlyVolume: 0,
    territories: 0,
  });
  const [topAgents, setTopAgents] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState({});
  const [complianceScore, setComplianceScore] = useState(0);

  useEffect(() => {
    initializeNetworkEntrance();
    loadNetworkData();
  }, []);

  const initializeNetworkEntrance = () => {
    fadeInProgress.value = withTiming(1, { duration: 1000 });
    networkScale.value = withSpring(1, {
      damping: 16,
      stiffness: 140,
    });
  };

  const loadNetworkData = async () => {
    // TODO: Load real distribution data from API
    setNetworkStats({
      totalAgents: 247,
      activeAgents: 198,
      totalCommissions: 15680.5,
      monthlyVolume: 234567.89,
      territories: 12,
    });

    setTopAgents([
      {
        id: "1",
        name: "Marie Dupont",
        volume: 45678.9,
        commission: 2283.95,
        agents: 15,
        territory: "Port-au-Prince Nord",
        performance: 94,
      },
      {
        id: "2",
        name: "Jean Baptiste",
        volume: 38924.5,
        commission: 1946.23,
        agents: 12,
        territory: "Carrefour",
        performance: 89,
      },
      {
        id: "3",
        name: "Sophie Laurent",
        volume: 32156.78,
        commission: 1607.84,
        agents: 10,
        territory: "Delmas",
        performance: 87,
      },
    ]);

    setRecentTransactions([
      {
        id: "1",
        type: "commission",
        amount: 156.78,
        agent: "Marie Dupont",
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "volume",
        amount: 2340.5,
        agent: "Jean Baptiste",
        timestamp: new Date(),
      },
    ]);

    setTrainingProgress({
      completed: 89,
      inProgress: 34,
      pending: 12,
    });

    setComplianceScore(92);
  };

  const handleNetworkAction = (action: string) => {
    updateBehaviorPattern(`distributor_${action}`);

    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    switch (action) {
      case "add_agent":
        onNavigate?.("add-agent");
        break;
      case "territories":
        onNavigate?.("territories");
        break;
      case "commissions":
        onNavigate?.("commissions");
        break;
      case "training":
        onNavigate?.("training");
        break;
      case "compliance":
        onNavigate?.("compliance");
        break;
      case "analytics":
        onNavigate?.("network-analytics");
        break;
      case "supply_chain":
        onNavigate?.("supply-chain");
        break;
      case "reports":
        onNavigate?.("reports");
        break;
      default:
        console.log(`Network action: ${action}`);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInProgress.value,
      transform: [
        {
          scale: networkScale.value,
        },
      ],
    };
  });

  const agentGrowth = ((networkStats.activeAgents - 180) / 180) * 100; // vs last month
  const volumeGrowth = ((networkStats.monthlyVolume - 200000) / 200000) * 100;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Network Overview */}
      <QuantumCard
        style={styles.overviewCard}
        glowColor={theme.primary}
        theme={theme}
      >
        <NetworkOverview
          stats={networkStats}
          agentGrowth={agentGrowth}
          volumeGrowth={volumeGrowth}
          theme={theme}
          onViewDetailed={() => {
            updateBehaviorPattern("view_network_analytics");
            onNavigate?.("network-analytics");
          }}
        />
      </QuantumCard>

      {/* Network Actions Grid */}
      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text_primary }]}>
          Network Management
        </Text>
        <View style={styles.actionsGrid}>
          {[
            {
              id: "add_agent",
              icon: "person-add",
              label: "Add Agent",
              color: theme.success,
            },
            {
              id: "territories",
              icon: "map",
              label: "Territories",
              color: theme.info,
            },
            {
              id: "commissions",
              icon: "account-balance-wallet",
              label: "Commissions",
              color: theme.warning,
            },
            {
              id: "training",
              icon: "school",
              label: "Training",
              color: theme.accent,
            },
            {
              id: "compliance",
              icon: "security",
              label: "Compliance",
              color: theme.error,
            },
            {
              id: "analytics",
              icon: "analytics",
              label: "Analytics",
              color: theme.secondary,
            },
          ].map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { borderColor: action.color }]}
              onPress={() => handleNetworkAction(action.id)}
            >
              <MaterialIcons
                name={action.icon}
                size={24}
                color={action.color}
              />
              <Text style={[styles.actionLabel, { color: theme.text_primary }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Top Agent Performance */}
      <QuantumCard
        style={styles.agentsCard}
        glowColor={theme.success}
        theme={theme}
      >
        <AgentPerformance
          topAgents={topAgents}
          theme={theme}
          onAgentSelect={(agentId) => {
            updateBehaviorPattern(`view_agent_${agentId}`);
            onNavigate?.(`agent/${agentId}`);
          }}
          onViewAllAgents={() => {
            updateBehaviorPattern("view_all_agents");
            onNavigate?.("agents");
          }}
        />
      </QuantumCard>

      {/* Commission Tracker */}
      <QuantumCard
        style={styles.commissionsCard}
        glowColor={theme.warning}
        theme={theme}
      >
        <CommissionTracker
          totalCommissions={networkStats.totalCommissions}
          monthlyCommissions={12450.75}
          pendingPayments={2340.5}
          commissionRate={5.5}
          topEarners={topAgents.slice(0, 3)}
          theme={theme}
          onPayCommissions={() => {
            updateBehaviorPattern("pay_commissions");
            onNavigate?.("pay-commissions");
          }}
        />
      </QuantumCard>

      {/* Territory Analytics */}
      <QuantumCard
        style={styles.territoryCard}
        glowColor={theme.info}
        theme={theme}
      >
        <TerritoryAnalytics
          territories={[
            {
              name: "Port-au-Prince Nord",
              agents: 45,
              volume: 89234.5,
              growth: 12.5,
            },
            { name: "Carrefour", agents: 38, volume: 76543.21, growth: 8.9 },
            { name: "Delmas", agents: 32, volume: 65432.1, growth: 15.2 },
            { name: "Pétion-Ville", agents: 28, volume: 54321.09, growth: 6.7 },
          ]}
          theme={theme}
          onTerritorySelect={(territory) => {
            updateBehaviorPattern(`view_territory_${territory}`);
            onNavigate?.(`territory/${territory}`);
          }}
        />
      </QuantumCard>

      {/* Supply Chain Widget */}
      <QuantumCard
        style={styles.supplyChainCard}
        glowColor={theme.accent}
        theme={theme}
      >
        <SupplyChainWidget
          inventory={[
            { item: "Mobile Money Credits", stock: 95000, threshold: 20000 },
            { item: "Cash Float", stock: 45000, threshold: 10000 },
            { item: "Marketing Materials", stock: 250, threshold: 50 },
          ]}
          deliveries={[
            {
              id: "1",
              destination: "Port-au-Prince Nord",
              status: "in_transit",
              eta: "2h 30m",
            },
            {
              id: "2",
              destination: "Carrefour",
              status: "delivered",
              time: "1h ago",
            },
          ]}
          theme={theme}
          onManageSupply={() => handleNetworkAction("supply_chain")}
        />
      </QuantumCard>

      {/* Training Progress */}
      <QuantumCard
        style={styles.trainingCard}
        glowColor={theme.secondary}
        theme={theme}
      >
        <TrainingProgress
          progress={trainingProgress}
          courses={[
            {
              id: "1",
              title: "KYC Compliance",
              completion: 94,
              participants: 189,
            },
            {
              id: "2",
              title: "Customer Service",
              completion: 87,
              participants: 156,
            },
            {
              id: "3",
              title: "New Product Features",
              completion: 76,
              participants: 203,
            },
          ]}
          theme={theme}
          onViewTraining={() => handleNetworkAction("training")}
          onCreateCourse={() => {
            updateBehaviorPattern("create_training_course");
            onNavigate?.("create-course");
          }}
        />
      </QuantumCard>

      {/* Compliance Monitor */}
      <QuantumCard
        style={styles.complianceCard}
        glowColor={complianceScore > 90 ? theme.success : theme.warning}
        theme={theme}
      >
        <ComplianceMonitor
          overallScore={complianceScore}
          categories={[
            { name: "KYC Verification", score: 96, status: "excellent" },
            { name: "Transaction Monitoring", score: 92, status: "good" },
            { name: "Agent Documentation", score: 88, status: "good" },
            { name: "Risk Assessment", score: 94, status: "excellent" },
          ]}
          recentIssues={[
            {
              id: "1",
              type: "documentation",
              agent: "Agent #156",
              severity: "low",
            },
          ]}
          theme={theme}
          onViewCompliance={() => handleNetworkAction("compliance")}
        />
      </QuantumCard>

      {/* Growth Opportunities */}
      <QuantumCard
        style={styles.growthCard}
        glowColor={theme.accent}
        theme={theme}
      >
        <GrowthOpportunities
          opportunities={[
            {
              id: "1",
              title: "Expand to Jacmel",
              potential: "High",
              investment: 15000,
              roi: "180%",
              timeframe: "3 months",
            },
            {
              id: "2",
              title: "Mobile Banking Integration",
              potential: "Medium",
              investment: 8000,
              roi: "120%",
              timeframe: "2 months",
            },
            {
              id: "3",
              title: "Agent Incentive Program",
              potential: "High",
              investment: 5000,
              roi: "200%",
              timeframe: "1 month",
            },
          ]}
          theme={theme}
          onOpportunitySelect={(opportunityId) => {
            updateBehaviorPattern(`explore_opportunity_${opportunityId}`);
            onNavigate?.(`opportunity/${opportunityId}`);
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
  overviewCard: {
    marginBottom: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  agentsCard: {
    marginBottom: 20,
  },
  commissionsCard: {
    marginBottom: 20,
  },
  territoryCard: {
    marginBottom: 20,
  },
  supplyChainCard: {
    marginBottom: 20,
  },
  trainingCard: {
    marginBottom: 20,
  },
  complianceCard: {
    marginBottom: 20,
  },
  growthCard: {
    marginBottom: 40,
  },
});
