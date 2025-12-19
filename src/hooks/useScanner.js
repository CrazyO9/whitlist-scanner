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

  const set_input_code = useCallback((value) => {
    if (typeof value !== "string") return;
    setInputCode(value);
  }, []);

  const do_scan = useCallback(
    (rawCode) => {
      // 避免 event / object 被誤傳
      const safeRaw =
        typeof rawCode === "string"
          ? rawCode
          : typeof rawCode?.target?.value === "string"
          ? rawCode.target.value
          : "";
      const code = normalize_code(safeRaw ?? inputCode);
      if (!code) {
        setScanMessage("請輸入條碼");
        return;
      }
      
      setScanMessage("");

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
    set_input_code,
    clear_input,
    do_scan,
  };
}
