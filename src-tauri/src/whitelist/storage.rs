use crate::whitelist::model::WhiteTable;
use serde_json;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

const UPLOAD_DIR: &str = "upload_file";

/// 統一取得 upload_file 資料夾
fn upload_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join(UPLOAD_DIR);

    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

/// 檔名淨化（只用來當 storage key）
fn sanitize_name(name: &str) -> String {
    let base = Path::new(name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("whitelist");

    base.replace(['\\', '/', ':', '*', '?', '"', '<', '>', '|'], "_")
}

/// 存檔：WhiteTable → JSON，並記錄 last_whitelist
#[tauri::command]
pub async fn save_whitelist(app: AppHandle, table: WhiteTable) -> Result<(), String> {
    let dir = upload_dir(&app)?;
    let key = sanitize_name(&table.file_name);

    let json_path = dir.join(format!("{}.json", key));
    let json = serde_json::to_string_pretty(&table).map_err(|e| e.to_string())?;

    fs::write(&json_path, json).map_err(|e| e.to_string())?;

    // ⭐ 記住最後一次白名單 key
    fs::write(dir.join("last_whitelist.txt"), &key).map_err(|e| e.to_string())?;

    Ok(())
}

/// 依 key 載入指定白名單
#[tauri::command]
pub async fn load_whitelist(app: AppHandle, key: String) -> Result<WhiteTable, String> {
    let dir = upload_dir(&app)?;
    let path = dir.join(format!("{}.json", key));

    if !path.exists() {
        return Err("找不到對應白名單檔案".to_string());
    }

    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let table: WhiteTable = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    Ok(table)
}

/// App 啟動用：自動載入最後一次白名單
#[tauri::command]
pub async fn load_last_whitelist(app: AppHandle) -> Result<WhiteTable, String> {
    let dir = upload_dir(&app)?;
    let last_path = dir.join("last_whitelist.txt");

    if !last_path.exists() {
        return Err("沒有上次白名單".into());
    }

    let key = fs::read_to_string(&last_path)
        .map_err(|e| e.to_string())?
        .trim()
        .to_string();

    load_whitelist(app, key).await
}

/// 清除白名單快取（清空用）
#[tauri::command]
pub async fn clear_last_whitelist(app: AppHandle) -> Result<(), String> {
    let dir = upload_dir(&app)?;
    let last_path = dir.join("last_whitelist.txt");

    if !last_path.exists() {
        return Ok(());
    }

    let key = fs::read_to_string(&last_path)
        .map_err(|e| e.to_string())?
        .trim()
        .to_string();

    // 刪 last 指標
    fs::remove_file(&last_path).map_err(|e| e.to_string())?;

    // 可選：一併刪除 json 快取
    let json_path = dir.join(format!("{}.json", key));
    if json_path.exists() {
        let _ = fs::remove_file(json_path);
    }

    Ok(())
}
