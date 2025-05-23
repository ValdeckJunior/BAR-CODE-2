import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { router } from "expo-router";
import { useEffect } from "react";
import { User } from "@/types";
import { logoutUser } from "@/store/slices/authSlice";

const Profile = () => {
  const { top } = useSafeAreaInsets();
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      Alert.alert(
        "Logout Error",
        "Failed to logout properly. You may need to log in again."
      );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }
  if (!user) return null;

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingTop: top,
      }}
    >
      <View style={styles.outerContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarCard}>
            <View style={styles.avatarShadow}>
              <View style={styles.avatarCardCircle}>
                <Text style={styles.avatarCardText}>
                  {user.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0]?.toUpperCase())
                    .join("")}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.profileTitle}>Profile</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Matricule</Text>
              <Text style={styles.value}>{user.matricule}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Level</Text>
              <Text style={styles.value}>{user.level}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Faculty</Text>
              <Text style={styles.value}>{user.faculty}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Department</Text>
              <Text style={styles.value}>{user.department || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>
                {user.role === "ADMIN" ? "Invigilator" : "Student"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutCardButton}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={Colors.light.textInverted}
                size="small"
              />
            ) : (
              <Text style={styles.logoutCardButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.logoutCardButton}
            onPress={() => router.push("/(tabs)/logs")}
          >
            <Text style={styles.logoutCardButtonText}>Go to logs</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 0,
  },
  profileCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.xl,
    width: "92%",
    maxWidth: 420,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 12,
  },
  avatarCard: {
    marginBottom: Theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarShadow: {
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 16,
    borderRadius: 60,
  },
  avatarCardCircle: {
    backgroundColor: Colors.light.primary,
    borderRadius: 60,
    height: 120,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: Colors.light.surface,
  },
  avatarCardText: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: 48,
    color: Colors.light.textInverted,
    letterSpacing: 2,
  },
  profileTitle: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg + 8,
    color: Colors.light.primary,
    marginBottom: Theme.spacing.lg,
    marginTop: -Theme.spacing.sm,
    letterSpacing: 2,
    textShadowColor: Colors.light.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  infoCard: {
    width: "100%",
    backgroundColor: Colors.light.primaryLight,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.accent,
    letterSpacing: 0.5,
  },
  value: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.text,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: 10,
  },
  logoutCardButton: {
    marginTop: Theme.spacing.md,
    backgroundColor: Colors.light.error,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    width: "100%",
  },
  logoutCardButtonText: {
    color: Colors.light.textInverted,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default Profile;
