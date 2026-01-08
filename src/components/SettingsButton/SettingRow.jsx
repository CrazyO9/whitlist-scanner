export function SettingRow({ label, checked, onToggle }) {
  return (
    <label className="settings-row">
      <span className="settings-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
      />
    </label>
  );
}
