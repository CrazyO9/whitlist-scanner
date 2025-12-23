// whitelist-scanner\src-tauri\src\main.rs
mod window;
pub mod whitelist;

use whitelist::{
    import_whitelist,
    export_whitelist_csv,
    export_whitelist_xlsx,
    export_scan_history_csv,
    export_scan_history_xlsx,
    save_whitelist, 
    load_whitelist,
    reveal_in_folder,
    load_last_whitelist
};
// use tauri::Manager;

fn main() {
    tauri::Builder::default()
        // 把所有給前端 invoke 的 command 掛進來
        .invoke_handler(tauri::generate_handler![
            // import
            import_whitelist,

            // export whitelist
            export_whitelist_csv,
            export_whitelist_xlsx,

            // export history
            export_scan_history_csv,
            export_scan_history_xlsx,

            // storage
            save_whitelist,
            load_whitelist,
            load_last_whitelist,

            // utils
            reveal_in_folder,
        ])
        // Tauri v2 plugin 初始化（你現在用到的）
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        // 視窗大小調整等「啟動時」邏輯丟到 window 模組
        .setup(|app| {
            window::setup_main_window(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running app");
}
