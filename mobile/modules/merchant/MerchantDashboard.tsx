/**
 * 🏪 MERCHANT DASHBOARD MODULE
 * Revolutionary AI-powered business management & POS system
 * Features: Smart inventory, customer analytics, revenue optimization, fraud detection
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

import { QuantumCard } from "../../components/cards/QuantumCard";
import { BusinessGoalsTracker } from "../../components/merchant/BusinessGoalsTracker";
import { CustomerInsights } from "../../components/merchant/CustomerInsights";
import { InventoryOverview } from "../../components/merchant/InventoryOverview";
import { PaymentMethodsGrid } from "../../components/merchant/PaymentMethodsGrid";
import { QRCodeGenerator } from "../../components/merchant/QRCodeGenerator";
import { RevenueAnalytics } from "../../components/merchant/RevenueAnalytics";
import { SmartPOSSystem } from "../../components/merchant/SmartPOSSystem";
import { FraudDetectionWidget } from "../../components/security/FraudDetectionWidget";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface MerchantDashboardProps {
  onNavigate?: (route: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
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
  const businessMetricsScale = useSharedValue(0.95);

  // Business dashboard state
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [customerInsights, setCustomerInsights] = useState({});

  useEffect(() => {
    initializeBusinessEntrance();
    loadBusinessData();
  }, []);

  const initializeBusinessEntrance = () => {
    fadeInProgress.value = withTiming(1, { duration: 900 });
    businessMetricsScale.value = withSpring(1, {
      damping: 18,
      stiffness: 160,
    });
  };

  const loadBusinessData = async () => {
    // TODO: Load real business data from API
    setTodayRevenue(1847.5);
    setWeeklyRevenue(12340.25);
    setMonthlyRevenue(45678.9);
    setTransactionCount(127);
    setAverageTicket(68.45);

    setTopProducts([
      { id: "1", name: "Griot Combo", sales: 45, revenue: 675.0 },
      { id: "2", name: "Diri ak Djon Djon", sales: 38, revenue: 570.0 },
      { id: "3", name: "Banann Boukannen", sales: 32, revenue: 320.0 },
    ]);

    setLowStockItems([
      { id: "1", name: "Djon Djon Rice", currentStock: 5, minStock: 20 },
      { id: "2", name: "Plantain", currentStock: 12, minStock: 30 },
    ]);

    setCustomerInsights({
      totalCustomers: 342,
      returningCustomers: 78,
      newCustomers: 23,
      averageVisits: 2.4,
      peakHours: ["12:00-13:00", "18:00-20:00"],
    });
  };

  const handleBusinessAction = (action: string) => {
    updateBehaviorPattern(`merchant_${action}`);

    if (adaptiveUX.haptic_intensity > 30) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    switch (action) {
      case "new_sale":
        onNavigate?.("pos");
        break;
      case "inventory":
        onNavigate?.("inventory");
        break;
      case "analytics":
        onNavigate?.("analytics");
        break;
      case "customers":
        onNavigate?.("customers");
        break;
      case "settings":
        onNavigate?.("business-settings");
        break;
      case "qr_code":
        onNavigate?.("qr-generator");
        break;
      case "promotions":
        onNavigate?.("promotions");
        break;
      case "reports":
        onNavigate?.("reports");
        break;
      default:
        console.log(`Business action: ${action}`);
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInProgress.value,
      transform: [
        {
          scale: businessMetricsScale.value,
        },
      ],
    };
  });

  const dailyGrowth =
    ((todayRevenue - weeklyRevenue / 7) / (weeklyRevenue / 7)) * 100;
  const weeklyGrowth =
    ((weeklyRevenue - monthlyRevenue / 4) / (monthlyRevenue / 4)) * 100;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Revenue Analytics Overview */}
      <QuantumCard
        style={styles.revenueCard}
        glowColor={theme.success}
        theme={theme}
      >
        <RevenueAnalytics
          todayRevenue={todayRevenue}
          weeklyRevenue={weeklyRevenue}
          monthlyRevenue={monthlyRevenue}
          transactionCount={transactionCount}
          averageTicket={averageTicket}
          dailyGrowth={dailyGrowth}
          weeklyGrowth={weeklyGrowth}
          theme={theme}
          onViewDetailed={() => {
            updateBehaviorPattern("view_revenue_analytics");
            onNavigate?.("analytics");
          }}
        />
      </QuantumCard>

      {/* Smart POS Quick Access */}
      <QuantumCard
        style={styles.posCard}
        glowColor={theme.primary}
        theme={theme}
      >
        <SmartPOSSystem
          quickMode={true}
          recentProducts={topProducts}
          theme={theme}
          onNewSale={() => handleBusinessAction("new_sale")}
          onProductSelect={(productId) => {
            updateBehaviorPattern(`quick_sell_${productId}`);
          }}
        />
      </QuantumCard>

      {/* Business Actions Grid */}
      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text_primary }]}>
          Business Operations
        </Text>
        <PaymentMethodsGrid
          actions={[
            {
              id: "new_sale",
              icon: "point-of-sale",
              label: "New Sale",
              color: theme.success,
            },
            {
              id: "inventory",
              icon: "inventory",
              label: "Inventory",
              color: theme.warning,
            },
            {
              id: "customers",
              icon: "people",
              label: "Customers",
              color: theme.info,
            },
            {
              id: "analytics",
              icon: "analytics",
              label: "Analytics",
              color: theme.accent,
            },
            {
              id: "qr_code",
              icon: "qr-code",
              label: "QR Menu",
              color: theme.secondary,
            },
            {
              id: "promotions",
              icon: "local-offer",
              label: "Promos",
              color: theme.error,
            },
          ]}
          onActionPress={handleBusinessAction}
          theme={theme}
          adaptiveUX={adaptiveUX}
        />
      </View>

      {/* Inventory Overview */}
      <QuantumCard
        style={styles.inventoryCard}
        glowColor={lowStockItems.length > 0 ? theme.warning : theme.info}
        theme={theme}
      >
        <InventoryOverview
          lowStockItems={lowStockItems}
          topSellingProducts={topProducts}
          totalProducts={156}
          categoriesCount={12}
          theme={theme}
          onViewInventory={() => handleBusinessAction("inventory")}
          onRestockItem={(itemId) => {
            updateBehaviorPattern(`restock_${itemId}`);
            onNavigate?.(`inventory/restock/${itemId}`);
          }}
        />
      </QuantumCard>

      {/* Customer Insights */}
      <QuantumCard
        style={styles.customersCard}
        glowColor={theme.info}
        theme={theme}
      >
        <CustomerInsights
          insights={customerInsights}
          peakHours={customerInsights.peakHours}
          loyaltyMetrics={{
            totalPoints: 15420,
            activeMembers: 89,
            redemptions: 34,
          }}
          theme={theme}
          onViewCustomers={() => handleBusinessAction("customers")}
          onCreatePromotion={() => handleBusinessAction("promotions")}
        />
      </QuantumCard>

      {/* Business Goals Tracker */}
      <QuantumCard
        style={styles.goalsCard}
        glowColor={theme.accent}
        theme={theme}
      >
        <BusinessGoalsTracker
          goals={[
            {
              id: "monthly_revenue",
              title: "Monthly Revenue",
              current: monthlyRevenue,
              target: 50000,
              category: "revenue",
              color: theme.success,
            },
            {
              id: "new_customers",
              title: "New Customers",
              current: customerInsights.newCustomers,
              target: 50,
              category: "growth",
              color: theme.info,
            },
            {
              id: "inventory_turnover",
              title: "Inventory Efficiency",
              current: 85,
              target: 90,
              category: "operations",
              color: theme.warning,
            },
          ]}
          theme={theme}
          onGoalPress={(goalId) => {
            updateBehaviorPattern(`business_goal_${goalId}`);
            onNavigate?.("business-goals");
          }}
        />
      </QuantumCard>

      {/* QR Code Generator for Menu/Payments */}
      <QuantumCard
        style={styles.qrCard}
        glowColor={theme.secondary}
        theme={theme}
      >
        <QRCodeGenerator
          businessInfo={{
            name: user?.business_name || "My Business",
            id: user?.id,
            paymentMethods: ["kobklein", "cash", "card"],
          }}
          menuUrl={`https://kobklein.app/menu/${user?.id}`}
          theme={theme}
          onShareQR={() => {
            updateBehaviorPattern("share_business_qr");
          }}
          onPrintQR={() => {
            updateBehaviorPattern("print_business_qr");
          }}
        />
      </QuantumCard>

      {/* Fraud Detection & Security */}
      <QuantumCard
        style={styles.securityCard}
        glowColor={theme.error}
        theme={theme}
      >
        <FraudDetectionWidget
          riskLevel="low"
          suspiciousTransactions={[]}
          securityScore={94}
          recommendations={[
            "All systems secure",
            "Customer verification active",
            "No unusual patterns detected",
          ]}
          theme={theme}
          onViewSecurity={() => {
            updateBehaviorPattern("view_security_dashboard");
            onNavigate?.("security");
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
  revenueCard: {
    marginBottom: 20,
  },
  posCard: {
    marginBottom: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  inventoryCard: {
    marginBottom: 20,
  },
  customersCard: {
    marginBottom: 20,
  },
  goalsCard: {
    marginBottom: 20,
  },
  qrCard: {
    marginBottom: 20,
  },
  securityCard: {
    marginBottom: 40,
  },
});
