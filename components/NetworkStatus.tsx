import React, { useEffect, useState } from "react";
import { StyleSheet, Animated, View, Text } from "react-native";
import { useNetworkState } from "@/hooks/useNetworkState";
import { Colors } from "@/constants/Colors";
import { storage } from "@/utils/storage";

export function NetworkStatus() {
  const { isConnected } = useNetworkState();
  const [pendingScans, setPendingScans] = useState<number>(0);
  const [translateY] = useState(new Animated.Value(-100));

  useEffect(() => {
    const checkPendingScans = async () => {
      const scans = await storage.getPendingScans();
      setPendingScans(scans.length);
    };

    checkPendingScans();

    // Check every 30 seconds for pending scans
    const interval = setInterval(checkPendingScans, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: !isConnected || pendingScans > 0 ? 0 : -100,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isConnected, pendingScans]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          backgroundColor: !isConnected
            ? Colors.light.error
            : Colors.light.primary,
        },
      ]}
    >
      <View style={styles.content}>
        {!isConnected ? (
          <Text style={styles.text}>
            You're offline - Scans will be saved locally
          </Text>
        ) : pendingScans > 0 ? (
          <Text style={styles.text}>
            {pendingScans} pending {pendingScans === 1 ? "scan" : "scans"} will
            sync automatically
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingTop: 35, // Account for status bar
  },
  content: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.light.textInverted,
    fontFamily: "Inter-Bold",
    fontSize: 14,
    textAlign: "center",
  },
});
