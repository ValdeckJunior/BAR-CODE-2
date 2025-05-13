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
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  setSemesterFilter,
  setRegistrationStatusFilter,
  setSortBy,
  selectFilteredCourses,
} from "@/store/slices/courseSlice";

const ResultsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.courses.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const filters = useSelector((state: RootState) => state.courses.filters);
  const courses = useSelector(selectFilteredCourses);

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

  const handleSort = (sortBy: "code" | "title" | "credits") => {
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

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseCode}>{item.code}</Text>
        {item.isRegistered && (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <View style={styles.courseFooter}>
        <Text style={styles.courseCredits}>{item.credits} credits</Text>
        <Text style={styles.courseSemester}>{item.semester}</Text>
      </View>
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
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSort("credits")}
            >
              <Text>
                Credits{" "}
                {filters.sortBy === "credits" &&
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
        keyExtractor={(item) => item.id}
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
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontFamily: "Inter-Regular",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  courseCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseCode: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: Colors.light.primary,
  },
  registeredBadge: {
    backgroundColor: Colors.light.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  registeredText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  courseTitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseCredits: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
  },
  courseSemester: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    marginBottom: 10,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: Colors.light.primary + "20",
  },
  closeButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
  },
});

export default ResultsScreen;
