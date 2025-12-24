// whitelist-scanner/src/components/ResultPanel.jsx
import { useState, useEffect } from "react";
import ScanForm from "./ScanForm";
import ScanResult from "./ScanResult";
import { useScanSound } from "../hooks/useScanSound";

export default function ScanPanel({
  scanner, // useScanner 回傳物件
  whitelistReady, // 來自 useWhitelist.isWhitelistReady
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [scanAttemptId, setScanAttemptId] = useState(0);

  const {
    inputCode,
    lastScanResult,
    scanMessage,
    set_input_code,
    handle_input_change,
    do_scan,
  } = scanner;

  const { play } = useScanSound();

  useEffect(() => {
    if (!lastScanResult) return;
    const type = lastScanResult.isWhitelisted ? "success" : "fail";

    play(type);
  }, [lastScanResult, play]);

  const handleScan = (code) => {
    do_scan(code);
    setScanAttemptId((t) => t + 1);
  };

  useEffect(() => {
    if (!scanMessage) return;
    setShowMessage(true);

    const timerId = setTimeout(() => {
      setShowMessage(false);
    }, 650);

    return () => clearTimeout(timerId);
  }, [scanAttemptId]);

  return (
    <div className="result-panel">
      <h2>掃描器</h2>
      <ScanForm
        inputCode={inputCode}
        onInputChange={handle_input_change}
        onInputSet={set_input_code}
        onScan={handleScan}
        disabled={!whitelistReady}
        message={scanMessage}
        scanAttemptId={scanAttemptId}
        showMessage={showMessage}
      />

      <ScanResult result={lastScanResult} />
    </div>
  );
}
