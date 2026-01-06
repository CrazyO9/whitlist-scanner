// src/components/ScanSettings.jsx
export default function ScanSettings({
  soundPassEnabled,
  soundFailEnabled,
  isDarkMode,

  onToggleSoundPass,
  onToggleSoundFail,
  onToggleTheme,
  onOpenExportFolder,
}) {
  return (
    <div className="scan-settings">
      <h3 className="settings-title">設定</h3>

      {/* 音效設定 */}
      <div className="settings-group">
        <div className="settings-item">
          <label>
            <input
              type="checkbox"
              checked={soundPassEnabled}
              onChange={onToggleSoundPass}
            />
            通過音效
          </label>
        </div>

        <div className="settings-item">
          <label>
            <input
              type="checkbox"
              checked={soundFailEnabled}
              onChange={onToggleSoundFail}
            />
            不通過音效
          </label>
        </div>
      </div>

      {/* 主題模式 */}
      <div className="settings-group">
        <div className="settings-item">
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={onToggleTheme}
            />
            黑夜模式
          </label>
        </div>
      </div>

      {/* 工具 */}
      <div className="settings-group">
        <button
          type="button"
          className="settings-action"
          onClick={onOpenExportFolder}
        >
          開啟匯出資料夾
        </button>
      </div>
    </div>
  );
}
