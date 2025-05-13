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
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CourseDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const { courses, loading } = useSelector((state: RootState) => state.courses);

  // Mock course data for testing
  const mockCourses = [
    {
      id: "CEF305",
      code: "CEF305",
      title: "Software Engineering",
      credits: 6,
      isRegistered: true,
      semester: "SEMESTER 1",
      lecturer: "Dr. Nkongho",
      department: "Software Engineering",
    },
    {
      id: "CEF307",
      code: "CEF307",
      title: "Mobile Development",
      credits: 4,
      isRegistered: false,
      semester: "SEMESTER 1",
      lecturer: "Dr. Akoung",
      department: "Software Engineering",
    },
  ];

  // Use mock data if courses is null/empty
  const safeCourses =
    Array.isArray(courses) && courses.length > 0 ? courses : mockCourses;
  const course = safeCourses.find((c) => c.id === id);

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

        <View style={styles.content}>
          <DetailItem label="Credits" value={`${course.credits} credits`} />
          <DetailItem label="Semester" value={course.semester} />
          <DetailItem label="Lecturer" value={course.lecturer} />
          <DetailItem label="Department" value={course.department} />
          <DetailItem
            label="Registration Status"
            value={course.isRegistered ? "Registered" : "Not Registered"}
            valueStyle={
              course.isRegistered
                ? styles.registeredText
                : styles.notRegisteredText
            }
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const DetailItem = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: any;
}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
  },
  courseCode: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#fff",
    marginBottom: 8,
  },
  courseTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#000",
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  registeredText: {
    color: Colors.light.primary,
  },
  notRegisteredText: {
    color: "#ff4444",
  },
});

export default CourseDetailsScreen;
