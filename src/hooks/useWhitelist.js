// whitelist-scanner/src/hooks/useWhitelist.js
import { useCallback, useMemo, useState } from "react";
import { normalize_code } from "../utils/normalize";

export function useWhitelist() {
  // 後端 WhiteTable 原始資料
  const [whiteTable, setWhiteTable] = useState(null);

  // 前端 entries（陣列格式）
  const [whitelistEntries, setWhitelistEntries] = useState([]);

  // 查詢用 Map
  const [whitelistMap, setWhitelistMap] = useState(() => new Map());

  // UI states
  const [importedFileName, setImportedFileName] = useState("");
  const [whitelistMessage, setWhitelistMessage] = useState("");
  const [showWhitelistPanel, setShowWhitelistPanel] = useState(false);
  const [isWhitelistReady, setIsWhitelistReady] = useState(false);

  // 映射
  // 
  const FIELD_ALIASES = {
    code: ["code", "條碼", "商品條碼", "Barcode", "bar_code", "貨號"],
    name: ["name", "商品名稱", "品名"],
  };

  const normalize_entry = (raw) => {
    const entry = {};

    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      for (const key of aliases) {
        if (raw[key] != null && raw[key] !== "") {
          entry[field] = raw[key];
          break;
        }
      }
    }

    // 保留原始欄位（給 UI 用）
    return { ...raw, ...entry };
  };

  // --------------------------------------------
  // 將 WhiteTable.columns 轉陣列 entries
  // --------------------------------------------
  const convert_whiteTable_to_entries = useCallback((whiteTable) => {
    const columns = whiteTable.columns ?? {};
    const headers = whiteTable.header_order ?? Object.keys(columns);
    // console.log("WhiteTable from backend:", whiteTableData);

    if (headers.length === 0) return [];

    const numRows = Math.min(...headers.map((h) => columns[h].length));

    const entries = [];
    for (let i = 0; i < numRows; i++) {
      const entry = {};
      for (const h of headers) {
        entry[h] = columns[h][i];
      }
      entries.push(entry);
    }
    return entries;
  }, []);

  // --------------------------------------------
  // 由 entries 重建 map
  // --------------------------------------------
  const rebuild_map = useCallback((entries) => {
    const map = new Map();
    for (const item of entries) {
      const key = normalize_code(item.code);
      if (!key) continue;
      map.set(key, item);
    }
    return map;
  }, []);

  // --------------------------------------------
  // 處理匯入資料（WhiteTable）
  // --------------------------------------------
  const handle_imported = useCallback(
    (whiteTableData, pathName = "") => {
      if (!whiteTableData || !whiteTableData.columns) {
        setWhitelistMessage("匯入資料格式錯誤（缺少 columns）");
        return;
      }

      // 1. 設定 WhiteTable
      setWhiteTable(whiteTableData);

      // 2. columns → entries 陣列
      const entries = convert_whiteTable_to_entries(whiteTableData);

      // 3. normalize（把中文欄位對映成 code / name）
      const normalizedEntries = entries.map(normalize_entry);

      // 4. clean by code（只留下有 code 的列）
      const cleanEntries = normalizedEntries.filter((e) => e.code);

      // 5. 建 Map
      const map = rebuild_map(cleanEntries);

      // 6. 更新狀態
      setWhitelistEntries(cleanEntries);
      setWhitelistMap(map);

      setImportedFileName(pathName || whiteTableData.file_name || "");
      setWhitelistMessage(`(${cleanEntries.length}筆)`);
      setIsWhitelistReady(map.size > 0);

    },
    [convert_whiteTable_to_entries, rebuild_map]
  );

  // --------------------------------------------
  // 清空白名單
  // --------------------------------------------
  const clear_whitelist = useCallback(() => {
    setWhiteTable(null);
    setWhitelistEntries([]);
    setWhitelistMap(new Map());

    setImportedFileName("");
    setWhitelistMessage("已清空白名單");
    setIsWhitelistReady(false);

    window.localStorage.removeItem("whitelist_entries");
  }, []);

  // --------------------------------------------
  // 查詢用函式
  // --------------------------------------------
  const find_by_code = useCallback(
    (code) => {
      const key = normalize_code(code);
      return whitelistMap.get(key) || null;
    },
    [whitelistMap]
  );

  // --------------------------------------------
  // whitelist_table（給 UI 表格用）
  // --------------------------------------------
  const whitelist_table = useMemo(
    () =>
      whitelistEntries.map((entry, index) => ({
        id: index,
        ...entry,
      })),
    [whitelistEntries]
  );

  // --------------------------------------------
  // Panel 控制
  // --------------------------------------------
  const toggle_whitelist_panel = useCallback(
    () => setShowWhitelistPanel((v) => !v),
    []
  );

  const close_whitelist_panel = useCallback(
    () => setShowWhitelistPanel(false),
    []
  );

  return {
    // 原始 / 衍生資料
    whiteTable,          // WhiteTable from backend
    whitelist_table,     // array for table render
    whitelistEntries,    // entries array
    whitelistMap,        // Map for fast lookup

    // UI 狀態
    importedFileName,
    whitelistMessage,
    showWhitelistPanel,
    isWhitelistReady,

    // 操作函式
    handle_imported,
    clear_whitelist,
    toggle_whitelist_panel,
    close_whitelist_panel,

    // 查詢
    find_by_code,
  };
}
