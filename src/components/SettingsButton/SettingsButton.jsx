// src/components/ScanSettings.jsx
import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { useCallback } from "react";
import { SettingRow } from "./SettingRow";
import { usePreferencesContext } from "../../context/PreferencesContext";

export default function SettingsButton() {
  const { preferences, setPreference } = usePreferencesContext();
  const { soundPassEnabled, soundFailEnabled, lightModeEnabled } = preferences;
  const openExportFolder = useCallback(async () => {
    const dir = await appDataDir();
    await invoke("reveal_in_folder",{
      path: `${dir}\\export`,
    });
  }, []);

  return (
    <div className="settings-root">
      <h2 className="settings-title">設定</h2>

      {/* 🔊 音效 */}
      <section className="settings-section">
        <h3 className="settings-section-title">音效</h3>

        <SettingRow
          label="通過音效"
          checked={soundPassEnabled}
          onToggle={() => setPreference("soundPassEnabled", !soundPassEnabled)}
        />

        <SettingRow
          label="不通過音效"
          checked={soundFailEnabled}
          onToggle={() => setPreference("soundFailEnabled", !soundFailEnabled)}
        />
      </section>

      {/* 🎨 外觀 */}
      <section className="settings-section">
        <h3 className="settings-section-title">外觀</h3>

        <SettingRow
          label="白天模式"
          checked={lightModeEnabled}
          onToggle={() => setPreference("lightModeEnabled", !lightModeEnabled)}
        />
      </section>

      {/* 📂 系統 */}
      <section className="settings-section">
        <h3 className="settings-section-title">系統</h3>

        <button className="settings-action-btn" onClick={openExportFolder}>
          開啟資料夾
        </button>
      </section>
    </div>
  );
}
