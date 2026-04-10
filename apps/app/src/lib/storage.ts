import { Platform } from "react-native";

const memoryStorage = new Map<string, string>();

export async function getStoredItem(key: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return memoryStorage.get(key) ?? null;
}

export async function setStoredItem(key: string, value: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
    return;
  }
  memoryStorage.set(key, value);
}

export async function removeStoredItem(key: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.removeItem(key);
    return;
  }
  memoryStorage.delete(key);
}
