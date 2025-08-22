import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// Functional storage utilities
export const getItem = <T>(key: string): T | null => {
  try {
    const item = storage.getString(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const removeItem = (key: string): void => {
  storage.delete(key);
};

export const clearStorage = (): void => {
  storage.clearAll();
};

// Specific storage functions
export const getUserFromStorage = () => getItem<any>('user');
export const setUserToStorage = (user: any) => setItem('user', user);
export const removeUserFromStorage = () => removeItem('user');

export const getTokenFromStorage = () => getItem<string>('auth_token');
export const setTokenToStorage = (token: string) => setItem('auth_token', token);
export const removeTokenFromStorage = () => removeItem('auth_token');