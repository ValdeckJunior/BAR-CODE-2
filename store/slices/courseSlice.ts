import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import { Course, CourseState } from "@/types";

const initialState: CourseState = {
  courses: [
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
      isRegistered: true,
      semester: "SEMESTER 1",
      lecturer: "Dr. Akoung",
      department: "Software Engineering",
    },
    {
      id: "CEF303",
      code: "CEF303",
      title: "Database Systems",
      credits: 5,
      isRegistered: false,
      semester: "SEMESTER 1",
      lecturer: "Dr. Neba",
      department: "Software Engineering",
    },
    {
      id: "CEF302",
      code: "CEF302",
      title: "Operating Systems",
      credits: 5,
      isRegistered: false,
      semester: "SEMESTER 2",
      lecturer: "Dr. Taka",
      department: "Software Engineering",
    },
  ],
  loading: false,
  error: null,
  filters: {
    semester: null,
    registrationStatus: "all",
    sortBy: "code",
    sortOrder: "asc",
  },
};

export const restoreCourses = createAsyncThunk("courses/restore", async () => {
  const courses = await storage.getData(STORAGE_KEYS.COURSES);
  return courses;
});

export const persistCourses = createAsyncThunk(
  "courses/persist",
  async (courses: Course[]) => {
    await storage.saveData(STORAGE_KEYS.COURSES, courses);
    return courses;
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      const existingCourse = state.courses.find(
        (course) => course.id === action.payload.id
      );
      if (!existingCourse) {
        state.courses.push(action.payload);
        persistCourses(state.courses);
      }
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course.id !== action.payload
      );
      persistCourses(state.courses);
    },
    updateCourse: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Course> }>
    ) => {
      const index = state.courses.findIndex(
        (course) => course.id === action.payload.id
      );
      if (index !== -1) {
        state.courses[index] = {
          ...state.courses[index],
          ...action.payload.updates,
        };
        persistCourses(state.courses);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSemesterFilter: (
      state,
      action: PayloadAction<"SEMESTER 1" | "SEMESTER 2" | null>
    ) => {
      state.filters.semester = action.payload;
    },
    setRegistrationStatusFilter: (
      state,
      action: PayloadAction<"all" | "registered" | "unregistered">
    ) => {
      state.filters.registrationStatus = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: "code" | "title" | "credits";
        sortOrder: "asc" | "desc";
      }>
    ) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(restoreCourses.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to restore courses";
      })
      .addCase(persistCourses.rejected, (state) => {
        state.error = "Failed to save courses";
      });
  },
});

export const {
  addCourse,
  removeCourse,
  updateCourse,
  setLoading,
  setError,
  setSemesterFilter,
  setRegistrationStatusFilter,
  setSortBy,
} = courseSlice.actions;

export const selectFilteredCourses = (state: { courses: CourseState }) => {
  let filteredCourses = state.courses.courses || [];

  if (state.courses.filters.semester) {
    filteredCourses = filteredCourses.filter(
      (course) => course.semester === state.courses.filters.semester
    );
  }

  if (state.courses.filters.registrationStatus !== "all") {
    const isRegistered =
      state.courses.filters.registrationStatus === "registered";
    filteredCourses = filteredCourses.filter(
      (course) => course.isRegistered === isRegistered
    );
  }

  filteredCourses.sort((a, b) => {
    const sortBy = state.courses.filters.sortBy;
    const sortOrder = state.courses.filters.sortOrder === "asc" ? 1 : -1;

    if (sortBy === "credits") {
      return (a.credits - b.credits) * sortOrder;
    }

    return a[sortBy].localeCompare(b[sortBy]) * sortOrder;
  });

  return filteredCourses;
};

export default courseSlice.reducer;
