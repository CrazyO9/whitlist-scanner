// whitelist-scanner/src/hooks/useWhitelist.js
import { useCallback, useMemo, useState } from "react";
import { normalize_code } from "../utils/normalize";

export function useWhitelist() {
  // 原始清單（陣列）
  const [whitelistEntries, setWhitelistEntries] = useState([]);
  // 查詢用 Map：key = normalized_code, value = entry
  const [whitelistMap, setWhitelistMap] = useState(() => new Map());

  // UI 狀態
  const [importedFileName, setImportedFileName] = useState("");
  const [whitelistMessage, setWhitelistMessage] = useState("");
  const [showWhitelistPanel, setShowWhitelistPanel] = useState(false);
  const [isWhitelistReady, setIsWhitelistReady] = useState(false);

  /**
   * 將原始陣列轉成 Map
   */
  const rebuild_map_from_entries = useCallback((entries) => {
    const map = new Map();
    for (const item of entries) {
      if (!item) continue;
      const key = normalize_code(item.code);
      if (!key) continue;
      map.set(key, item);
    }
    return map;
  }, []);

  /**
   * 匯入白名單資料（由 WhitelistImport 呼叫）
   * importedData: array of entries
   * fileName: string
   */
  const handle_imported = useCallback((importedData, fileName = "") => {
    if (!Array.isArray(importedData)) {
      setWhitelistMessage("匯入資料格式錯誤（不是陣列）");
      setIsWhitelistReady(false);
      return;
    }

    const cleanEntries = importedData.filter((item) => item && item.code);
    const map = rebuild_map_from_entries(cleanEntries);

    setWhitelistEntries(cleanEntries);
    setWhitelistMap(map);
    setImportedFileName(fileName);
    setWhitelistMessage(`已匯入 ${cleanEntries.length} 筆白名單資料`);
    setIsWhitelistReady(map.size > 0);
  }, [rebuild_map_from_entries]);

  /**
   * 從本地儲存讀取（如果你有用 localStorage）
   */
  const load_from_disk = useCallback(() => {
    try {
      const raw = window.localStorage.getItem("whitelist_entries");
      if (!raw) return;

      const entries = JSON.parse(raw);
      const map = rebuild_map_from_entries(entries);

      setWhitelistEntries(entries);
      setWhitelistMap(map);
      setImportedFileName("(本機儲存)");
      setWhitelistMessage(`已從本機載入 ${entries.length} 筆白名單資料`);
      setIsWhitelistReady(map.size > 0);
    } catch (err) {
      console.error(err);
      setWhitelistMessage("讀取本機白名單失敗");
      setIsWhitelistReady(false);
    }
  }, [rebuild_map_from_entries]);

  /**
   * 寫回 localStorage
   */
  const save_to_disk = useCallback(() => {
    try {
      window.localStorage.setItem("whitelist_entries", JSON.stringify(whitelistEntries));
      setWhitelistMessage("已將白名單儲存到本機");
    } catch (err) {
      console.error(err);
      setWhitelistMessage("儲存白名單到本機失敗");
    }
  }, [whitelistEntries]);

  const clear_whitelist = useCallback(() => {
    setWhitelistEntries([]);
    setWhitelistMap(new Map());
    setImportedFileName("");
    setWhitelistMessage("已清空白名單");
    setIsWhitelistReady(false);
    window.localStorage.removeItem("whitelist_entries");
  }, []);

  const toggle_whitelist_panel = useCallback(() => {
    setShowWhitelistPanel((prev) => !prev);
  }, []);

  const close_whitelist_panel = useCallback(() => {
    setShowWhitelistPanel(false);
  }, []);

  /**
   * 給掃描器用的查詢函式
   */
  const find_by_code = useCallback(
    (code) => {
      const key = normalize_code(code);
      if (!key) return null;
      return whitelistMap.get(key) || null;
    },
    [whitelistMap]
  );

  const whitelist_table = useMemo(
    () =>
      whitelistEntries.map((entry, index) => ({
        id: index,
        ...entry,
      })),
    [whitelistEntries]
  );

  return {
    // 原始 / 衍生資料
    whitelist_table,
    whitelistEntries,
    whitelistMap,

    // UI 狀態
    importedFileName,
    whitelistMessage,
    showWhitelistPanel,
    isWhitelistReady,

    // 操作函數
    handle_imported,
    load_from_disk,
    save_to_disk,
    clear_whitelist,
    toggle_whitelist_panel,
    close_whitelist_panel,

    // 查詢
    find_by_code,
  };
}
