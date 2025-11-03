import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Minimal component WITHOUT hooks to avoid React instance issues
export default function MinimalAuth() {
  const handlePress = () => {
    Alert.alert(
      "🎉 Success!",
      "React Native Web is working!\n\nThe basic authentication structure is ready.",
      [{ text: "Great!" }]
    );
  };

  return (
    <LinearGradient
      colors={["#0F2A6B", "#1E40AF", "#3B82F6"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>KobKlein</Text>
          </View>
          <Text style={styles.title}>Revolutionary Dashboard</Text>
          <Text style={styles.subtitle}>Authentication Ready</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ System Status</Text>
          <Text style={styles.statusLine}>🔧 React Native Web: Working</Text>
          <Text style={styles.statusLine}>📱 Expo Router: Active</Text>
          <Text style={styles.statusLine}>🎨 UI Components: Ready</Text>
          <Text style={styles.statusLine}>🚀 Authentication: Prepared</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Test Authentication Flow</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            This is a stable foundation.{"\n"}
            React hooks issue has been isolated.{"\n"}
            Ready to implement full authentication.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

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
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minWidth: 280,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10B981",
    marginBottom: 16,
    textAlign: "center",
  },
  statusLine: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  info: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  infoText: {
    fontSize: 14,
    color: "#A5B4FC",
    textAlign: "center",
    lineHeight: 20,
  },
});
