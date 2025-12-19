// whitelist-scanner\src\components\ScanForm.jsx
export default function ScanForm({
  inputCode,
  onInputChange,
  onInputSet,
  onScan,
  disabled = false,
  message,
  scanAttemptId,
  showMessage
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
      <div className="scan-input-wrapper">
        <input
          type="text"
          value={inputCode}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={disabled ? "尚未匯入白名單" : "請掃描條碼…"}
          className="scan-input"
        />
        {/* ⭐ Pop-out 訊息 */}
        {showMessage && message && (
          <div 
          key={scanAttemptId}
          className="scan-pop-message">
            {message}
          </div>
        )}
      </div>
      <button
        className="scan-btn"
        onClick={() => onScan(inputCode)}
        disabled={disabled}
      >
        掃描
      </button>
    </div>
  );
}
