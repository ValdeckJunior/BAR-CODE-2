import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  setSemesterFilter,
  setRegistrationStatusFilter,
  setSortBy,
  selectFilteredCourses,
} from "@/store/slices/courseSlice";
import { Course } from "@/types";

const ResultsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.courses.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const filters = useSelector((state: RootState) => state.courses.filters);
  const courses = useSelector(selectFilteredCourses) as Course[];

  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSemesterFilter = (
    semester: "SEMESTER 1" | "SEMESTER 2" | null
  ) => {
    dispatch(setSemesterFilter(semester));
  };

  const handleRegistrationFilter = (
    status: "all" | "registered" | "unregistered"
  ) => {
    dispatch(setRegistrationStatusFilter(status));
  };

  const handleSort = (sortBy: "code" | "title") => {
    dispatch(
      setSortBy({
        sortBy,
        sortOrder:
          filters.sortBy === sortBy && filters.sortOrder === "asc"
            ? "desc"
            : "asc",
      })
    );
  };

  const handleCoursePress = (courseId: string) => {
    router.push(`/(tabs)/results/${courseId}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="scanner.fill" size={48} color={Colors.light.primary} />
      <Text style={styles.emptyStateTitle}>No Courses Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery
          ? "Try adjusting your search"
          : "Scan a course QR code to add courses"}
      </Text>
    </View>
  );

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseCode}>{item.code}</Text>
      </View>
      <Text style={styles.courseTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filters</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Semester</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                !filters.semester && styles.filterOptionSelected,
              ]}
              onPress={() => handleSemesterFilter(null)}
            >
              <Text>All Semesters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.semester === "SEMESTER 1" &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => handleSemesterFilter("SEMESTER 1")}
            >
              <Text>Semester 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.semester === "SEMESTER 2" &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => handleSemesterFilter("SEMESTER 2")}
            >
              <Text>Semester 2</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Registration Status</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.registrationStatus === "all" &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => handleRegistrationFilter("all")}
            >
              <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.registrationStatus === "registered" &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => handleRegistrationFilter("registered")}
            >
              <Text>Registered</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filters.registrationStatus === "unregistered" &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => handleRegistrationFilter("unregistered")}
            >
              <Text>Not Registered</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSort("code")}
            >
              <Text>
                Course Code{" "}
                {filters.sortBy === "code" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSort("title")}
            >
              <Text>
                Course Title{" "}
                {filters.sortBy === "title" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your courses</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <IconSymbol
            name="line.3.horizontal.decrease"
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    flexDirection: "row",
    gap: Theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Colors.light.background,
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: Theme.spacing.lg,
    flexGrow: 1,
  },
  courseCard: {
    backgroundColor: Colors.light.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Theme.spacing.lg,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  courseCode: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    color: Colors.light.primary,
  },
  registeredBadge: {
    backgroundColor: Colors.light.primary + "20",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.sm,
  },
  registeredText: {
    color: Colors.light.primary,
    fontSize: Theme.fontSize.sm,
    fontFamily: Theme.fontFamily.bold,
  },
  courseTitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    marginBottom: Theme.spacing.sm,
    color: Colors.light.text,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseCredits: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  courseSemester: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Theme.spacing.xl,
  },
  emptyStateTitle: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
    color: Colors.light.text,
  },
  emptyStateSubtitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  message: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    maxHeight: "80%",
  },
  modalTitle: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    marginBottom: Theme.spacing.lg,
    textAlign: "center",
    color: Colors.light.primary,
  },
  filterSection: {
    marginBottom: Theme.spacing.lg,
  },
  filterSectionTitle: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    marginBottom: Theme.spacing.sm,
    color: Colors.light.text,
  },
  filterOption: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.md,
    backgroundColor: Colors.light.background,
    marginBottom: Theme.spacing.sm,
  },
  filterOptionSelected: {
    backgroundColor: Colors.light.primary + "20",
  },
  closeButton: {
    backgroundColor: Colors.light.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
    marginTop: Theme.spacing.md,
  },
  closeButtonText: {
    color: Colors.light.textInverted,
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
  },
});

export default ResultsScreen;
