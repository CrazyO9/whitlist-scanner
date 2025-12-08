// src/window.rs
use tauri::{LogicalSize, Manager, Size};

/// 啟動時調整主視窗大小
pub fn setup_main_window<R: tauri::Runtime>(app: &mut tauri::App<R>) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        if let Some(monitor) = window.current_monitor()? {
            let size = monitor.size();

            // 粗估 taskbar 高度（可以之後再調整成你覺得舒服的值）
            let taskbar_height: f64 = 48.0;

            window.set_size(Size::Logical(LogicalSize {
                width: window.outer_size()?.width as f64,
                height: (size.height as f64 - taskbar_height).max(400.0),
            }))?;
        }
    }

    Ok(())
}
