import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import { User, AuthState } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  qrCodeImage: null, // Add this to store the QR code image (base64 or blob url)
  verificationResult: null,
  verificationLoading: false,
  verificationError: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { matricule, password }: { matricule: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricule, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      const data = await res.json();
      await storage.saveData(STORAGE_KEYS.TOKEN, data.token);
      await storage.saveData(STORAGE_KEYS.USER, data.user);
      return { token: data.token, user: data.user };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
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

export const fetchStudentQRCode = createAsyncThunk(
  "auth/fetchStudentQRCode",
  async (
    { matricule, token }: { matricule: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/students/${matricule}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch QR code");
      const blob = await res.blob();
      // Convert blob to base64 for React Native Image
      const reader = new FileReader();
      return await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch QR code");
    }
  }
);

// Async thunk for verifying QR code (lecturer flow)
export const verifyQRCode = createAsyncThunk(
  "auth/verifyQRCode",
  async (
    {
      qrcode,
      courseCode,
      token,
    }: { qrcode: string; courseCode: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/verify-qrcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrcode, courseCode }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Verification failed");
      }
      return await res.json();
    } catch (error: any) {
      return rejectWithValue(error.message || "Verification failed");
    }
  }
);

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
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.qrCodeImage = null;
      storage.removeData(STORAGE_KEYS.TOKEN);
      storage.removeData(STORAGE_KEYS.USER);
    },
    clearVerificationResult(state) {
      state.verificationResult = null;
      state.verificationError = null;
      state.verificationLoading = false;
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
        state.error = action.payload as string;
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
      .addCase(fetchStudentQRCode.fulfilled, (state, action) => {
        state.qrCodeImage = action.payload;
      })
      .addCase(fetchStudentQRCode.rejected, (state, action) => {
        state.qrCodeImage = null;
        state.error = action.payload as string;
      })
      .addCase(verifyQRCode.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
        state.verificationResult = null;
      })
      .addCase(verifyQRCode.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationResult = action.payload;
      })
      .addCase(verifyQRCode.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload as string;
        state.verificationResult = null;
      });
  },
});

export const { setUser, setError, logoutUser, clearVerificationResult } =
  authSlice.actions;
export default authSlice.reducer;
