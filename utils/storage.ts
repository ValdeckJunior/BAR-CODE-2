import AsyncStorage from "@react-native-async-storage/async-storage";
import { PendingScan } from "@/types";

export const STORAGE_KEYS = {
  TOKEN: "@qr-campus/token",
  USER: "@qr-campus/user",
  COURSES: "@qr-campus/courses",
  PENDING_SCANS: "@qr-campus/pending-scans",
  LAST_SYNC: "@qr-campus/last-sync",
};

export const storage = {
  async saveData(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Storage save failed:", error);
      throw error;
    }
  },

  async getData(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Storage get failed:", error);
      throw error;
    }
  },

  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove failed:", error);
      throw error;
    }
  },

  async savePendingScan(scan: PendingScan): Promise<void> {
    try {
      const existingScans = await this.getPendingScans();
      const updatedScans = [...existingScans, scan];
      await this.saveData(STORAGE_KEYS.PENDING_SCANS, updatedScans);
    } catch (error) {
      console.error("Save pending scan failed:", error);
      throw error;
    }
  },

  async getPendingScans(): Promise<PendingScan[]> {
    try {
      const scans = await this.getData(STORAGE_KEYS.PENDING_SCANS);
      return Array.isArray(scans) ? scans : [];
    } catch (error) {
      console.error("Get pending scans failed:", error);
      return [];
    }
  },

  async clearPendingScans(): Promise<void> {
    try {
      await this.removeData(STORAGE_KEYS.PENDING_SCANS);
    } catch (error) {
      console.error("Clear pending scans failed:", error);
      throw error;
    }
  },

  async updateLastSync(): Promise<void> {
    try {
      await this.saveData(STORAGE_KEYS.LAST_SYNC, Date.now());
    } catch (error) {
      console.error("Update last sync failed:", error);
      throw error;
    }
  },

  async getLastSync(): Promise<number | null> {
    try {
      const timestamp = await this.getData(STORAGE_KEYS.LAST_SYNC);
      return typeof timestamp === "number" ? timestamp : null;
    } catch (error) {
      console.error("Get last sync failed:", error);
      return null;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Clear storage failed:", error);
      throw error;
    }
  },
};
