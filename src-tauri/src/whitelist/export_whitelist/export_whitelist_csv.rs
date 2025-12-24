// whitelist-scanner\src-tauri\src\whitelist\export_whitelist.rs
use crate::whitelist::model::WhiteTable;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// 匯出白名單（CSV）
/// - 依 header_order 決定欄位順序
/// - columns 為 column-oriented，需轉為 row-oriented
#[tauri::command]
pub async fn export_whitelist_csv(app: AppHandle, table: WhiteTable) -> Result<String, String> {
    if table.header_order.is_empty() {
        return Err("白名單沒有欄位可匯出".to_string());
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

    // 3. 檔名
    let filename = format!(
        "{}_{}.csv",
        table.file_name,
        chrono::Local::now().format("%Y%m%d%H%M%S")
    );

    let path: PathBuf = export_dir.join(&filename);

    // 4. CSV Header（依 header_order）
    let mut csv = String::from("\u{FEFF}");
    csv.push_str(
        &table.header_order
            .iter()
            .map(|h| escape_csv(h))
            .collect::<Vec<_>>()
            .join(",")
    );
    csv.push('\n');

    // 5. 計算列數（最安全：取最短欄位）
    let num_rows = table.header_order
        .iter()
        .map(|h|
            table.columns
                .get(h)
                .map(|c| c.len())
                .unwrap_or(0)
        )
        .min()
        .unwrap_or(0);

    // 6. 組 rows
    for row_idx in 0..num_rows {
        let row = table.header_order
            .iter()
            .map(|h| {
                table.columns
                    .get(h)
                    .and_then(|col| col.get(row_idx))
                    .map(|v| escape_csv(v))
                    .unwrap_or_else(|| "\"\"".to_string())
            })
            .collect::<Vec<_>>()
            .join(",");

        csv.push_str(&row);
        csv.push('\n');
    }

    // 7. 寫檔
    fs::write(&path, csv).map_err(|e| e.to_string())?;

    Ok(path.to_string_lossy().to_string())
}

/// CSV 轉義（雙引號 + 內部雙引號 escape）
fn escape_csv(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}
