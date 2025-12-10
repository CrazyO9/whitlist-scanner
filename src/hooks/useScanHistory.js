// whitelist-scanner/src/hooks/useScanHistory.js
import { useCallback, useMemo, useState } from "react";

export function useScanHistory() {
  const [history, setHistory] = useState([]);

  const add_record = useCallback((record) => {
    if (!record) return;
    setHistory((prev) => [record, ...prev]); // 最新在最前
  }, []);

  const clear_history = useCallback(() => {
    setHistory([]);
  }, []);

  // 匯出用純資料
  const export_rows = useMemo(
    () =>
      history.map((item) => ({
        timestamp: item.timestamp,
        code: item.code,
        isWhitelisted: item.isWhitelisted,
        name: item.entry?.name ?? "",
      })),
    [history]
  );

  return {
    history,
    add_record,
    clear_history,
    export_rows,
  };
}
