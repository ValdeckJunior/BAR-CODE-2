import { Colors } from "@/constants/Colors";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { qrCodeUtils } from "@/utils/qrcode";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const qrRef = useRef(null);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleDownloadQR = async () => {
    try {
      if (!permissionResponse?.granted) {
        const { status } = await requestPermission();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need media library permissions to download the QR code.",
            [{ text: "OK" }]
          );
          return;
        }
      }

      if (!qrRef.current || !user) {
        Alert.alert("Error", "Could not generate QR code");
        return;
      }

      // Generate a unique filename with timestamp
      const timestamp = new Date().getTime();
      const filePath = `${FileSystem.cacheDirectory}qrcode-${timestamp}.png`;

      // Get SVG ref and convert to PNG with error handling
      qrRef.current?.toDataURL(async (dataURL) => {
        try {
          // Ensure we have valid data
          if (!dataURL) {
            throw new Error("Failed to generate QR code image");
          }

          const base64Data = dataURL.split(",")[1];
          await FileSystem.writeAsStringAsync(filePath, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Save to media library
          const asset = await MediaLibrary.createAssetAsync(filePath);
          const album = await MediaLibrary.getAlbumAsync("QR Campus");

          if (album) {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          } else {
            await MediaLibrary.createAlbumAsync("QR Campus", asset, false);
          }

          // Clean up the temporary file
          await FileSystem.deleteAsync(filePath, { idempotent: true });

          Alert.alert(
            "Success",
            "QR Code saved to your photos in 'QR Campus' album!",
            [{ text: "OK" }]
          );
        } catch (error) {
          console.error("Save error:", error);
          Alert.alert(
            "Error",
            "Failed to save QR code to photos. Please try again."
          );
        }
      });
    } catch (error) {
      console.error("Process error:", error);
      Alert.alert(
        "Error",
        "Failed to process QR code. Please check permissions and try again."
      );
    }
  };

  const qrData = user
    ? qrCodeUtils.generateStudentQRData({
        matricule: user.matricule,
        name: user.name,
        semester: user.semester,
        academicYear: user.academicYear,
        department: user.department,
        level: user.level,
        courses: user.courses,
      })
    : "";

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your QR code</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ paddingTop: top }}>
      <View style={styles.container}>
        <View style={styles.qrCodeContainer}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.matricule}>{user.matricule}</Text>
          <Text style={styles.level}>{user.level}</Text>
          <Text style={styles.subtitle}>Scan my QR code</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={250}
              getRef={(ref) => (qrRef.current = ref)}
              backgroundColor="white"
              color="black"
              ecl="H"
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.light.primary }]}
          onPress={handleDownloadQR}
        >
          <Text style={styles.buttonText}>Download QR Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 15,
  },
  qrCodeContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 50,
    position: "relative",
  },
  avatarPlaceholder: {
    backgroundColor: Colors.light.surface,
    borderRadius: 45,
    height: 90,
    width: 90,
    position: "absolute",
    borderWidth: 3,
    borderColor: Colors.light.background,
    top: -45,
  },
  name: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: Colors.light.textInverted,
    marginTop: 15,
  },
  matricule: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.textInverted,
    marginTop: 5,
  },
  level: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textInverted,
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    color: Colors.light.textInverted,
    marginVertical: 15,
  },
  qrWrapper: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 15,
    height: 280,
    width: 280,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.light.textInverted,
    fontFamily: "Inter-Bold",
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    textAlign: "center",
    color: Colors.light.textSecondary,
  },
});
