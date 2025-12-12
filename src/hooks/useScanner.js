// whitelist-scanner/src/hooks/useScanner.js
import { useCallback, useState } from "react";
import { normalize_code } from "../utils/normalize";
import { format_timestamp } from "../utils/time";

/**
 * 需要外部提供：
 * - findByCode: (code) => entry | null
 * - isWhitelistReady: boolean
 * - onScanned: (record) => void
 */
export function useScanner({ findByCode, isWhitelistReady, onScanned } = {}) {
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

      if (typeof onScanned === "function") onScanned(record);

      setInputCode(""); // 清空輸入
    },
    [findByCode, isWhitelistReady, inputCode, onScanned]
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
