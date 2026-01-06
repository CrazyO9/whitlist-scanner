// whitelist-scanner/src/components/ScanPanel.jsx
import { useState, useEffect } from "react";
import ScanForm from "./ScanForm";
import ScanResult from "./ScanResult";
import { useScanSound } from "../../hooks/useScanSound";
import ScanSettings from "./ScanButton/ScanSettings";
import { usePreferences } from "../../hooks/usePreferences";

export default function ScanPanel({
  scanner, // useScanner 回傳物件
  whitelistReady, // 來自 useWhitelist.isWhitelistReady
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [scanAttemptId, setScanAttemptId] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const { preferences, setPreference } = usePreferences();

  const { soundPassEnabled, soundFailEnabled, darkMode } = preferences;
  const {
    inputCode,
    lastScanResult,
    scanMessage,
    set_input_code,
    handle_input_change,
    do_scan,
  } = scanner;

  const { play } = useScanSound({
    soundPassEnabled,
    soundFailEnabled,
  });

  useEffect(() => {
    if (!lastScanResult) return;
    if (lastScanResult.source !== "scan") return;
    
    const type = lastScanResult.isWhitelisted ? "pass" : "fail";
    play(type);
  }, [lastScanResult?.scanAttempId]);

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
      <div>
        <h2>掃描器</h2>
        <button
          className="settings-button"
          onClick={() => setShowSettings((v) => !v)}
        >
          ⚙
        </button>
        {showSettings && (
          <ScanSettings
            soundPassEnabled={soundPassEnabled}
            soundFailEnabled={soundFailEnabled}
            isDarkMode={darkMode}
            onToggleSoundPass={() =>
              setPreference("soundPassEnabled", !soundPassEnabled)
            }
            onToggleSoundFail={() =>
              setPreference("soundFailEnabled", !soundFailEnabled)
            }
            onToggleTheme={() => {
              setPreference("darkMode", !darkMode);
            }}
            // onOpenExportFolder={handleOpenExportFolder}
          />
        )}
      </div>
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
