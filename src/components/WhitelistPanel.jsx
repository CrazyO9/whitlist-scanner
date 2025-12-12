// whitelist-scanner/src/components/WhitelistPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
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
    onConfirm: clearWhitelist,
  });

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

  // ----------------------------
  // 欄位 UI 狀態：可排序、可隱藏
  // 注意：白名單換檔時要「重置」這些狀態，否則會沿用舊狀態造成誤判
  // ----------------------------
  const [columnOrder, setColumnOrder] = useState([]);
  const [hiddenCols, setHiddenCols] = useState(() => new Set());

  // 當 whiteTable（或 header_order）變動時，重置欄位順序與隱藏狀態
  useEffect(() => {
    setColumnOrder(canonicalHeaders);
    setHiddenCols(new Set());
  }, [canonicalHeaders]);

  const visibleHeaders = useMemo(
    () => columnOrder.filter((h) => !hiddenCols.has(h)),
    [columnOrder, hiddenCols]
  );

  const toggleColumnVisibility = (col) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const moveColumn = (index, direction) => {
    setColumnOrder((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

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

      {whitelistMessage && <div className="info-msg">{whitelistMessage}</div>}

      <div className="whitelist-table">
        {visibleHeaders.length === 0 ? (
          <div className="empty-msg">尚未匯入白名單資料</div>
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
