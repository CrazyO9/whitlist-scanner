// whitelist-scanner/src/components/ScanForm.jsx
import React from "react";

export default function ScanForm({
  inputCode,
  onInputChange,
  onScan,
  whitelistReady = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onScan();
    }
  };

  return (
    <div className="scan-form">
      <input
        type="text"
        value={inputCode}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        disabled={whitelistReady}
        placeholder={!whitelistReady ? "請掃描條碼…" : "尚未匯入白名單"}
        className="scan-input"
      />

      <button
        className="scan-btn"
        onClick={onScan}
        disabled={whitelistReady}
      >
        掃描
      </button>
    </div>
  );
}
