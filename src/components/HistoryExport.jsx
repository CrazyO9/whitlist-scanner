// whitelist-scanner/src/components/ExportHistory.jsx
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import ExportActionButton from "./ExportActionButton";
import { useExportAction } from "../hooks/useExportAction";

export default function HistoryExport({ history, historyVersion }) {
  const exportByFormat = useCallback(
    async (format) => {
      if (!history || history.length === 0) return;

      const payload = history.map((item) => ({
        timestamp: item.timestamp,
        code: item.code,
        is_whitelisted: item.isWhitelisted,
        name: item.entry?.name ?? null,
      }));

      try {
        const command = `export_scan_history_${format}`;

        const exportPath = await invoke(command, {
          history: payload,
        });

        await invoke("reveal_in_folder", {
          path: exportPath,
        });

        return exportPath;
      } catch (err) {
        console.error(err);
        alert("匯出掃描紀錄失敗");
        throw err;
      }
    },
    [history]
  );

  const { status, handleExport, isExporting } = useExportAction(
    {
      exportFn: exportByFormat,
      resetKey: historyVersion,
    }
  );

  return (
    <ExportActionButton
      onExport={handleExport}
      status={status}
      disabled={isExporting}
    />
  );
}
