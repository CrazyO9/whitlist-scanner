// whitelist-scanner/src/hooks/useScanHistory.js
import { useCallback, useMemo, useState } from "react";

export function useScanHistory() {
  const [ history, setHistory ] = useState([]);
  const [ historyVersion, setHistoryVersion] = useState(0);
  
  const add_record = useCallback((record) => {
    if (!record) return;
    setHistory((prev) => [
      {
        ...record,
        _id: crypto.randomUUID()
      },
      ...prev]); // 最新在最前
      setHistoryVersion((v) => v + 1);
  }, []);

  const clear_history = useCallback(() => {
    setHistory([]);
    setHistoryVersion((v) => v + 1);
  }, []);

  const remove_record = useCallback((index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    setHistoryVersion((v) => v + 1);
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
    historyVersion,
    add_record,
    remove_record,
    clear_history,
    export_rows,
  };
}
