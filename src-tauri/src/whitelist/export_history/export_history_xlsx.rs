// whitelist-scanner/src-tauri/src/whitelist/export_history/export_history_xlsx.rs
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

use chrono::Local;
use tauri::{AppHandle, Manager};
use rust_xlsxwriter::{Workbook, Format};

#[derive(Serialize, Deserialize)]
pub struct ScanRecord {
    pub timestamp: String,
    pub code: String,
    pub is_whitelisted: bool,
    pub name: Option<String>,
}

#[tauri::command]
pub async fn export_scan_history_xlsx(
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
        "{}-scanHistory.xlsx",
        Local::now().format("%Y%m%d%H%M%S"),
    );

    let path: PathBuf = export_dir.join(filename);

    /* --------------------------------
     * Excel
     * -------------------------------- */
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    // ⭐ 文字格式（避免科學記號）
    let text_format = Format::new().set_num_format("@");

    // Header
    worksheet.write_string(0, 0, "時間").map_err(|e| e.to_string())?;
    worksheet.write_string(0, 1, "代碼").map_err(|e| e.to_string())?;
    worksheet.write_string(0, 2, "是否通過").map_err(|e| e.to_string())?;
    worksheet.write_string(0, 3, "商品名稱").map_err(|e| e.to_string())?;

    // Rows
    for (idx, r) in history.iter().enumerate() {
        let row = (idx + 1) as u32;

        worksheet
            .write_string(row, 0, &r.timestamp)
            .map_err(|e| e.to_string())?;

        worksheet
            .write_with_format(row, 1, &r.code, &text_format)
            .map_err(|e| e.to_string())?;

        worksheet
            .write_string(
                row,
                2,
                if r.is_whitelisted { "PASS" } else { "FAIL" },
            )
            .map_err(|e| e.to_string())?;

        worksheet
            .write_string(row, 3, r.name.as_deref().unwrap_or(""))
            .map_err(|e| e.to_string())?;
    }

    workbook.save(&path).map_err(|e| e.to_string())?;

    Ok(path.to_string_lossy().to_string())
}
