import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import { User, AuthState } from "@/types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
};

// Mock authentication service - replace with actual API calls
const mockAuth = {
  login: async (matricule: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (matricule === "FE20A001" && password === "password123") {
      return {
        token: "mock_jwt_token",
        user: {
          matricule: "FE20A001",
          name: "John Nde",
          department: "Software Engineering",
          semester: "SEMESTER 1",
          level: "LEVEL 300",
          academicYear: "2024-2025",
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
          ],
        },
      };
    }
    throw new Error("Invalid credentials");
  },
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ matricule, password }: { matricule: string; password: string }) => {
    try {
      const response = await mockAuth.login(matricule, password);
      await storage.saveData(STORAGE_KEYS.TOKEN, response.token);
      await storage.saveData(STORAGE_KEYS.USER, response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const restoreAuthState = createAsyncThunk("auth/restore", async () => {
  const [token, user] = await Promise.all([
    storage.getData(STORAGE_KEYS.TOKEN),
    storage.getData(STORAGE_KEYS.USER),
  ]);

  if (token && user) {
    return { token, user };
  }
  throw new Error("No auth state to restore");
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await storage.clearAllData();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(restoreAuthState.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setUser, setError } = authSlice.actions;
export default authSlice.reducer;
