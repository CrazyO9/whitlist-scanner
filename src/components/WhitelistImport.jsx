import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export default function WhitelistImport({ handle_imported }) {
  const handle_open_file = async () => {
    try {
      // 打開 Tauri 檔案對話框
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "EXCEL",
            extensions: ["csv", "xlsx"],
          },
        ],
      });

      if (!selected) {
        console.log("取消選擇");
        return;
      }

      // selected 就是路徑（String）
      const path = selected;

      // 呼叫後端 Rust，依據副檔名自動解析
      const parsed = await invoke("import_whitelist", { path });

      // 回傳 WhiteTable 給 React useWhitelist
      handle_imported(parsed, path);
    } catch (err) {
      console.error("匯入白名單失敗:", err);
      alert("匯入白名單失敗，請確認檔案是否有效。");
    }
  };

  return (
    <div className="whitelist-import">
      <button className="import-btn" onClick={handle_open_file}>
        匯入白名單
      </button>
    </div>
  );
}
