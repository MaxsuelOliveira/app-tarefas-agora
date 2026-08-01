import { useEffect, useState } from "react";
import {
  getStoredJson,
  removeStoredValue,
  setStoredJson,
} from "../services/storage";

const PROFILE_STORAGE_KEY = "tarefas-agora:profile";

const defaultProfile = {
  name: "",
  email: "",
  role: "",
  focus: "",
  dailyGoal: "",
};

export function useProfile() {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    async function hydrateProfile() {
      const storedProfile = await getStoredJson(
        PROFILE_STORAGE_KEY,
        defaultProfile,
      );

      if (storedProfile) {
        setProfile(storedProfile);
      }
    }

    hydrateProfile();
  }, []);

  function updateProfileField(field, value) {
    const normalizedValue =
      field === "dailyGoal" ? value.replace(/[^0-9]/g, "") : value;

    setProfile((current) => ({
      ...current,
      [field]: normalizedValue,
    }));
  }

  async function saveProfile() {
    await setStoredJson(PROFILE_STORAGE_KEY, profile);
  }

  async function clearProfile() {
    setProfile(defaultProfile);
    await removeStoredValue(PROFILE_STORAGE_KEY);
  }

  return {
    profile,
    hasAccount: Boolean(profile.name.trim()),
    updateProfileField,
    saveProfile,
    clearProfile,
  };
}
