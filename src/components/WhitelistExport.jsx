// whitelist-scanner/src/components/WhitelistExport.jsx
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function WhitelistExport({ whiteTable, resetKey }) {
  const [status, setStatus] = useState("idle"); // idle | exporting | done
  const [exportPath, setExportPath] = useState("");

  // ⭐ 只要 resetKey 變，就回到初始狀態
  useEffect(() => {
    setStatus("idle");
    setExportPath("");
  }, [resetKey]);

  const export_whitelist = async () => {
    if (!whiteTable || status === "exporting") return;

    try {
      setStatus("exporting");
      setExportPath("");

      const path = await invoke("export_whitelist", {
        table: whiteTable,
      });

      setExportPath(path);
      setStatus("done");

    } catch (err) {
      console.error(err);
      alert("匯出白名單失敗");
      setStatus("idle");
    }
  };
  
  const handle_click = () => {
    if (status === "idle") {
      export_whitelist();
    } else if (status === "done") {
      open(exportPath);
    };
  };

  return (
    <div className="export-wrapper">
        <button
          className={`export-btn ${status}`}
          onClick={handle_click}
          disabled={status === "exporting"}
        >
        {status === "idle" && "匯出白名單"}
        {status === "exporting" && "匯出中…"}
        {status === "done" && "📂 開啟資料夾"}
        <span className="export-progress" />
      </button>
    </div>
  );
}
