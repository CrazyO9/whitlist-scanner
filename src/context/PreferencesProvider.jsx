import { PreferencesContext } from "./PreferencesContext";
import { usePreferences } from "../hooks/usePreferences";

export default function PreferencesProvider({ children }) {
  const preferencesState = usePreferences();
  return (
    <PreferencesContext.Provider value={preferencesState}>
      {children}
    </PreferencesContext.Provider>
  );
}
