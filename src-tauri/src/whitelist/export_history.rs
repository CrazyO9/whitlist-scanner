use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;

#[derive(Serialize, Deserialize)]
pub struct ScanRecord {
    pub timestamp: String,
    pub code: String,
    pub is_whitelisted: bool,
    pub name: Option<String>,
}

#[tauri::command]
pub async fn export_scan_history(
    _app: AppHandle,
    history: Vec<ScanRecord>,
) -> Result<String, String> {
    if history.is_empty() {
        return Err("沒有可匯出的掃描紀錄".to_string());
    }

    let exe_dir = std::env::current_exe()
        .map_err(|e| e.to_string())?
        .parent()
        .ok_or("找不到程式目錄")?
        .to_path_buf();

    let export_dir = exe_dir.join("export");
    if !export_dir.exists() {
        fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    }

    let filename = format!(
        "scan-history_{}.csv",
        chrono::Local::now().format("%Y%m%d_%H%M%S")
    );

    let path: PathBuf = export_dir.join(&filename);

    // CSV header
    let mut csv = String::from("時間,代碼,是否通過,商品名稱\n");

    for r in history {
        let line = format!(
            "\"{}\",\"{}\",\"{}\",\"{}\"\n",
            r.timestamp,
            r.code,
            if r.is_whitelisted { "PASS" } else { "FAIL" },
            r.name.unwrap_or_default()
        );
        csv.push_str(&line);
    }

    fs::write(&path, csv).map_err(|e| e.to_string())?;

    Ok(filename)
}
