// whitelist-scanner/src/components/HistoryPanel.jsx
import { useState } from "react";
import ExportHistory from "./ExportHistory";
import { useDoubleClickConfirm } from "../hooks/useDoubleClickConfirm";


export default function HistoryPanel({
  history,
  historyVersion,
  onClear,        // 🔑 清空全部
  onRemoveOne,    // 🔑 刪除單筆
}) {
  const { isConfirming, try_action } = useDoubleClickConfirm({
    onConfirm: ()=>{
      onClear();
    }
  });
  const rowClass = (item) => {
    return [
      "center",
      (item.isWhitelisted ? "row-pass" : "row-fail")
    ].join(" ");
  };
  return (
    <div className="history-panel">
      <h2>掃描紀錄</h2>

      <ExportHistory
        history={history}
        historyVersion={historyVersion}
      />

      <button className="clear-btn danger" onClick={try_action}>
        {isConfirming ? "確認" : "清空"}
      </button>

          <table className="history-table">
            <thead>
              <tr>
                <th>貨號</th>
                <th>狀態</th>
                <th>掃描時間</th>
                <th>刪除</th>
              </tr>
            </thead>
              <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-msg">
                  尚無掃描紀錄
                </td>
              </tr>
            ) : (
                history.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={rowClass(item)}
                  >
                    <td>{item.code}</td>
                    <td>{item.isWhitelisted ? "✔" : "✖"}</td>
                    <td>{item.timestamp}</td>
                    <td>
                      <RemoveButton
                        onConfirm={() => { onRemoveOne(idx) }}
                      />
                    </td>
                  </tr>
                ))
              )}
              </tbody>
          </table>
      </div>
  );
}
// 🔜 未來條件成立時（再升級）
// - 只要符合 任一條，就抽成獨立檔：
// - 在 第二個地方用到
// - 行為開始變複雜（loading、tooltip）
// - 想統一 danger / confirm 行為
// -想寫測試
function RemoveButton({ onConfirm }) {
  const { isConfirming, try_action } = useDoubleClickConfirm({
    onConfirm,
  });

  return (
    <button
      className="clear-btn danger"
      onClick={try_action}
    >
      {isConfirming ? "確認" : "刪除"}
    </button>
  );
}
