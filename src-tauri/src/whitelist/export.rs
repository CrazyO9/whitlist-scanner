// src/whitelist/export.rs
use crate::whitelist::model::WhiteTable;
use csv::WriterBuilder;
use std::fs::File;

/// 把記憶體中的 WhiteTable 匯出成 CSV
/// - path: 儲存目的地（使用者在 dialog.save 選的路徑）
/// - table: 目前的白名單資料
#[tauri::command]
pub async fn export_whitelist(path: String, table: WhiteTable) -> Result<(), String> {
    let file = File::create(&path).map_err(|e| e.to_string())?;
    let mut writer = WriterBuilder::new().from_writer(file);

    // 固定欄位順序：依照插入順序會不穩定，所以先收集 header
    let mut headers: Vec<String> = table.columns.keys().cloned().collect();
    headers.sort(); // 也可以改成你想要的自訂順序

    // 寫標題列
    writer
        .write_record(headers.iter())
        .map_err(|e| e.to_string())?;

    // 找出最多列數
    let max_len = table
        .columns
        .values()
        .map(|v| v.len())
        .max()
        .unwrap_or(0);

    // 逐列寫出
    for row_idx in 0..max_len {
        let mut row = Vec::new();
        for header in &headers {
            let col = table.columns.get(header);
            let value = col
                .and_then(|v| v.get(row_idx))
                .cloned()
                .unwrap_or_default();
            row.push(value);
        }
        writer.write_record(&row).map_err(|e| e.to_string())?;
    }

    writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}
