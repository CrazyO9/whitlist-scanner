import { createContext, useContext } from "react";

export const PreferencesContext = createContext(null);

export function usePreferencesContext() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferencesContext must be used within PreferencesProvider");
  }
  return ctx;
}
