// whitelist-scanner\src\components\ExportActionButton.jsx
import { useState, useEffect } from "react";
import "./ExportActionButton.css";
import ExportFormatMenu from "./ExportFormatMenu";

const STATUS_UI = {
  idle: { text: "匯出", busy: false },
  exporting: { text: "匯出中…", busy: true },
};

function ExportActionButton({
  onExport, // ⭐ 新 API
  status = "idle",
  disabled = false,
  title,
  className = "",
  leftIcon = null,
  hasLastExport,
}) {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const ui = STATUS_UI[status] ?? STATUS_UI.idle;
  const isDisabled = disabled || status === "loading";

  const handleSelect = async (format) => {
    setOpen(false);
    await onExport(format); // ⭐ 真正匯出
  };

  return (
    <div className="export-action-wrapper">
      <button
        type="button"
        disabled={isDisabled}
        title={title}
        aria-busy={ui.busy}
        className={[
          "export-action-btn",
          pulse ? "export-action-btn--pulse" : "",
          className,
        ].join(" ")}
        onClick={() => setOpen((v) => !v)} // ⭐ 打開 menu
      >
        {pulse && <span className="export-action-btn__pulse-ring" />}
        {leftIcon}
        <span>{ui.text} ▼</span>
      </button>

      {open && (
        <ExportFormatMenu
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          hasLastExport={hasLastExport}
        />
      )}
    </div>
  );
}

export default ExportActionButton;
