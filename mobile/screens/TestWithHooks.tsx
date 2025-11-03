import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const TestWithHooks: React.FC = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("React Hooks are working!");

  const handlePress = () => {
    setCount(count + 1);
    setMessage(
      `Button pressed ${count + 1} time${count + 1 === 1 ? "" : "s"}!`
    );
  };

  return (
    <LinearGradient
      colors={["#0F2A6B", "#1E40AF", "#3B82F6"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>✅ React Hooks Test</Text>
        <Text style={styles.subtitle}>KobKlein Mobile App</Text>

        <View style={styles.testCard}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.counter}>Count: {count}</Text>

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Test useState Hook</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.status}>
          🎉 If you can see this and click the button, React hooks are working
          perfectly!
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
    marginBottom: 30,
    textAlign: "center",
  },
  testCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
    minWidth: 250,
  },
  message: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  counter: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    fontSize: 14,
    color: "#A5B4FC",
    textAlign: "center",
    lineHeight: 20,
  },
});
