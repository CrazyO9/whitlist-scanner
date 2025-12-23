// whitelist-scanner\src\hooks\useExportAction.js
import { useCallback, useEffect, useState } from "react";

/**
 * 共用匯出流程 Hook（格式導向）
 *
 * @param {Object} params
 * @param {(format: string) => Promise<string>} params.exportFn
 *        實際執行匯出的 async function
 *        必須回傳「匯出檔案完整路徑」
 *
 * @param {number|string} params.resetKey
 *        當此值改變時，匯出狀態會自動 reset
 */
export function useExportAction({ exportFn, resetKey }) {
  const [status, setStatus] = useState("idle"); // idle | exporting
  const [lastExportPath, setLastExportPath] = useState(null);

  // ----------------------------
  // resetKey 改變 → reset 狀態
  // ----------------------------
  useEffect(() => {
    setStatus("idle");
    setLastExportPath(null);
  }, [resetKey]);

  // ----------------------------
  // 匯出行為（接收 format）
  // ----------------------------
  const handleExport = useCallback(
    async (format) => {
      if (status === "exporting") return;

      try {
        setStatus("exporting");

        const path = await exportFn(format); // ⭐ format 正式進來

        setLastExportPath(path ?? null);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setStatus("idle");
      }
    },
    [status, exportFn]
  );

  return {
    status,
    isExporting: status === "exporting",
    lastExportPath,   // ⭐ 給 menu 判斷「是否可開啟」
    handleExport,     // ⭐ 語意清楚
  };
}
