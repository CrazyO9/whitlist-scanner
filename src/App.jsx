// whitelist-scanner/src/App.jsx
import "./App.css";

import { useWhitelist } from "./hooks/useWhitelist";
import { useScanHistory } from "./hooks/useScanHistory";
import { useScanner } from "./hooks/useScanner";

import ScanPanel from "./components/ScanPanel";
import HistoryPanel from "./components/HistoryPanel";
import WhitelistPanel from "./components/WhitelistPanel";

export default function App() {
  /** --------------------------------------
   * 1. 初始化 Hooks（資料邏輯）
   * -------------------------------------- */
  const whitelist = useWhitelist();
  const history = useScanHistory();

  // 掃描器：改查詢至 whitelist.find_by_code（entries 已自動轉換）
  const scanner = useScanner({
    findByCode: whitelist.find_by_code,
    onScanned: history.add_record,
  });

  /** --------------------------------------
   * 3. 主畫面 Layout
   * -------------------------------------- */
  return (
    <div className="app-layout">
      <div className="left-panel">
        {/* 主掃描畫面 */}
        <ScanPanel
          scanner={scanner}
          whitelistReady={whitelist.isWhitelistReady}
        />

        {/* 白名單面板 */}
        <WhitelistPanel
          whiteTable={whitelist.whiteTable}            // ✔ 改為 WhiteTable
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
          />
      </div>
    </div>
  );
}
