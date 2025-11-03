import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const SimpleTestDashboard: React.FC = () => {
  return (
    <LinearGradient
      colors={["#0F2A6B", "#1E40AF", "#3B82F6"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>🚀 Revolutionary Adaptive Dashboard</Text>
        <Text style={styles.subtitle}>KobKlein Mobile App is Working!</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Balance</Text>
            <Text style={styles.cardValue}>$12,345.67</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Portfolio</Text>
            <Text style={styles.cardValue}>+15.2%</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Test Action</Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          ✅ Expo Web is working{"\n"}✅ React Native Web is functioning{"\n"}✅
          Basic navigation is set up{"\n"}
          🔄 Ready for revolutionary features!
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E7FF",
    textAlign: "center",
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    minWidth: 120,
  },
  cardTitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#E0E7FF",
    textAlign: "center",
    lineHeight: 20,
  },
});
