import { Tabs } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
        },
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontFamily: "Inter-Regular",
          fontSize: 12,
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" color={color} size={24} />
          ),
          headerTitle: "My QR Code",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="qrcode" color={color} size={24} />
          ),
          headerTitle: "Scan QR Code",
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="clock.fill" color={color} size={24} />
          ),
          headerTitle: "Scan History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" color={color} size={24} />
          ),
          // headerShown: false,
        }}
      />
      <Tabs.Screen name="results" options={{ href: null }} />
    </Tabs>
  );
}
