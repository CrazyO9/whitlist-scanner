import React from "react";

export default function ResultPanel({ result }) {
  return (
    <div className="result-panel">
      <h2>掃描結果</h2>

      {!result ? (
        <div className="result-card">
            <p></p>
            <p>尚未掃描任何代碼。</p>
            <p></p>
        </div>
      ) : (
        <div
          className={`result-card ${
            result.allowed ? "result-ok" : "result-ng"
          }`}
        >
          <p>
            <strong>代碼：</strong>
            {result.code}
          </p>

          <p>
            <strong>狀態：</strong>
            {result.allowed ? "✅ 通過" : "⛔ 不存在"}
          </p>

          <p className="result-time">
            <strong>時間：</strong>
            {result.time}
          </p>
        </div>
      )}
    </div>
  );
}
