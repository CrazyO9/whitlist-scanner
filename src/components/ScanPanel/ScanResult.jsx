// whitelist-scanner/src/components/ScanResult.jsx
import React from "react";

export default function ScanResult({ result }) {
  if (!result) {
    return;
  }

  const { code, isWhitelisted, timestamp } = result;

  return (
    <div
      className={`scan-result ${isWhitelisted ? "pass" : "fail"}`}
    >
      <div className="scan-code">{code}</div>

      <div className="scan-status">
        {isWhitelisted ? "通過 ✔" : "不在白名單 ✖"}
      </div>

      <div className="scan-time">{timestamp}</div>

    </div>
  );
}
