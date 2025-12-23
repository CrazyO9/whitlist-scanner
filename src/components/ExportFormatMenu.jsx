// whitelist-scanner\src\components\ExportFormatMenu.jsx
import { useEffect, useRef } from "react";

export default function ExportFormatMenu({
  onSelect,
  onClose = () => {},
  hasLastExport,
}) {
  const ref = useRef(null);

  // 點擊外部自動關閉
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="export-menu">
      <button onClick={() => onSelect("xlsx")}>Excel（.xlsx）</button>
      <button onClick={() => onSelect("csv")}>純文字（.CSV）</button>
      {hasLastExport && (
        <>
          <div className="export-menu-divider" />
          <button onClick={() => onSelect("open")}>📂 開啟</button>
        </>
      )}
    </div>
  );
}
