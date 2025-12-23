// whitelist-scanner\src\components\WhitelistExport.jsx
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import ExportActionButton from "./ExportActionButton";
import { useExportAction } from "../hooks/useExportAction";

export default function WhitelistExport({ whiteTable, resetKey }) {
  const exportByFormat = useCallback(
    async (format) => {
      if (!whiteTable) {
        throw new Error("沒有白名單資料");
      }

      const command = `export_whitelist_${format}`;

      const exportPath = await invoke(command, {
        table: whiteTable,
      });

      await invoke("reveal_in_folder", {
        path: exportPath,
      });

      return exportPath;
    },
    [whiteTable]
  );

  const {
    status,
    handleExport,
    isExporting,
  } = useExportAction({
    exportFn: exportByFormat,   // ⭐ 注意這裡
    resetKey,
  });

  return (
    <ExportActionButton
      onExport={handleExport}     // ⭐ format 會一路傳進來
      status={status}
      disabled={isExporting}
    />
  );
}

