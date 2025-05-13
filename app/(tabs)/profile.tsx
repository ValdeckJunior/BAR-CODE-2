import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";
import { router } from "expo-router";

const Profile = () => {
  const { top } = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) {
    router.replace("/");
    return null;
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logoutUser()).unwrap();
            router.replace("/");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleViewCourses = () => {
    router.push("/(tabs)/results");
  };

  return (
    <SafeAreaProvider style={{ paddingTop: top, paddingHorizontal: 20 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.matricule}>{user.matricule}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsContent}>
            <DetailItem label="Department" value={user.department} />
            <DetailItem label="Level" value={user.level} />
            <DetailItem label="Semester" value={user.semester} />
            <DetailItem label="Academic Year" value={user.academicYear} />
            <DetailItem
              label="Registered Courses"
              value={`${
                user.courses.filter((c) => c.isRegistered).length
              } courses`}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.light.primary }]}
            onPress={handleViewCourses}
          >
            <Text style={styles.buttonText}>View My Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.light.error }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginTop: 80,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 35,
    paddingTop: 60,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  avatarPlaceholder: {
    backgroundColor: Colors.light.surface,
    borderRadius: 45,
    height: 90,
    width: 90,
    position: "absolute",
    top: -45,
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  name: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: Colors.light.textInverted,
    textAlign: "center",
  },
  matricule: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.textInverted,
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    marginBottom: 15,
  },
  detailsContent: {
    gap: 15,
    marginBottom: 20,
  },
  detailItem: {
    borderBottomColor: Colors.light.borderLight,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  detailLabel: {
    fontFamily: "Inter-Regular",
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    marginTop: 5,
    color: Colors.light.text,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.light.textInverted,
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
});

export default Profile;
