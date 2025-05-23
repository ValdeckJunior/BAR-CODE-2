import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import { Course, CourseState } from "@/types";

const initialState: CourseState = {
  courses: [],
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

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchStudentCourses = createAsyncThunk(
  "courses/fetchStudentCourses",
  async (
    { matricule, token }: { matricule: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/students/${matricule}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch courses");
      }
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch courses");
    }
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
    clearCourses: (state) => {
      state.courses = [];
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
      })
      .addCase(fetchStudentCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
  clearCourses,
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
