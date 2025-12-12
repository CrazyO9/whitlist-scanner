// src/whitelist/import.rs
use crate::whitelist::model::WhiteTable;
use calamine::{open_workbook_auto, Data, Reader};
use csv::ReaderBuilder;
use std::collections::HashMap;
use std::path::Path;

/// ---- 主入口：根據副檔名分流 ----
#[tauri::command]
pub async fn import_whitelist(path: String) -> Result<WhiteTable, String> {
    let lower = path.to_lowercase();

    let file_name = Path::new(&path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("whitelist")
        .to_string();

    if lower.ends_with(".csv") {
        return import_csv(&path, file_name);
    }

    if lower.ends_with(".xlsx") {
        return import_xlsx(&path, file_name);
    }

    Err("不支援的檔案格式（CSV / XLSX）".to_string())
}

//////////////////////////////////////////////
/// 📌 CSV 處理（完全獨立）
//////////////////////////////////////////////

fn import_csv(path: &str, file_name: String) -> Result<WhiteTable, String> {
    let mut reader = ReaderBuilder::new()
        .has_headers(true)
        .from_path(path)
        .map_err(|e| e.to_string())?;

    let headers = reader
        .headers()
        .map_err(|e| e.to_string())?
        .iter()
        .map(|h| h.to_string())
        .collect::<Vec<_>>();

    let header_order = headers.clone();

    let mut columns: HashMap<String, Vec<String>> =
        headers.iter().map(|h| (h.clone(), vec![])).collect();

    for record in reader.records() {
        let r = record.map_err(|e| e.to_string())?;

        for (idx, value) in r.iter().enumerate() {
            if let Some(header) = headers.get(idx) {
                columns.get_mut(header).unwrap().push(value.to_string());
            }
        }
    }

    Ok(WhiteTable { file_name, columns, header_order })
}

//////////////////////////////////////////////
/// 📌 XLSX 處理（完全獨立）
//////////////////////////////////////////////

fn import_xlsx(path: &str, file_name: String) -> Result<WhiteTable, String> {
    let mut workbook = open_workbook_auto(path).map_err(|e| e.to_string())?;

    // ---- 找第一個工作表 ----
    let sheet = workbook
        .sheet_names()
        .first()
        .cloned()
        .ok_or("找不到工作表".to_string())?;

    let range = workbook
        .worksheet_range(&sheet)
        .map_err(|e| e.to_string())?;

    let mut rows = range.rows();

    // ---- 第一列為標題 ----
    let header_row = rows.next().ok_or("找不到標題列".to_string())?;

    let headers: Vec<String> = header_row
        .iter()
        .map(|cell| match cell {
            Data::String(s) => s.clone(),
            _ => cell.to_string(),
        })
        .collect();

    let header_order = headers.clone();

    // ---- 建立 HashMap 用於存每一欄 ----
    let mut columns: HashMap<String, Vec<String>> =
        headers.iter().map(|h| (h.clone(), vec![])).collect();

    for row in rows {
        for (idx, cell) in row.iter().enumerate() {
            if let Some(header) = headers.get(idx) {
                let value = match cell {
                    Data::String(s) => s.clone(),
                    _ => cell.to_string(),
                };
                columns.get_mut(header).unwrap().push(value);
            }
        }
    }

    Ok(WhiteTable { file_name, columns, header_order })
}
