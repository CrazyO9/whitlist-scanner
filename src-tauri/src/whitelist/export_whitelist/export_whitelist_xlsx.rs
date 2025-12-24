// whitelist-scanner/src-tauri/src/whitelist/export_whitelist/export_whitelist_xlsx.rs
use std::fs;
use std::path::PathBuf;

use chrono::Local;
use tauri::{AppHandle, Manager};
use rust_xlsxwriter::{Workbook, Format};

use crate::whitelist::model::WhiteTable;

#[tauri::command]
pub async fn export_whitelist_xlsx(
    app: AppHandle,
    table: WhiteTable,
) -> Result<String, String> {
    let columns = &table.columns;
    let headers = &table.header_order;

    if headers.is_empty() {
        return Err("白名單沒有可匯出的欄位".to_string());
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
        "{}_{}.xlsx",
        table.file_name,
        Local::now().format("%Y%m%d%H%M%S")
    );

    let path: PathBuf = export_dir.join(filename);

    /* --------------------------------
     * Excel
     * -------------------------------- */
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    let text_format = Format::new().set_num_format("@");

    // Header
    for (col_idx, h) in headers.iter().enumerate() {
        worksheet
            .write_string(0, col_idx as u16, h)
            .map_err(|e| e.to_string())?;
    }

    // Rows
    let num_rows = headers
        .iter()
        .filter_map(|h| columns.get(h).map(|v| v.len()))
        .min()
        .unwrap_or(0);

    for row_idx in 0..num_rows {
        let excel_row = (row_idx + 1) as u32;

        for (col_idx, h) in headers.iter().enumerate() {
            let value = columns
                .get(h)
                .and_then(|v| v.get(row_idx))
                .map(|v| v.to_string())
                .unwrap_or_default();

            // ⭐ 一律當文字，避免 Excel 誤判
            worksheet
                .write_with_format(
                    excel_row,
                    col_idx as u16,
                    &value,
                    &text_format,
                )
                .map_err(|e| e.to_string())?;
        }
    }

    workbook.save(&path).map_err(|e| e.to_string())?;

    Ok(path.to_string_lossy().to_string())
}
