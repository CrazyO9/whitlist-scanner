// whitelist-scanner/src/components/ResultPanel.jsx
import React from "react";
import ScanForm from "./ScanForm";
import ScanResult from "./ScanResult";

export default function ResultPanel({
  scanner,          // useScanner 回傳物件
  whitelistReady,   // 來自 useWhitelist.isWhitelistReady
}) {
  const {
    inputCode,
    lastScanResult,
    scanMessage,
    handle_input_change,
    do_scan,
  } = scanner;

  return (
    <div className="result-panel">
      <h2>掃描器</h2>

      <ScanForm
        inputCode={inputCode}
        onInputChange={handle_input_change}
        onScan={do_scan}
        whitelistReady={!whitelistReady}
      />

      {scanMessage && (
        <div className="scan-message">
          {scanMessage}
        </div>
      )}

      <ScanResult result={lastScanResult} />
    </div>
  );
}
