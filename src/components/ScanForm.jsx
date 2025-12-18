export default function ScanForm({
  inputCode,
  onInputChange,
  onInputSet,
  onScan,
  whitelistReady = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onScan(inputCode);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    onInputSet(pastedText);
    onScan(pastedText);
  };

  return (
    <div className="scan-form">
      <input
        type="text"
        value={inputCode}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={whitelistReady}
        placeholder={!whitelistReady ? "請掃描條碼…" : "尚未匯入白名單"}
        className="scan-input"
      />

      <button
        className="scan-btn"
        onClick={() => onScan(inputCode)}
        disabled={whitelistReady}
      >
        掃描
      </button>
    </div>
  );
}
