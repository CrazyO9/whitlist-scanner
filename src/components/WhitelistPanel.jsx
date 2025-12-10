// whitelist-scanner/src/components/WhitelistPanel.jsx
import React from "react";
import WhitelistImport from "./WhitelistImport";
import WhitelistExport from "./WhitelistExport";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";

export default function WhitelistPanel({
  whitelist_table,
  whitelistEntries,
  importedFileName,
  whitelistMessage,
  handle_imported,
  clearWhitelist,
}) {
  const {
    isConfirming: confirmClearWL,
    try_action: tryClearWhitelist,
  } = useDoubleClickConfirm({ onConfirm: clearWhitelist });
  return (
    <div className="whitelist-panel">
      <div className="panel-header">
        <h2>白名單管理</h2>
      </div>

      <div className="panel-actions">
        <WhitelistImport handle_imported={handle_imported} />
        <WhitelistExport />
        <button className="toolbar-btn danger" onClick={tryClearWhitelist}>
          {confirmClearWL ? "再次確認" : "清空白名單"}
      </button>
      </div>

      {importedFileName && (
        <div className="file-info">
          來源：{importedFileName}
        </div>
      )}

      {whitelistMessage && (
        <div className="info-msg">{whitelistMessage}</div>
      )}

      <div className="whitelist-table">
        <table>
          <thead>
            <tr>
              {Object.keys(whitelist_table[0] ?? {}).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {whitelist_table.map((row) => (
              <tr key={row.id}>
                {Object.keys(row).map((key) => (
                  <td key={key}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {whitelist_table.length === 0 && (
          <div className="empty-msg">尚未匯入白名單資料</div>
        )}
      </div>
    </div>
  );
}
