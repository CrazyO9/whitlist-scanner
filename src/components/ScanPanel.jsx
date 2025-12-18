// whitelist-scanner/src/components/ResultPanel.jsx
import React from "react";
import ScanForm from "./ScanForm";
import ScanResult from "./ScanResult";

export default function ScanPanel({
  scanner,          // useScanner 回傳物件
  whitelistReady,   // 來自 useWhitelist.isWhitelistReady
}) {
  const {
    inputCode,
    lastScanResult,
    scanMessage,
    set_input_code,
    handle_input_change,
    do_scan,
  } = scanner;

  return (
    <div className="result-panel">
      <h2>掃描器</h2>

      <ScanForm
        inputCode={inputCode}
        onInputChange={handle_input_change}
        onInputSet={set_input_code}
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
