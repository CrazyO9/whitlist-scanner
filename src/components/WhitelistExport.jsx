// whitelist-scanner\src\components\WhitelistExport.jsx
import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import ExportActionButton from "./ExportActionButton";
import { useExportAction } from "../hooks/useExportAction";

export default function WhitelistExport({ whiteTable, resetKey }) {
  const exportFn = useCallback(() => {
    if (!whiteTable) {
      return Promise.reject("沒有白名單資料");
    }
    return invoke("export_whitelist", { table: whiteTable });
  }, [whiteTable]);

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
