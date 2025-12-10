// whitelist-scanner/src/components/ExportHistory.jsx
import React from "react";
import { format_for_filename } from "../utils/time";

export default function ExportHistory({ history }) {
  const export_csv = () => {
    if (!history || history.length === 0) return;

    const headers = ["時間", "代碼", "是否通過", "商品名稱"];
    const rows = history.map((item) => [
      item.timestamp,
      item.code,
      item.isWhitelisted ? "PASS" : "FAIL",
      item.entry?.name ?? "",
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row =>
          row
            .map((col) => `"${String(col).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const filename = `scan-history_${format_for_filename()}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <button className="export-history-btn" onClick={export_csv}>
      匯出掃描紀錄
    </button>
  );
}
