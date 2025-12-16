use std::path::Path;
use tauri::command;

#[command]
pub fn reveal_in_folder(path: String) -> Result<(), String> {
    let p = Path::new(&path);

    if !p.exists() {
        return Err("檔案不存在".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .args(["-R", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(
                p.parent()
                    .ok_or("找不到父資料夾")?
            )
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
