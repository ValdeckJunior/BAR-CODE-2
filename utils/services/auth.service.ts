import { storage } from "../storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface LoginCredentials {
  matricule: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const logout = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    // Clear local storage
    await storage.removeData(STORAGE_KEYS.TOKEN);
    await storage.removeData(STORAGE_KEYS.USER);
  } catch (error) {
    // Even if the server request fails, we should still clear local storage
    await storage.removeData(STORAGE_KEYS.TOKEN);
    await storage.removeData(STORAGE_KEYS.USER);
    throw error;
  }
};

export const getCurrentUser = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get current user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
