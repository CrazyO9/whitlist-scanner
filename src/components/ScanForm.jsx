// whitelist-scanner/src/components/ScanForm.jsx
import React from "react";

export default function ScanForm({
  inputCode,
  onInputChange,
  onScan,
  disabled = false,
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
        disabled={disabled}
        placeholder="請輸入條碼或代碼…"
        className="scan-input"
      />

      <button
        className="scan-btn"
        onClick={onScan}
        disabled={disabled}
      >
        掃描
      </button>
    </div>
  );
}
