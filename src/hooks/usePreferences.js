// whitelist-scanner\src\hooks\usePreferences.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "whitelist-scanner:preferences";

const DEFAULT_PREFERENCES = {
  soundPassEnabled: true,
  soundFailEnabled: true,
  lightModeEnabled: false,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PREFERENCES;

      return {
        ...DEFAULT_PREFERENCES,
        ...JSON.parse(raw),
      };
    } catch (err) {
      console.error("[usePreferences] load failed", err);
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }, [preferences]);

  const setPreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    preferences,
    setPreference,
  };
}
