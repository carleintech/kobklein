import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const TestScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={["#0F2A6B", "#1E40AF", "#3B82F6"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>✅ React is Working!</Text>
        <Text style={styles.subtitle}>KobKlein Mobile App Test</Text>
        <Text style={styles.description}>
          If you can see this, React Native Web is functioning properly.
        </Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            🚀 Status: Ready for Development
          </Text>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E7FF",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#A5B4FC",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  statusCard: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  statusText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
  },
});
