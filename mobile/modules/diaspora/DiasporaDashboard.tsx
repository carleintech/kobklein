/**
 * 🌍 DIASPORA DASHBOARD MODULE
 * Revolutionary international remittances & family connection platform
 * Features: Smart remittances, family tracking, exchange optimization, cultural bridge
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
import { CulturalCalendar } from "../../components/diaspora/CulturalCalendar";
import { DocumentManager } from "../../components/diaspora/DocumentManager";
import { EmergencySupport } from "../../components/diaspora/EmergencySupport";
import { ExchangeRateOptimizer } from "../../components/diaspora/ExchangeRateOptimizer";
import { FamilyConnections } from "../../components/diaspora/FamilyConnections";
import { ImpactTracker } from "../../components/diaspora/ImpactTracker";
import { RemittanceOverview } from "../../components/diaspora/RemittanceOverview";
import { SmartSendingSuggestions } from "../../components/diaspora/SmartSendingSuggestions";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface DiasporaDashboardProps {
  onNavigate?: (route: string) => void;
}

export const DiasporaDashboard: React.FC<DiasporaDashboardProps> = ({
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
  const diasporaScale = useSharedValue(0.95);

  // Diaspora-specific state
  const [remittanceStats, setRemittanceStats] = useState({
    totalSent: 0,
    monthlyAverage: 0,
    savedAmount: 0,
    familyMembers: 0,
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState({});

  useEffect(() => {
    initializeDiasporaEntrance();
    loadDiasporaData();
  }, []);

  const initializeDiasporaEntrance = () => {
    fadeInProgress.value = withTiming(1, { duration: 1100 });
    diasporaScale.value = withSpring(1, {
      damping: 14,
      stiffness: 130,
    });
  };

  const loadDiasporaData = async () => {
    // TODO: Load real diaspora data from API
    setRemittanceStats({
      totalSent: 12450.75,
      monthlyAverage: 850.25,
      savedAmount: 340.5,
      familyMembers: 6,
    });

    setFamilyMembers([
      {
        id: "1",
        name: "Maman Marie",
        relationship: "Mother",
        location: "Port-au-Prince",
        lastReceived: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        amount: 200,
        status: "active",
        needs: ["medical", "groceries"],
      },
      {
        id: "2",
        name: "Frère Jean",
        relationship: "Brother",
        location: "Cap-Haïtien",
        lastReceived: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        amount: 150,
        status: "active",
        needs: ["education", "transportation"],
      },
      {
        id: "3",
        name: "Tante Sophie",
        relationship: "Aunt",
        location: "Jacmel",
        lastReceived: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        amount: 100,
        status: "pending",
        needs: ["housing", "utilities"],
      },
    ]);

    setExchangeRates({
      USD_HTG: { rate: 145.5, trend: "stable", lastUpdate: new Date() },
      CAD_HTG: { rate: 107.25, trend: "up", lastUpdate: new Date() },
      EUR_HTG: { rate: 157.8, trend: "down", lastUpdate: new Date() },
    });

    setRecentTransactions([
      {
        id: "1",
        recipient: "Maman Marie",
        amount: 200,
        currency: "USD",
        status: "completed",
        date: new Date(),
      },
      {
        id: "2",
        recipient: "Frère Jean",
        amount: 150,
        currency: "USD",
        status: "completed",
        date: new Date(),
      },
    ]);

    setUpcomingEvents([
      {
        id: "1",
        name: "Fête des Mères",
        date: new Date(2024, 4, 26),
        type: "holiday",
      },
      {
        id: "2",
        name: "Independence Day",
        date: new Date(2024, 0, 1),
        type: "national",
      },
      {
        id: "3",
        name: "Maman Marie Birthday",
        date: new Date(2024, 6, 15),
        type: "family",
      },
    ]);

    setImpactMetrics({
      familiesHelped: 6,
      educationSupported: 2,
      medicalAssistance: 4,
      businessStarted: 1,
      communityProjects: 3,
    });
  };

  const handleDiasporaAction = (action: string) => {
    updateBehaviorPattern(`diaspora_${action}`);

    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    switch (action) {
      case "send_money":
        onNavigate?.("send-remittance");
        break;
      case "family_chat":
        onNavigate?.("family-chat");
        break;
      case "exchange_rates":
        onNavigate?.("exchange-rates");
        break;
      case "documents":
        onNavigate?.("documents");
        break;
      case "emergency":
        onNavigate?.("emergency");
        break;
      case "cultural_events":
        onNavigate?.("cultural-calendar");
        break;
      case "impact_report":
        onNavigate?.("impact-report");
        break;
      case "family_goals":
        onNavigate?.("family-goals");
        break;
      default:
        console.log(`Diaspora action: ${action}`);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInProgress.value,
      transform: [
        {
          scale: diasporaScale.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Remittance Overview */}
      <QuantumCard
        style={styles.remittanceCard}
        glowColor={theme.primary}
        theme={theme}
      >
        <RemittanceOverview
          stats={remittanceStats}
          monthlyGrowth={12.5}
          savingsRate={8.2}
          theme={theme}
          onSendMoney={() => handleDiasporaAction("send_money")}
          onViewHistory={() => {
            updateBehaviorPattern("view_remittance_history");
            onNavigate?.("remittance-history");
          }}
        />
      </QuantumCard>

      {/* Diaspora Actions Grid */}
      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text_primary }]}>
          Family Support
        </Text>
        <View style={styles.actionsGrid}>
          {[
            {
              id: "send_money",
              icon: "send",
              label: "Send Money",
              color: theme.success,
            },
            {
              id: "family_chat",
              icon: "chat",
              label: "Family Chat",
              color: theme.info,
            },
            {
              id: "exchange_rates",
              icon: "trending-up",
              label: "Rates",
              color: theme.warning,
            },
            {
              id: "documents",
              icon: "description",
              label: "Documents",
              color: theme.accent,
            },
            {
              id: "emergency",
              icon: "emergency",
              label: "Emergency",
              color: theme.error,
            },
            {
              id: "cultural_events",
              icon: "event",
              label: "Events",
              color: theme.secondary,
            },
          ].map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { borderColor: action.color }]}
              onPress={() => handleDiasporaAction(action.id)}
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

      {/* Family Connections */}
      <QuantumCard
        style={styles.familyCard}
        glowColor={theme.info}
        theme={theme}
      >
        <FamilyConnections
          familyMembers={familyMembers}
          theme={theme}
          onMemberSelect={(memberId) => {
            updateBehaviorPattern(`family_member_${memberId}`);
            onNavigate?.(`family/${memberId}`);
          }}
          onSendToMember={(memberId) => {
            updateBehaviorPattern(`quick_send_${memberId}`);
            onNavigate?.(`send/${memberId}`);
          }}
          onVideoCall={(memberId) => {
            updateBehaviorPattern(`video_call_${memberId}`);
            onNavigate?.(`call/${memberId}`);
          }}
        />
      </QuantumCard>

      {/* Exchange Rate Optimizer */}
      <QuantumCard
        style={styles.exchangeCard}
        glowColor={theme.warning}
        theme={theme}
      >
        <ExchangeRateOptimizer
          rates={exchangeRates}
          userCurrency="USD"
          targetCurrency="HTG"
          sendingAmount={200}
          theme={theme}
          onOptimalTimeAlert={() => {
            updateBehaviorPattern("set_rate_alert");
          }}
          onRateAnalysis={() => handleDiasporaAction("exchange_rates")}
        />
      </QuantumCard>

      {/* Smart Sending Suggestions */}
      <QuantumCard
        style={styles.suggestionsCard}
        glowColor={theme.accent}
        theme={theme}
      >
        <SmartSendingSuggestions
          suggestions={[
            {
              type: "timing",
              title: "Send today for better rate",
              description: "HTG rate up 2.3% - save $4.60 on $200",
              urgency: "high",
              savings: 4.6,
            },
            {
              type: "bundle",
              title: "Combine family sends",
              description:
                "Send to Maman Marie & Frère Jean together - save on fees",
              urgency: "medium",
              savings: 8.5,
            },
            {
              type: "schedule",
              title: "Maman Marie birthday coming",
              description: "Schedule send for July 15th (in 12 days)",
              urgency: "low",
              savings: 0,
            },
          ]}
          theme={theme}
          onSuggestionAction={(suggestionId, action) => {
            updateBehaviorPattern(`suggestion_${action}_${suggestionId}`);
          }}
        />
      </QuantumCard>

      {/* Cultural Calendar */}
      <QuantumCard
        style={styles.culturalCard}
        glowColor={theme.secondary}
        theme={theme}
      >
        <CulturalCalendar
          upcomingEvents={upcomingEvents}
          haitianHolidays={[
            { name: "Jour de l'An", date: "2024-01-01" },
            { name: "Fête des Ancêtres", date: "2024-01-02" },
            { name: "Carnaval National", date: "2024-02-12" },
          ]}
          theme={theme}
          onEventSelect={(eventId) => {
            updateBehaviorPattern(`cultural_event_${eventId}`);
          }}
          onSetReminder={(eventId) => {
            updateBehaviorPattern(`reminder_set_${eventId}`);
          }}
        />
      </QuantumCard>

      {/* Impact Tracker */}
      <QuantumCard
        style={styles.impactCard}
        glowColor={theme.success}
        theme={theme}
      >
        <ImpactTracker
          metrics={impactMetrics}
          stories={[
            {
              id: "1",
              title: "Jean started his business",
              description:
                "With your support, Jean opened a small shop in Cap-Haïtien",
              image: null,
              date: new Date(),
            },
            {
              id: "2",
              title: "Sophie finished nursing school",
              description:
                "Your education support helped Sophie graduate as a nurse",
              image: null,
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          ]}
          theme={theme}
          onViewFullReport={() => handleDiasporaAction("impact_report")}
          onShareStory={(storyId) => {
            updateBehaviorPattern(`share_impact_${storyId}`);
          }}
        />
      </QuantumCard>

      {/* Document Manager */}
      <QuantumCard
        style={styles.documentsCard}
        glowColor={theme.info}
        theme={theme}
      >
        <DocumentManager
          documents={[
            {
              id: "1",
              type: "passport",
              name: "US Passport",
              status: "valid",
              expiry: new Date(2029, 5, 15),
            },
            {
              id: "2",
              type: "id_card",
              name: "Haitian ID",
              status: "expired",
              expiry: new Date(2023, 11, 20),
            },
            {
              id: "3",
              type: "birth_certificate",
              name: "Birth Certificate",
              status: "valid",
              expiry: null,
            },
          ]}
          familyDocuments={[
            {
              id: "1",
              owner: "Maman Marie",
              type: "id_card",
              status: "needs_renewal",
            },
            {
              id: "2",
              owner: "Frère Jean",
              type: "birth_certificate",
              status: "valid",
            },
          ]}
          theme={theme}
          onDocumentAction={(docId, action) => {
            updateBehaviorPattern(`document_${action}_${docId}`);
          }}
          onManageDocuments={() => handleDiasporaAction("documents")}
        />
      </QuantumCard>

      {/* Emergency Support */}
      <QuantumCard
        style={styles.emergencyCard}
        glowColor={theme.error}
        theme={theme}
      >
        <EmergencySupport
          emergencyContacts={[
            {
              id: "1",
              name: "Maman Marie",
              phone: "+509-1234-5678",
              relationship: "Mother",
            },
            {
              id: "2",
              name: "Frère Jean",
              phone: "+509-2345-6789",
              relationship: "Brother",
            },
          ]}
          emergencyServices={[
            { name: "Police", number: "114", location: "Port-au-Prince" },
            {
              name: "Hospital",
              number: "+509-2222-3333",
              location: "Cap-Haïtien",
            },
          ]}
          recentAlerts={[]}
          theme={theme}
          onEmergencyCall={(contactId) => {
            updateBehaviorPattern(`emergency_call_${contactId}`);
          }}
          onQuickSend={(amount, contactId) => {
            updateBehaviorPattern(`emergency_send_${contactId}`);
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
  remittanceCard: {
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
  familyCard: {
    marginBottom: 20,
  },
  exchangeCard: {
    marginBottom: 20,
  },
  suggestionsCard: {
    marginBottom: 20,
  },
  culturalCard: {
    marginBottom: 20,
  },
  impactCard: {
    marginBottom: 20,
  },
  documentsCard: {
    marginBottom: 20,
  },
  emergencyCard: {
    marginBottom: 40,
  },
});
