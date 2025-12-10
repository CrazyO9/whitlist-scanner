import React from "react";
import { invoke } from "@tauri-apps/api";

export default function WhitelistImport({ handle_imported }) {
  const handle_file = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 將 file 轉成 raw bytes，傳給 Rust
      const arrayBuffer = await file.arrayBuffer();
      const bytes = Array.from(new Uint8Array(arrayBuffer));

      // 呼叫後端 Rust
      const parsed = await invoke("parse_whitelist_file", {
        fileName: file.name,
        fileBytes: bytes,
      });

      // 回傳結果應為 Rust struct => 自動轉成 JS object array
      handle_imported(parsed, file.name);
    } catch (err) {
      console.error(err);
      alert("匯入白名單失敗，請確認檔案格式是否正確");
    }
  };

  return (
    <div className="whitelist-import">
      <label className="import-btn">
        匯入白名單
        <input
          type="file"
          accept=".csv,.xlsx"
          style={{ display: "none" }}
          onChange={handle_file}
        />
      </label>
    </div>
  );
}
