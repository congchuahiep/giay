use tauri::Manager;

mod auth;
mod http;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let server_url =
                option_env!("VITE_SERVER_API_URL").expect("Where is your VITE_SERVER_API_URL???");

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            app.manage(http::ApiClient::new(server_url.to_string()));
            app.manage(auth::Auth::new());
            Ok(())
        })
        .register_asynchronous_uri_scheme_protocol("giay-api", http::handle_auth_api)
        .invoke_handler(tauri::generate_handler![
            auth::command::login,
            auth::command::logout,
            auth::command::register,
            auth::command::check_auth,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
