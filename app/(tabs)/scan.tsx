import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
import { storage } from "../../utils/storage";
import { useNetworkState } from "../../hooks/useNetworkState";
import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyQRCode,
  clearVerificationResult,
} from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { fetchStudentCourses, clearCourses } from "@/store/slices/courseSlice";

export default function ScanScreen() {
  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { isConnected } = useNetworkState();
  const [pendingScans, setPendingScans] = useState<number>(0);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const verificationResult = useSelector(
    (state: RootState) => state.auth.verificationResult
  );
  const verificationLoading = useSelector(
    (state: RootState) => state.auth.verificationLoading
  );
  const verificationError = useSelector(
    (state: RootState) => state.auth.verificationError
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedPayload, setScannedPayload] = useState<string | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [filter, setFilter] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const courses = useSelector((state: RootState) => state.courses.courses);
  const coursesLoading = useSelector(
    (state: RootState) => state.courses.loading
  );
  const coursesError = useSelector((state: RootState) => state.courses.error);

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
      if (!data) {
        alert("No QR code data found");
        return;
      }
      console.log("Scanned QR data:", data);
      setScannedPayload(data);
      // Try to parse QR code to extract matricule
      let matricule = null;
      try {
        const parsed = JSON.parse(data);
        console.log("Parsed QR payload:", parsed);
        matricule = parsed.matricule;
      } catch (e) {
        alert("Invalid QR code format");
        return;
      }
      console.log("Matricule:", matricule);
      console.log("Token:", token);
      if (!matricule || !token) {
        alert("Missing matricule or token");
        return;
      }
      dispatch(clearCourses()); // Clear before fetching new courses
      // @ts-ignore
      dispatch(fetchStudentCourses({ matricule, token }));
      setModalVisible(true);
    } catch (error) {
      console.error("Scan processing failed:", error);
      alert("Failed to process QR code");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setScannedPayload(null);
    setCourseCode("");
    dispatch(clearVerificationResult());
    dispatch(clearCourses()); // Clear fetched courses
  };

  const handleScanAgain = () => {
    setScannedPayload(null);
    setCourseCode("");
    dispatch(clearVerificationResult());
    setModalVisible(false);
    dispatch(clearCourses()); // Clear fetched courses
    // Optionally, you could re-open the modal or just let the user scan again
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
            <Text style={styles.scanText}>Scan Student QR Code</Text>
          </View>
        </View>
      </CameraView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registered Courses</Text>
            <Text style={styles.modalSubtitle}>
              Search or filter courses below:
            </Text>
            <TextInput
              value={filter}
              onChangeText={setFilter}
              placeholder="Search by code or title..."
              style={styles.input}
              placeholderTextColor={Colors.light.textSecondary}
              autoCapitalize="characters"
              accessible
              accessibilityLabel="Course search input"
            />
            <View style={{ maxHeight: 180, marginBottom: Theme.spacing.md }}>
              {coursesLoading ? (
                <ActivityIndicator size="small" color={Colors.light.primary} />
              ) : Array.isArray(courses) && courses.length > 0 ? (
                <View>
                  {courses
                    .filter(
                      (course) =>
                        course.code
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                        course.title
                          .toLowerCase()
                          .includes(filter.toLowerCase())
                    )
                    .map((course, idx) => (
                      <View
                        key={course.code}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Theme.fontFamily.bold,
                            color: Colors.light.primary,
                            marginRight: 8,
                          }}
                        >
                          {idx + 1}.
                        </Text>
                        <Text
                          style={{
                            fontFamily: Theme.fontFamily.regular,
                            color: Colors.light.text,
                          }}
                        >
                          {course.code} - {course.title}
                        </Text>
                      </View>
                    ))}
                </View>
              ) : (
                <Text style={{ color: Colors.light.textSecondary }}>
                  No registered courses found.
                </Text>
              )}
              {/* Error state for course fetch */}
              {!coursesLoading &&
                (!Array.isArray(courses) || courses.length === 0) && (
                  <Text style={{ color: Colors.light.error, marginTop: 8 }}>
                    {coursesError || ""}
                  </Text>
                )}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.secondaryButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    padding: Theme.spacing.xl,
    borderRadius: Theme.radius.lg,
    width: 340,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "stretch",
  },
  modalTitle: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.subtitle,
    color: Colors.light.primary,
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.text,
    marginBottom: Theme.spacing.sm,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Theme.radius.sm,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  resultContainer: {
    marginBottom: Theme.spacing.md,
    alignItems: "center",
  },
  resultText: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    marginBottom: Theme.spacing.sm,
    textAlign: "center",
  },
  resultDetail: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: 2,
    textAlign: "center",
  },
  errorText: {
    color: Colors.light.error,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    marginBottom: Theme.spacing.sm,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Theme.spacing.sm,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.light.textInverted,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    marginLeft: 0,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    letterSpacing: 0.5,
  },
});
