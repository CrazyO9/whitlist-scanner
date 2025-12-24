// whitelist-scanner\src-tauri\src\whitelist\export_history.rs
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize)]
pub struct ScanRecord {
    pub timestamp: String,
    pub code: String,
    pub is_whitelisted: bool,
    pub name: Option<String>,
}

#[tauri::command]
pub async fn export_scan_history_csv(
    app: AppHandle,
    history: Vec<ScanRecord>,
) -> Result<String, String> {
    if history.is_empty() {
        return Err("沒有可匯出的掃描紀錄".to_string());
    }

    /* --------------------------------
     * 匯出資料夾
     * -------------------------------- */
    let export_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("export");

    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;

    let filename = format!(
        "ScanHistory_{}.csv",
        chrono::Local::now().format("%Y%m%d%H%M%S")
    );

    let path: PathBuf = export_dir.join(&filename);

    // CSV header
    let mut csv = String::from("\u{FEFF}代碼,是否通過,時間,商品名稱\n");

    for r in history {
        let line = format!(
            "\"{}\",\"{}\",\"{}\",\"{}\"\n",
            r.code,
            if r.is_whitelisted { "PASS" } else { "FAIL" },
            r.timestamp,
            r.name.unwrap_or_default()
        );
        csv.push_str(&line);
    }

    fs::write(&path, csv).map_err(|e| e.to_string())?;

    Ok(path.to_string_lossy().to_string())
}
