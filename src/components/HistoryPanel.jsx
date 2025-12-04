import React from "react";

export default function HistoryPanel({ history, clearHistory, deleteOne }) {
  return (
    <section className="history-section">
      <div className="histoty-header">
        <button
          type="button"
          onClick={clearHistory}
          className="clear-button"
          >
          清空紀錄
        </button>
      </div>

      {history.length === 0 ? (
        <p>目前沒有任何紀錄。</p>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>編號</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, index) => (
                <tr
                  key={index}
                  className={row.allowed ? "row-ok" : "row-ng"}
                >
                  <td>{row.time}</td>
                  <td>{row.code}</td>
                  <td>{row.allowed ? "是" : "否"}</td>
                  <td>
                    <button
                      className="delete-row-button"
                      onClick={() => deleteOne(index)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
