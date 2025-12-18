// whitelist-scanner/src/components/WhitelistPanel.jsx
import { useEffect, useMemo, useState } from "react";
import WhitelistImport from "./WhitelistImport";
import WhitelistExport from "./WhitelistExport";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";

export default function WhitelistPanel({
  whiteTable,
  whitelistMessage,
  handle_imported,
  clearWhitelist,
}) {
  const { isConfirming, try_action } = useDoubleClickConfirm({
    onConfirm: () => {
      clearWhitelist();
      setResetKey((k) => k + 1);
    },
  });
  const [resetKey, setResetKey] = useState(0);
  
  const handleImportedWithReset = (table) => {
    handle_imported(table);       
    setResetKey((k) => k + 1);    // 🔁 匯入 → reset
  };

  // ----------------------------
  // 以後端 header_order 作為「唯一權威順序」
  // 若 header_order 不存在，才退回 columns keys（不建議，但保底）
  // ----------------------------
  const canonicalHeaders = useMemo(() => {
    const columns = whiteTable?.columns ?? {};
    const order = Array.isArray(whiteTable?.header_order)
      ? whiteTable.header_order
      : [];

    // 只保留真的存在於 columns 的欄位，避免 header_order 裡有不存在的 key
    const ordered = order.filter((h) => Object.prototype.hasOwnProperty.call(columns, h));

    // fallback：若後端沒給 header_order 或過濾後為空，才用 Object.keys
    return ordered.length > 0 ? ordered : Object.keys(columns);
  }, [whiteTable]);

  const visibleHeaders = canonicalHeaders;

  // ----------------------------
  // 將後端 columns 欄向量轉成 rows（列）
  // 這裡「只用 visibleHeaders」，且用 Math.min 避免多出空列
  // ----------------------------
  const tableRows = useMemo(() => {
    const columns = whiteTable?.columns ?? {};
    if (visibleHeaders.length === 0) return [];

    const numRows = Math.min(
      ...visibleHeaders.map((h) => (columns[h] ? columns[h].length : 0))
    );

    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = {};
      for (const h of visibleHeaders) {
        row[h] = columns[h][i] ?? "";
      }
      rows.push(row);
    }
    return rows;
  }, [whiteTable, visibleHeaders]);

  return (
    <div className="whitelist-panel">
      <div className="panel-header">
        <h2>白名單管理</h2>
        <div className="panel-actions">
          <WhitelistImport handle_imported={handleImportedWithReset} />
          <WhitelistExport 
            whiteTable={whiteTable}
            resetKey={resetKey}
          />
          <button className="clear-btn danger" onClick={try_action}>
            {isConfirming ? "確認" : "清空"}
          </button>
        </div>
      </div>


      {whiteTable?.file_name && (
        <div className="info-msg">
          <div>來源：{whiteTable.file_name}</div>
          <div>{whitelistMessage}</div>
        </div>
      )}

      <div className="whitelist-table">
        {visibleHeaders.length === 0 ? (
          <div className="empty-msg">尚未匯入白名單</div>
        ) : (
          <table>
            <thead>
              <tr>
                {visibleHeaders.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx}>
                  {visibleHeaders.map((key) => (
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
