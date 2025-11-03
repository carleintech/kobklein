import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 25 : 20,
            left: 20,
            right: 20,
            backgroundColor: "rgba(15, 42, 107, 0.95)",
            borderRadius: 20,
            borderTopColor: "transparent",
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 25 : 15,
            height: Platform.OS === 'ios' ? 85 : 75,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          },
          tabBarActiveTintColor: "#10B981",
          tabBarInactiveTintColor: "#A5B4FC",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarItemStyle: {
            borderRadius: 15,
            marginHorizontal: 2,
            paddingVertical: 5,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                size={focused ? size + 4 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Balance",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "wallet" : "wallet-outline"}
                size={focused ? size + 4 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "AI Insights",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "bulb" : "bulb-outline"}
                size={focused ? size + 4 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={focused ? size + 4 : size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}