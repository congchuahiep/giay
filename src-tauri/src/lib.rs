mod auth;

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
        .invoke_handler(tauri::generate_handler![
            auth::command::save_tokens,
            auth::command::get_access_token,
            auth::command::get_refresh_token,
            auth::command::clear_tokens,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
