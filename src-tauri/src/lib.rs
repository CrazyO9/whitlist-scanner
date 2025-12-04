// use serde::Serialize;
// use csv::ReaderBuilder;
// use calamine::{open_workbook_auto, Reader, Data};

// #[derive(Serialize)]
// pub struct WhiteItem {
//     pub code: String,
//     pub name: String,
// }

// #[tauri::command]
// pub fn import_whitelist(path: String) -> Result<Vec<WhiteItem>, String> {
//     let lower = path.to_lowercase();

//     // ===== CSV =====
//     if lower.ends_with(".csv") {
//         let mut reader = ReaderBuilder::new()
//             .has_headers(true)
//             .from_path(&path)
//             .map_err(|e| e.to_string())?;

//         let mut list = vec![];

//         for row in reader.records() {
//             let r = row.map_err(|e| e.to_string())?;
//             list.push(WhiteItem {
//                 code: r.get(0).unwrap_or("").to_string(),
//                 name: r.get(1).unwrap_or("").to_string(),
//             });
//         }
//         return Ok(list);
//     }

//     // ===== XLSX =====
//     if lower.ends_with(".xlsx") {
//         let mut workbook = open_workbook_auto(&path)
//             .map_err(|e| e.to_string())?;

//         // 使用第一個工作表
//         let sheet = workbook
//             .sheet_names()
//             .get(0)
//             .ok_or("找不到工作表")?
//             .to_string();

//         // calamine v0.24: worksheet_range 回傳 Result<Range<Data>>
//         let range = workbook
//             .worksheet_range(&sheet)
//             .map_err(|e| e.to_string())?;

//         let mut list = vec![];

//         for row in range.rows().skip(1) {
//             // calamine v0.24: DataType 改名為 Data
//             let code = match row.get(0) {
//                 Some(Data::String(s)) => s.clone(),
//                 Some(v) => v.to_string(),
//                 None => "".into(),
//             };

//             let name = match row.get(1) {
//                 Some(Data::String(s)) => s.clone(),
//                 Some(v) => v.to_string(),
//                 None => "".into(),
//             };

//             list.push(WhiteItem { code, name });
//         }

//         return Ok(list);
//     }

//     Err("不支援的檔案格式（僅支援 CSV/XLSX）".into())
// }

// #[tauri::command]
// pub fn watch_whitelist(path: String) -> Result<(), String> {
//     println!("監控檔案: {}", path);
//     Ok(())
// }
