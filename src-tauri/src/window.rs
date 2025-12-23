// whitelist-scanner\src-tauri\src\window.rs
use tauri::{LogicalSize, Manager, Size};

pub fn setup_main_window<R: tauri::Runtime>(
    app: &mut tauri::App<R>,
) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        if let Some(monitor) = window.current_monitor()? {
            let monitor_size = monitor.size();

            let taskbar_height: f64 = 70.0;
            let min_height = 400.0;

            let width = 1024.0;
            let height = (monitor_size.height as f64 - taskbar_height)
                .max(min_height);

            window.set_size(Size::Logical(LogicalSize { width, height }))?;
        }
    }

    Ok(())
}
