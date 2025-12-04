import React from "react";

export default function ExportHistory({ history }) {
  const handleExport = () => {
    let csv = "\uFEFF貨號,白名單,掃描時間\n";

    history.forEach((r) => {
      csv += `${r.code},${r.allowed},${r.time}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "匯出掃描紀錄.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="tool-button" onClick={handleExport}>
      匯出掃描紀錄 (CSV)
    </button>
  );
}
