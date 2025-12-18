// whitelist-scanner/src/components/HistoryPanel.jsx
import { useState } from "react";
import ExportHistory from "./ExportHistory";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";

export default function HistoryPanel({ history, onClear }) {
  const { isConfirming, try_action } = useDoubleClickConfirm({
    onConfirm: () => {
      onClear();
      setResetKey((k) => k + 1);
    },
  });

  const [resetKey, setResetKey] = useState(0);
  // 新增掃描紀錄
  const handleScanned = (record) => {
    setHistory((prev) => [...prev, record]);
    setHistoryResetKey((k) => k + 1); // 🔁 reset export
  };

  // 刪除掃描紀錄
  const clearHistory = () => {
    setHistory([]);
    setHistoryResetKey((k) => k + 1); // 🔁 reset export
  };

  return (
    <div className="history-panel">
      <h2>掃描紀錄</h2>

      <ExportHistory history={history} />

      <button className="clear-btn danger" onClick={try_action}>
        {isConfirming ? "確認" : "清空"}
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
                <th>掃描時間</th>
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
