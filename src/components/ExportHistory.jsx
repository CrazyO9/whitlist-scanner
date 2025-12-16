// whitelist-scanner/src/components/ExportHistory.jsx
import React from "react";
import { invoke } from "@tauri-apps/api/core";

export default function ExportHistory({ history }) {
  const export_csv = async () => {
    if (!history || history.length === 0) return;

    // 將前端紀錄轉成後端需要的結構
    const payload = history.map((item) => ({
      timestamp: item.timestamp,
      code: item.code,
      is_whitelisted: item.isWhitelisted,
      name: item.entry?.name ?? null,
    }));

    try {
      const filename = await invoke("export_scan_history", {
        history: payload,
      });

      alert(`掃描紀錄已匯出：${filename}`);
    } catch (err) {
      console.error(err);
      alert("匯出掃描紀錄失敗");
    }
  };

  return (
    <button className="export-history-btn" onClick={export_csv}>
      匯出掃描紀錄
    </button>
  );
}
