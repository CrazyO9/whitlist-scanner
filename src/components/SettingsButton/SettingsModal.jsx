import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SettingsModal({ children, onClose }) {
  const panelRef = useRef(null);

  // esc close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // init focus
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // Focus lock
  useEffect(() => {
    const handleFocus = (e) => {
      if (!panelRef.current?.contains(e.target)) {
        panelRef.current?.focus();
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  return createPortal(
    <div className="settings-backdrop" onClick={onClose}>
      <div
        className="settings-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1} // enable to focus
        ref={panelRef}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
