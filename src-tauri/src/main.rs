#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Size, LogicalSize};
use serde::Serialize;
use csv::ReaderBuilder;
use calamine::{open_workbook_auto, Reader, Data};

#[derive(Serialize)]
pub struct WhiteItem {
    pub code: String,
    pub name: String,
}

#[tauri::command]
fn import_whitelist(path: String) -> Result<Vec<WhiteItem>, String> {
    let lower = path.to_lowercase();

    if lower.ends_with(".csv") {
        let mut reader = ReaderBuilder::new()
            .has_headers(true)
            .from_path(&path)
            .map_err(|e| e.to_string())?;

        let mut list = vec![];

        for row in reader.records() {
            let r = row.map_err(|e| e.to_string())?;
            list.push(WhiteItem {
                code: r.get(0).unwrap_or("").to_string(),
                name: r.get(1).unwrap_or("").to_string(),
            });
        }
        return Ok(list);
    }

    if lower.ends_with(".xlsx") {
        let mut workbook =
            open_workbook_auto(&path).map_err(|e| e.to_string())?;

        let sheet = workbook
            .sheet_names()
            .get(0)
            .ok_or("找不到工作表")?
            .to_string();

        let range = workbook
            .worksheet_range(&sheet)
            .map_err(|e| e.to_string())?;

        let mut list = vec![];

        for row in range.rows().skip(1) {
            let code = match row.get(0) {
                Some(Data::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "".into(),
            };

            let name = match row.get(1) {
                Some(Data::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "".into(),
            };

            list.push(WhiteItem { code, name });
        }

        return Ok(list);
    }

    Err("不支援的檔案格式".into())
}

#[tauri::command]
fn watch_whitelist(path: String) -> Result<(), String> {
    println!("監控檔案: {}", path);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            import_whitelist,
            watch_whitelist
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            if let Some(monitor) = window.current_monitor()? {
                let size = monitor.size();
                window.set_size(Size::Logical(LogicalSize {
                    width: window.outer_size()?.width as f64,
                    height: size.height as f64,
                }))?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running app");
}
