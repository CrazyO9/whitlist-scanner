import React from "react";

export default function ScanInput({ code, setCode, onSubmit, inputRef }) {
  return (
    <section className="scan-section">
      <form onSubmit={onSubmit} className="scan-form">
        <label className="scan-label">
          條碼 / 代碼
          <input
            ref={inputRef}
            className="scan-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="請掃描條碼或輸入代碼後按 Enter"
          />
        </label>
        <button type="submit" className="scan-button">
          確認
        </button>
      </form>
    </section>
  );
}
