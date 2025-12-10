// whitelist-scanner/src/components/ScanResult.jsx
import React from "react";

export default function ScanResult({ result }) {
  if (!result) {
    return (
      <div className="scan-result empty">
        尚未掃描
      </div>
    );
  }

  const { code, isWhitelisted, entry, timestamp } = result;

  return (
    <div
      className={`scan-result ${isWhitelisted ? "pass" : "fail"}`}
    >
      <div className="scan-code">{code}</div>

      <div className="scan-status">
        {isWhitelisted ? "允許通過 ✔" : "不在白名單 ✖"}
      </div>

      <div className="scan-time">{timestamp}</div>

      {isWhitelisted && (
        <div className="scan-entry">
          <div>商品名稱：{entry?.name}</div>
        </div>
      )}
    </div>
  );
}
