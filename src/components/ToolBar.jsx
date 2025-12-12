// whitelist-scanner/src/components/ToolBar.jsx
import React from "react";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";

export default function ToolBar({
  toggleWhitelistPanel,
  toggleHistoryPanel,
  clearWhitelist,
  clearHistory,
}) {
  const {
    isConfirming: confirmClearWL,
    try_action: tryClearWhitelist,
  } = useDoubleClickConfirm({ onConfirm: clearWhitelist });

  const {
    isConfirming: confirmClearHistory,
    try_action: tryClearHistory,
  } = useDoubleClickConfirm({ onConfirm: clearHistory });

  return (
    <div className="tool-bar">
      <button className="toolbar-btn" onClick={toggleWhitelistPanel}>
        白名單管理
      </button>

      <button className="toolbar-btn" onClick={toggleHistoryPanel}>
        掃描紀錄
      </button>

      <button className="toolbar-btn danger" onClick={tryClearWhitelist}>
        {confirmClearWL ? "再次確認" : "清空白名單"}
      </button>

      <button className="toolbar-btn danger" onClick={tryClearHistory}>
        {confirmClearHistory ? "再次確認" : "清空歷史"}
      </button>
    </div>
  );
}
