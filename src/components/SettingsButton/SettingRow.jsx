export function SettingRow({ label, checked, onToggle }) {
  return (
    <div className="settings-row">
      <span className="settings-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
      />
    </div>
  );
}
