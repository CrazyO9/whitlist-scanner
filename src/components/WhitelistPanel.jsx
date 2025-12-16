import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { useExportAction } from "../hooks/useExportAction";

export default function WhitelistExport({ whiteTable, resetKey }) {
  const exportFn = () => {
    if (!whiteTable) {
      return Promise.reject("沒有白名單資料");
    }
    return invoke("export_whitelist", { table: whiteTable });
  };

  const {
    status,
    isExporting,
    handleClick,
  } = useExportAction({
    exportFn,
    resetKey,
  });

  return (
    <button
      className={`export-btn ${status}`}
      onClick={handleClick}
      disabled={isExporting}
    >
      {status === "idle" && "匯出白名單"}
      {status === "exporting" && "匯出中…"}
      {status === "done" && "📂 開啟資料夾"}
      <span className="export-progress" />
    </button>
  );
}
