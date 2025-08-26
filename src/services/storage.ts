import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

// Check if SecureStore is available (not available on web)
const isSecureStoreAvailable = Platform.OS !== "web" && SecureStore.isAvailableAsync;

// Token storage using Expo SecureStore for sensitive data (fallback to AsyncStorage on web)
export const setToken = async (token: string): Promise<void> => {
  try {
    if (!token) {
      console.error("Cannot store undefined or null token");
      return;
    }
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Error storing token:", error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (isSecureStoreAvailable) {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } else {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const setRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    if (!refreshToken) {
      console.error("Cannot store undefined or null refresh token");
      return;
    }
    if (isSecureStoreAvailable) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    if (isSecureStoreAvailable) {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } else {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
};

export const removeRefreshToken = async (): Promise<void> => {
  try {
    if (isSecureStoreAvailable) {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } else {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error removing refresh token:", error);
  }
};

// Regular storage for non-sensitive data
export const setUserData = async (userData: unknown): Promise<void> => {
  try {
    if (userData === undefined || userData === null) {
      console.error("Cannot store undefined or null user data");
      return;
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<unknown | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

// Clear all stored data
export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([removeToken(), removeRefreshToken(), removeUserData()]);
  } catch (error) {
    console.error("Error clearing all data:", error);
  }
};

// Generic storage functions
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

export const setObject = async (key: string, value: unknown): Promise<void> => {
  try {
    if (value === undefined || value === null) {
      console.error(`Cannot store undefined or null value for key ${key}`);
      return;
    }
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing object ${key}:`, error);
    throw error;
  }
};

export const getObject = async (key: string): Promise<unknown | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error retrieving object ${key}:`, error);
    return null;
  }
};
