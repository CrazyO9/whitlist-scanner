// whitelist-scanner/src/components/HistoryPanel.jsx
import React from "react";
import ExportHistory from "./ExportHistory";

export default function HistoryPanel({ history, onClear }) {

  return (
    <div className="history-panel">
      <h2>掃描紀錄</h2>

      <ExportHistory history={history} />

      <button className="clear-btn danger" onClick={onClear}>
        清除紀錄
      </button>

      <div className="history-table">
        {history.length === 0 ? (
          <div className="history-empty">尚無掃描紀錄</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>貨號</th>
                <th>狀態</th>
                <th>時間</th>
                {/* <th>商品名稱</th> */}
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr
                  key={idx}
                  className={item.isWhitelisted ? "row-pass" : "row-fail"}
                >
                  <td>{item.code}</td>
                  <td>{item.isWhitelisted ? "✔" : "✖"}</td>
                  <td>{item.timestamp}</td>
                  {/* <td>{item.entry?.name ?? ""}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
