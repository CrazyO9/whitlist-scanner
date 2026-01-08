// whitelist-scanner/src/components/ScanPanel.jsx
import { useState, useEffect } from "react";
import ScanForm from "./ScanForm";
import ScanResult from "./ScanResult";
import { useScanSound } from "../../hooks/useScanSound";

export default function ScanPanel({
  scanner, // useScanner 回傳物件
  whitelistReady, // 來自 useWhitelist.isWhitelistReady
  onOpenSettings,
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [scanAttempId, setScanAttempId] = useState(0);

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
    if (lastScanResult.source !== "scan") return;

    const type = lastScanResult.isWhitelisted ? "pass" : "fail";
    play(type);
  }, [lastScanResult?.scanAttempId]);

  const handleScan = (code) => {
    do_scan(code);
    setScanAttempId((t) => t + 1);
  };

  useEffect(() => {
    if (!scanMessage) return;
    setShowMessage(true);

    const timerId = setTimeout(() => {
      setShowMessage(false);
    }, 650);

    return () => clearTimeout(timerId);
  }, [scanAttempId]);

  return (
    <div className="scan-panel">
      <header className="scan-header">
        <h2>掃描器</h2>
        <button
          className="settings-button"
          onClick={onOpenSettings}
          aria-label="settings"
        >
          ⚙
        </button>
      </header>
      <ScanForm
        inputCode={inputCode}
        onInputChange={handle_input_change}
        onInputSet={set_input_code}
        onScan={handleScan}
        disabled={!whitelistReady}
        message={scanMessage}
        scanAttempId={scanAttempId}
        showMessage={showMessage}
      />

      <ScanResult result={lastScanResult} />
    </div>
  );
}
