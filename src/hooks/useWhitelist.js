// whitelist-scanner/src/hooks/useWhitelist.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { normalize_code } from "../utils/normalize";

export function useWhitelist() {
  /* ----------------------------------
   * 原始資料（唯一來源）
   * ---------------------------------- */
  const [whiteTable, setWhiteTable] = useState(null);

  /* ----------------------------------
   * UI 狀態
   * ---------------------------------- */
  const [importedFileName, setImportedFileName] = useState("");
  const [whitelistMessage, setWhitelistMessage] = useState("");
  const [showWhitelistPanel, setShowWhitelistPanel] = useState(false);

  /* ----------------------------------
   * 欄位別名（資料正規化）
   * ---------------------------------- */
  const FIELD_ALIASES = {
    code: ["code", "條碼", "商品條碼", "Barcode", "bar_code", "貨號"],
    name: ["name", "商品名稱", "品名"],
  };

  const normalize_entry = useCallback((raw) => {
    const entry = {};

    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      for (const key of aliases) {
        if (raw[key] != null && raw[key] !== "") {
          entry[field] = raw[key];
          break;
        }
      }
    }

    return { ...raw, ...entry };
  }, []);

  /* ----------------------------------
   * WhiteTable → entries（列）
   * ---------------------------------- */
  const whitelistEntries = useMemo(() => {
    if (!whiteTable?.columns) return [];

    const columns = whiteTable.columns;
    const headers =
      whiteTable.header_order && whiteTable.header_order.length > 0
        ? whiteTable.header_order
        : Object.keys(columns);

    if (headers.length === 0) return [];

    const numRows = Math.min(
      ...headers.map((h) => columns[h]?.length ?? 0)
    );

    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = {};
      for (const h of headers) {
        row[h] = columns[h][i];
      }
      rows.push(normalize_entry(row));
    }

    return rows.filter((e) => e.code);
  }, [whiteTable, normalize_entry]);

  /* ----------------------------------
   * entries → Map（查詢）
   * ---------------------------------- */
  const whitelistMap = useMemo(() => {
    const map = new Map();
    for (const item of whitelistEntries) {
      const key = normalize_code(item.code);
      if (key) map.set(key, item);
    }
    return map;
  }, [whitelistEntries]);

  const isWhitelistReady = whitelistMap.size > 0;

  /* ----------------------------------
   * 核心管線：白名單進入系統的唯一入口
   * ---------------------------------- */
  const apply_whitelist = useCallback((table, message = "") => {
    setWhiteTable(table);
    setImportedFileName(table?.file_name ?? "");
    setWhitelistMessage(message);
  }, []);

  /* ----------------------------------
   * 匯入成功（前端呼叫）
   * ---------------------------------- */
  const handle_imported = useCallback(
    async (table) => {
      if (!table?.columns) {
        setWhitelistMessage("匯入資料格式錯誤");
        return;
      }

      apply_whitelist(table, `(${Object.values(table.columns)[0]?.length ?? 0}筆)`);

      // ⭐ 同步寫入後端快取
      await invoke("save_whitelist", { table });
    },
    [apply_whitelist]
  );

  /* ----------------------------------
   * 清空白名單
   * ---------------------------------- */
  const clear_whitelist = useCallback(async () => {
    setWhiteTable(null);
    setImportedFileName("");
    setWhitelistMessage("已清空白名單");

    await invoke("clear_last_whitelist");
  }, []);

  /* ----------------------------------
   * 查詢
   * ---------------------------------- */
  const find_by_code = useCallback(
    (code) => {
      const key = normalize_code(code);
      return whitelistMap.get(key) ?? null;
    },
    [whitelistMap]
  );

  /* ----------------------------------
   * App 啟動：自動載入上次白名單
   * ---------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const load_last = async () => {
      try {
        const table = await invoke("load_last_whitelist");
        if (cancelled) return;

        apply_whitelist(table, `(${Object.values(table.columns)[0]?.length ?? 0}筆)`);
      } catch {
        // 沒有上次白名單是正常狀態
      }
    };

    load_last();
    return () => {
      cancelled = true;
    };
  }, [apply_whitelist]);

  /* ----------------------------------
   * Panel 控制
   * ---------------------------------- */
  const toggle_whitelist_panel = useCallback(
    () => setShowWhitelistPanel((v) => !v),
    []
  );

  const close_whitelist_panel = useCallback(
    () => setShowWhitelistPanel(false),
    []
  );

  /* ----------------------------------
   * 對外 API
   * ---------------------------------- */
  return {
    // 資料
    whiteTable,
    whitelistEntries,
    whitelistMap,
    isWhitelistReady,

    // UI
    importedFileName,
    whitelistMessage,
    showWhitelistPanel,

    // 行為
    handle_imported,
    clear_whitelist,
    toggle_whitelist_panel,
    close_whitelist_panel,

    // 查詢
    find_by_code,
  };
}
