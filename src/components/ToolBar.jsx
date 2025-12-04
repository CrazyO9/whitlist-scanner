import React from "react";
import WhitelistImport from "./WhitelistImport";
import WhitelistExport from "./WhitelistExport";
import ExportHistory from "./ExportHistory";

export default function ToolBar({
  whitelist,
  history,
  setWhitelist,
  setWatchPath,
}) {
  return (
    <div className="tool-section">
      <WhitelistImport setWhitelist={setWhitelist} setWatchPath={setWatchPath} />
      <WhitelistExport whitelist={whitelist} />
      <ExportHistory history={history} />
    </div>
  );
}
