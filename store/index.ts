import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types for QR code refs
        ignoredActions: ["auth/setUser"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
