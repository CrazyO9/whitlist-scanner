#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
use tauri::command;
use calamine::{open_workbook, Reader, Xlsx};
use csv::ReaderBuilder;
use serde::Serialize;
use std::fs::File;
use std::io::Read;

#[derive(Serialize)]
pub struct WhiteItem {
    code: String,
    name: String,
}

#[command]
pub fn import_whitelist(path: String) -> Result<Vec<WhiteItem>, String> {
    let lower = path.to_lowercase();

    if lower.ends_with(".csv") {
        let mut rdr = ReaderBuilder::new()
            .has_headers(true)
            .from_path(path)
            .map_err(|e| e.to_string())?;

        let mut list = vec![];
        for result in rdr.records() {
            let record = result.map_err(|e| e.to_string())?;
            let code = record.get(0).unwrap_or("").to_string();
            let name = record.get(1).unwrap_or("").to_string();
            list.push(WhiteItem { code, name });
        }
        return Ok(list);
    }

    if lower.ends_with(".xlsx") {
        let mut workbook: Xlsx<_> =
            open_workbook(path.clone()).map_err(|e| e.to_string())?;

        let range = workbook
            .worksheet_range("Sheet1")
            .ok_or("Excel 中找不到 Sheet1")?
            .map_err(|e| e.to_string())?;

        let mut list = vec![];

        for row in range.rows().skip(1) {
            let code = row.get(0).unwrap_or(&calamine::DataType::Empty).to_string();
            let name = row.get(1).unwrap_or(&calamine::DataType::Empty).to_string();
            list.push(WhiteItem { code, name });
        }

        return Ok(list);
    }

    Err("只支援 CSV 或 Excel".into())
}

#[command]
pub fn export_whitelist(path: String, items: Vec<WhiteItem>) -> Result<(), String> {
    let mut wtr = csv::Writer::from_path(path).map_err(|e| e.to_string())?;
    wtr.write_record(&["code", "name"]).map_err(|e| e.to_string())?;

    for item in items {
        wtr.write_record(&[item.code, item.name])
            .map_err(|e| e.to_string())?;
    }
    wtr.flush().map_err(|e| e.to_string())?;

    Ok(())
}

use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use std::sync::{Arc, Mutex};
use tauri::Emitter;

#[command]
pub fn watch_whitelist(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let handler = move |res: notify::Result<notify::Event>| {
        if let Ok(_event) = res {
            let _ = app_handle.emit("whitelist-file-changed", ());
        }
    };

    let mut watcher =
        RecommendedWatcher::new(handler, notify::Config::default()).unwrap();

    watcher
        .watch(std::path::Path::new(&path), RecursiveMode::NonRecursive)
        .map_err(|e| e.to_string())?;

    Ok(())
}