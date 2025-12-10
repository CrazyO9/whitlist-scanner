// whitelist-scanner/src/components/WhitelistExport.jsx
import React from "react";
import { format_for_filename } from "../utils/time";

export default function WhitelistExport({ whitelistEntries }) {
  const export_csv = () => {
    if (!whitelistEntries || whitelistEntries.length === 0) return;

    const headers = Object.keys(whitelistEntries[0]);
    const rows = whitelistEntries.map((entry) =>
      headers.map((h) => `"${String(entry[h] ?? "").replace(/"/g, '""')}"`)
    );

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const filename = `whitelist_${format_for_filename()}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <button className="export-btn" onClick={export_csv}>
      匯出白名單
    </button>
  );
}
