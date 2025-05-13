import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { NetworkStatus } from "../../components/NetworkStatus";
import { qrCodeUtils } from "../../utils/qrcode";
import { storage } from "../../utils/storage";
import { useNetworkState } from "../../hooks/useNetworkState";
import { Colors } from "@/constants/Colors";

export default function ScanScreen() {
  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { isConnected } = useNetworkState();
  const [pendingScans, setPendingScans] = useState<number>(0);

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          We need your permission to scan QR codes
        </ThemedText>
        <Button onPress={requestPermission} title="Grant Permission" />
      </ThemedView>
    );
  }

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    try {
      if (!qrCodeUtils.validateQRData(data)) {
        alert("Invalid QR code format");
        return;
      }

      const courseData = qrCodeUtils.parseQRData(data);
      const courseId =
        courseData && typeof courseData === "object" && "id" in courseData
          ? courseData.id
          : undefined;

      if (!isConnected) {
        await storage.savePendingScan({
          type: "course_scan",
          data: courseData,
          timestamp: Date.now(),
        });
        const scans = await storage.getPendingScans();
        setPendingScans(scans.length);
        alert("Scan saved and will be processed when back online.");
      } else {
        if (courseId) {
          router.push(`/(tabs)/results/${courseId}`);
        } else {
          alert("Invalid course data: missing course ID");
        }
      }
    } catch (error) {
      console.error("Scan processing failed:", error);
      alert("Failed to process QR code");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <NetworkStatus />
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <Text style={styles.scanText}>Scan Course QR Code</Text>
          </View>
        </View>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
    borderRadius: 10,
  },
  scanText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Inter-Bold",
    textAlign: "center",
  },
  offlineBanner: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  offlineText: {
    color: Colors.light.primary,
    fontFamily: "Inter-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  pendingText: {
    color: "#fff",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    marginTop: 5,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
