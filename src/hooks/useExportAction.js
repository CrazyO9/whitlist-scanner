import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

/**
 * 共用匯出流程 Hook
 *
 * @param {Object} params
 * @param {() => Promise<string>} params.exportFn
 *        實際執行匯出的 async function
 *        必須回傳「匯出檔案完整路徑」
 *
 * @param {number|string} params.resetKey
 *        當此值改變時，匯出狀態會自動 reset
 */
export function useExportAction({ exportFn, resetKey }) {
  const [status, setStatus] = useState("idle"); // idle | exporting | done
  const [exportPath, setExportPath] = useState("");

  // ----------------------------
  // 資料變動 → 重置狀態
  // ----------------------------
  useEffect(() => {
    setStatus("idle");
    setExportPath("");
  }, [resetKey]);

  // ----------------------------
  // 點擊行為分派
  // ----------------------------
  const handleClick = useCallback(async () => {
    if (status === "idle") {
      try {
        setStatus("exporting");

        const path = await exportFn();

        setExportPath(path);
        setStatus("done");
      } catch (err) {
        console.error(err);
        setStatus("idle");
      }
    }

    if (status === "done" && exportPath) {
      await invoke("reveal_in_folder", { path: exportPath });
    }
  }, [status, exportFn, exportPath]);

  return {
    status,
    exportPath,
    isExporting: status === "exporting",
    isDone: status === "done",
    handleClick,
  };
}
