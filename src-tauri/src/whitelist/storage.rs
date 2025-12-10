// src/whitelist/storage.rs
use crate::whitelist::model::WhiteTable;
use serde_json;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::AppHandle;

const UPLOAD_DIR: &str = "upload_file";

fn upload_file_path(_app: &AppHandle, file_name: &str) -> Result<PathBuf, String> {
    // 以執行檔所在目錄為基準
    let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;
    let exe_dir = exe_path
        .parent()
        .ok_or_else(|| "找不到程式所在目錄".to_string())?;

    let dir = exe_dir.join(UPLOAD_DIR);
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }

    Ok(dir.join(format!("{}.json", file_name)))
}

/// 存檔：把 WhiteTable → JSON 寫進 upload_file 資料夾
#[tauri::command]
pub async fn save_whitelist(app: AppHandle, table: WhiteTable) -> Result<(), String> {
    let path = upload_file_path(&app, &table.file_name)?;

    // 組成你要的 JSON 結構：{ "<file_name>": { header: [values...] } }
    let mut root: HashMap<String, HashMap<String, Vec<String>>> = HashMap::new();
    root.insert(table.file_name.clone(), table.columns.clone());

    let json = serde_json::to_string_pretty(&root).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())
}

/// 讀檔：從 upload_file/<file_name>.json 讀回 WhiteTable
#[tauri::command]
pub async fn load_whitelist(app: AppHandle, file_name: String) -> Result<WhiteTable, String> {
    let path = upload_file_path(&app, &file_name)?;

    if !Path::new(&path).exists() {
        return Err("找不到對應檔案，請先匯入白名單".to_string());
    }

    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let root: HashMap<String, HashMap<String, Vec<String>>> =
        serde_json::from_str(&content).map_err(|e| e.to_string())?;

    let columns = root
        .get(&file_name)
        .cloned()
        .ok_or_else(|| "JSON 裡找不到對應檔名的資料".to_string())?;

    Ok(WhiteTable { file_name, columns })
}
