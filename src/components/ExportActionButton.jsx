import {useState, useEffect } from "react";
import "./ExportActionButton.css";

const STATUS_UI = {
  idle: { text: "匯出", busy: false },
  loading: { text: "匯出中…", busy: true },
  done: { text: "📂 開啟", busy: false },
};

function ExportActionButton({
  onClick,
  status = "idle",
  disabled = false,
  title,
  className = "",
  successPulseKey = 0,
  leftIcon = null,
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (successPulseKey <= 0) return;
    setPulse(true);
    const timerId = setTimeout(() => setPulse(false), 650);
    return () => clearTimeout(timerId);
  }, [successPulseKey]);

  const ui = STATUS_UI[status] ?? STATUS_UI.idle;
  const isDisabled = disabled || status === "loading";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      aria-busy={ui.busy}
      className={[
        "export-action-btn",
        pulse ? "export-action-btn--pulse" : "",
        className,
      ].join(" ")}
    >
      {pulse && <span className="export-action-btn__pulse-ring" />}

      {leftIcon}
      <span>{ui.text}</span>
    </button>
  );
}

export default ExportActionButton;
