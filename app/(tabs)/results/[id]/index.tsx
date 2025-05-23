import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Course } from "@/types";

const CourseDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const course = Array.isArray(courses)
    ? courses.find((c: Course) => c.id == id)
    : null;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!course) {
    setTimeout(() => router.replace("/(tabs)/results"), 100);
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>Course not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ paddingTop: top }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: Theme.radius.lg,
    borderBottomRightRadius: Theme.radius.lg,
    marginBottom: Theme.spacing.lg,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  courseCode: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    color: Colors.light.textInverted,
    marginBottom: Theme.spacing.xs,
    letterSpacing: 1,
  },
  courseTitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.textInverted,
    marginBottom: Theme.spacing.sm,
    textAlign: "center",
  },
  message: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.lg,
  },
});

export default CourseDetailsScreen;
