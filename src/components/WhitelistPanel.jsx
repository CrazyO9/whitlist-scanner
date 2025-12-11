// whitelist-scanner/src/components/WhitelistPanel.jsx
import React, { useMemo } from "react";
import WhitelistImport from "./WhitelistImport";
import WhitelistExport from "./WhitelistExport";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";

export default function WhitelistPanel({
  whiteTable,          // 直接使用 WhiteTable，而不是 whitelist_table
  whitelistMessage,
  handle_imported,
  clearWhitelist,
}) {
  const { isConfirming, try_action } = useDoubleClickConfirm({
    onConfirm: clearWhitelist,
  });

  // ----------------------------
  // 將後端 columns 欄向量轉成 rows（列）
  // ----------------------------
  const tableRows = useMemo(() => {
    if (!whiteTable || !whiteTable.columns) return [];

    const columns = whiteTable.columns;
    const headers = Object.keys(columns);

    if (headers.length === 0) return [];

    // 取得最長的欄位長度（防止某些欄位比較短）
    const numRows = Math.max(...headers.map((h) => columns[h].length));

    const rows = [];

    for (let i = 0; i < numRows; i++) {
      const row = {};
      for (const h of headers) {
        row[h] = columns[h][i] ?? ""; // 若該 column 沒值 → 空字串
      }
      rows.push(row);
    }

    return rows;
  }, [whiteTable]);

  const headers = Object.keys(whiteTable?.columns ?? {});

  return (
    <div className="whitelist-panel">
      <div className="panel-header">
        <h2>白名單管理</h2>
      </div>

      <div className="panel-actions">
        <WhitelistImport handle_imported={handle_imported} />
        <WhitelistExport whiteTable={whiteTable} />
        <button className="toolbar-btn danger" onClick={try_action}>
          {isConfirming ? "再次確認" : "清空白名單"}
        </button>
      </div>

      {whiteTable?.file_name && (
        <div className="file-info">來源：{whiteTable.file_name}</div>
      )}

      {whitelistMessage && (
        <div className="info-msg">{whitelistMessage}</div>
      )}

      <div className="whitelist-table">
        {headers.length === 0 ? (
          <div className="empty-msg">尚未匯入白名單資料</div>
        ) : (
          <table>
            <thead>
              <tr>
                {headers.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((key) => (
                    <td key={key}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
