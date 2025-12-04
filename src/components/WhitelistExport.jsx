import React from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export default function WhitelistExport({ whitelist }) {
  const handleExport = async () => {
    const path = await save({
      title: "匯出白名單 CSV",
      filters: [{ name: "CSV", extensions: ["csv"] }],
    });

    if (!path) return;

    await invoke("export_whitelist", {
      path,
      items: whitelist,
    });
  };

  return (
    <button className="tool-button" onClick={handleExport}>
      匯出白名單
    </button>
  );
}
