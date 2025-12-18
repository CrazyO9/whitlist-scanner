// whitelist-scanner/src/components/ExportHistory.jsx
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import ExportActionButton from "./ExportActionButton";
import { useExportAction } from "../hooks/useExportAction";

export default function ExportHistory({ history, resetKey }) {
  const exportFn = useCallback(async () => {
    if (!history || history.length === 0) return;

    // 將前端紀錄轉成後端需要的結構
    const payload = history.map((item) => ({
      timestamp: item.timestamp,
      code: item.code,
      is_whitelisted: item.isWhitelisted,
      name: item.entry?.name ?? null,
    }));

    try {

      const exportPath = await invoke("export_scan_history", {
        history: payload,
      });

      await invoke("reveal_in_folder", {
        path: exportPath,
      });

    } catch (err) {
      console.error(err);
      alert("匯出掃描紀錄失敗");
    }
  }, [history]);
  
  const {
    status,
    successPulseKey,
    handleClick,
    isExporting,
  } = useExportAction({
    exportFn,
    resetKey,
  });

  return (
    <ExportActionButton
      onClick={handleClick}
      status={status}
      disabled={isExporting}
      successPulseKey={successPulseKey}
      title="匯出"
    />
  );
}
