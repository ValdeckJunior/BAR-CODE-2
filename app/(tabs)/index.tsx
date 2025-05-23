import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { fetchStudentQRCode } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const qrCodeImage = useSelector((state: RootState) => state.auth.qrCodeImage);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (user && token) {
      // @ts-ignore
      dispatch(fetchStudentQRCode({ matricule: user.matricule, token }));
    }
  }, [user, token, dispatch]);

  const handleDownloadQR = async () => {
    try {
      setDownloadLoading(true);
      if (!permissionResponse?.granted) {
        const { status, canAskAgain } = await requestPermission();
        if (status !== "granted") {
          setDownloadLoading(false);
          if (!canAskAgain) {
            Alert.alert(
              "Permission Denied",
              "You have denied media library permissions and cannot download the QR code. Please enable permissions in your device settings.",
              [{ text: "OK" }]
            );
          } else {
            Alert.alert(
              "Permission Required",
              "Sorry, we need media library permissions to download the QR code.",
              [{ text: "OK" }]
            );
          }
          return;
        }
      }
      if (!qrCodeImage) {
        setDownloadLoading(false);
        Alert.alert("Error", "No QR code image to download");
        return;
      }
      // Save base64 image to file and then to media library
      const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
      const timestamp = new Date().getTime();
      const filePath = `${FileSystem.cacheDirectory}qrcode-${timestamp}.png`;
      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const asset = await MediaLibrary.createAssetAsync(filePath);
      const album = await MediaLibrary.getAlbumAsync("QR Campus");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("QR Campus", asset, false);
      }
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      setDownloadLoading(false);
      Alert.alert(
        "Success",
        "QR Code saved to your photos in 'QR Campus' album!",
        [{ text: "OK" }]
      );
    } catch (error) {
      setDownloadLoading(false);
      console.error("Process error:", error);
      Alert.alert(
        "Error",
        "Failed to process QR code. Please check permissions and try again."
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your QR code</Text>
      </View>
    );
  }

  // If user is ADMIN (invigilator), show only the scan page
  if (user.role === "ADMIN") {
    const ScanScreen = require("./scan").default;
    return (
      <>
        <ScanScreen />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch(require("@/store/slices/authSlice").logoutUser());
            router.replace("/");
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <SafeAreaProvider style={{ paddingTop: top }}>
      <View style={styles.container}>
        <View style={styles.qrCodeContainer}>
          <View style={styles.avatarHomeContainer}>
            <View style={styles.avatarHome}>
              <Text style={styles.avatarHomeText}>
                {user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0]?.toUpperCase())
                  .join("")}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.matricule}>{user.matricule}</Text>
          <Text style={styles.level}>{user.level}</Text>
          <Text style={styles.subtitle}>Scan my QR code</Text>
          <View style={styles.qrWrapper}>
            {loading && !qrCodeImage ? (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            ) : qrCodeImage ? (
              <Image
                source={{ uri: qrCodeImage }}
                style={{ width: 250, height: 250 }}
                resizeMode="contain"
              />
            ) : (
              <Text>No QR code available</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.primary }]}
          onPress={handleDownloadQR}
          disabled={downloadLoading}
        >
          {downloadLoading ? (
            <ActivityIndicator size="small" color={Colors.light.textInverted} />
          ) : (
            <Text style={styles.buttonText}>Download QR Code</Text>
          )}
        </TouchableOpacity>
        {/* Logout button removed as requested */}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: "center",
    gap: Theme.spacing.lg,
    backgroundColor: Colors.light.background,
  },
  qrCodeContainer: {
    backgroundColor: Colors.light.surface,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
    position: "relative",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarHomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.lg,
    marginTop: -45,
    zIndex: 2,
  },
  avatarHome: {
    backgroundColor: Colors.light.primary,
    borderRadius: 45,
    height: 90,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.light.surface,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarHomeText: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: 36,
    color: Colors.light.textInverted,
    letterSpacing: 2,
  },
  name: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    color: Colors.light.text,
    marginTop: Theme.spacing.lg,
    letterSpacing: 0.5,
  },
  matricule: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  level: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.text,
    marginTop: Theme.spacing.xs,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.radius.sm,
    overflow: "hidden",
  },
  subtitle: {
    fontFamily: Theme.fontFamily.bold,
    color: Colors.light.accent,
    marginVertical: Theme.spacing.md,
    fontSize: Theme.fontSize.subtitle,
    letterSpacing: 0.2,
  },
  qrWrapper: {
    backgroundColor: Colors.light.background,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    height: 280,
    width: 280,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Theme.spacing.md,
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: Colors.light.textInverted,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    letterSpacing: 0.5,
  },
  message: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.xl,
  },
});
