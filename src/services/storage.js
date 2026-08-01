import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getStoredJson(key, fallbackValue) {
  try {
    const rawValue = await AsyncStorage.getItem(key);

    if (!rawValue) {
      return fallbackValue;
    }

    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export async function setStoredJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }

  return true;
}

export async function removeStoredValue(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    return false;
  }

  return true;
}
