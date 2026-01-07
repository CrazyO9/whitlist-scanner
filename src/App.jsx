// whitelist-scanner/src/App.jsx
import "./App.css";
import { useState } from "react";
import { useWhitelist } from "./hooks/useWhitelist";
import { useScanHistory } from "./hooks/useScanHistory";
import { useScanner } from "./hooks/useScanner";

import ScanPanel from "./components/ScanPanel/ScanPanel";
import HistoryPanel from "./components/HistoryPanel";
import WhitelistPanel from "./components/WhitelistPanel";
import { usePreferencesContext } from "./context/PreferencesContext";
import SettingsButton from "./components/SettingsButton/SettingsButton";
import SettingsModal from "./components/SettingsButton/SettingsModal";

export default function App() {
  /** --------------------------------------
   * 1. 初始化 Hooks（資料邏輯）
   * -------------------------------------- */
  const whitelist = useWhitelist();
  const history = useScanHistory();
  const { preferences } = usePreferencesContext();
  const { lightModeEnabled } = preferences;
  const [showSettings, setShowSettings] = useState(false);

  // 掃描器：改查詢至 whitelist.find_by_code（entries 已自動轉換）
  const scanner = useScanner({
    findByCode: whitelist.find_by_code,
    onScanned: history.add_record,
  });

  /** --------------------------------------
   * 3. 主畫面 Layout
   * -------------------------------------- */
  return (
    <div
      className={`app-layout ${
        lightModeEnabled ? "theme-light" : "theme-dark"
      }`}
    >
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)}>
          <SettingsButton />
        </SettingsModal>
      )}
      <div className="left-panel">
        {/* 主掃描畫面 */}
        <ScanPanel
          scanner={scanner}
          whitelistReady={whitelist.isWhitelistReady}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* 白名單面板 */}
        <WhitelistPanel
          whiteTable={whitelist.whiteTable} // ✔ 改為 WhiteTable
          whitelistMessage={whitelist.whitelistMessage}
          handle_imported={whitelist.handle_imported}
          clearWhitelist={whitelist.clear_whitelist}
          close_whitelist_panel={whitelist.close_whitelist_panel}
        />
      </div>
      <div className="right-panel">
        {/* 歷史紀錄面板 */}
        <HistoryPanel
          history={history.history}
          onClear={history.clear_history}
          onRemoveOne={history.remove_record}
          historyVersion={history.historyVersion}
        />
      </div>
    </div>
  );
}
