// whitelist-scanner/src/hooks/useScanner.js
import { useCallback, useState } from "react";
import { normalize_code } from "../utils/normalize";
import { format_timestamp } from "../utils/time";

/**
 * 需要由外部傳入：
 * - findByCode: (code: string) => whitelistEntry | null
 * - onScanned: (scanRecord) => void   // 給 history 用（可選）
 */
export function useScanner({ findByCode, onScanned } = {}) {
  const [inputCode, setInputCode] = useState("");
  const [lastScanResult, setLastScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState("");

  const handle_input_change = useCallback((event) => {
    setInputCode(event.target.value);
  }, []);

  const clear_input = useCallback(() => {
    setInputCode("");
  }, []);

  const do_scan = useCallback(
    (rawCode) => {
      const code = normalize_code(rawCode ?? inputCode);
      if (!code) {
        setScanMessage("請先輸入條碼 / 代碼");
        return;
      }

      if (!findByCode) {
        setScanMessage("白名單尚未準備好");
        return;
      }

      const found = findByCode(code);
      const isWhitelisted = !!found;
      const timestamp = format_timestamp();

      const record = {
        code,
        isWhitelisted,
        timestamp,
        entry: found,
      };

      setLastScanResult(record);
      setScanMessage(isWhitelisted ? "允許通過" : "不在白名單");

      if (typeof onScanned === "function") {
        onScanned(record);
      }

      // 掃完清輸入框（可依需求改）
      setInputCode("");
    },
    [findByCode, inputCode, onScanned]
  );

  return {
    inputCode,
    lastScanResult,
    scanMessage,

    handle_input_change,
    clear_input,
    do_scan,
  };
}
