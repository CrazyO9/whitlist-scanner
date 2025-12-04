import React, { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export default function WhitelistImport({ setWhitelist, setWatchPath }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");   // 成功/錯誤訊息
  const [error, setError] = useState("");

  const handleImport = async () => {
    setMessage("");
    setError("");

    const selected = await open({
      title: "選擇白名單檔案",
      filters: [{ name: "Whitelist", extensions: ["txt", "csv", "xlsx"] }],
    });

    if (!selected) return;

    try {
      setLoading(true);

      // --- 呼叫 Rust 匯入 ---
      const items = await invoke("import_whitelist", { path: selected });

      setWhitelist(items);
      setWatchPath(selected);

      // --- 啟動監控 ---
      await invoke("watch_whitelist", { path: selected });

      setMessage(`✔ 匯入成功，共 ${items.length} 筆`);
    } 
    catch (err) {
      console.error(err);
      setError(`匯入失敗：${String(err)}`);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-section">
      <button className="tool-button" onClick={handleImport} disabled={loading}>
        {loading ? "匯入中…" : "匯入白名單 (Excel/CSV)"}
      </button>

      {message && <div className="import-ok">{message}</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
