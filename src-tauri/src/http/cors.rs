use tauri::http::{header, HeaderValue, Response, StatusCode};

/// Origin của webview, tùy theo platform:
/// - macOS, Linux: tauri://localhost
/// - Windows: http://tauri.localhost (hoặc https nếu useHttpsScheme)
///
/// WARN: Có thể hardcode nếu không dùng useHttpsScheme.
#[cfg(debug_assertions)]
pub const WEBVIEW_ORIGIN: &str = "http://localhost:5173";

#[cfg(all(not(debug_assertions), target_os = "windows"))]
pub const WEBVIEW_ORIGIN: &str = "http://tauri.localhost";

#[cfg(all(not(debug_assertions), not(target_os = "windows")))]
pub const WEBVIEW_ORIGIN: &str = "tauri://localhost";

/// Build CORS preflight response (204)
pub fn preflight(allowed_methods: &[&str]) -> Response<Vec<u8>> {
    Response::builder()
        .status(StatusCode::NO_CONTENT)
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, WEBVIEW_ORIGIN)
        .header(
            header::ACCESS_CONTROL_ALLOW_METHODS,
            allowed_methods.join(", "),
        )
        .header(
            header::ACCESS_CONTROL_ALLOW_HEADERS,
            "Content-Type, Authorization",
        )
        .header(header::ACCESS_CONTROL_MAX_AGE, "86400")
        .body(Vec::new())
        .expect("Failed to build preflight response")
}

/// Thêm CORS headers vào response để browser chấp nhận
pub fn with_cors(mut response: Response<Vec<u8>>) -> Response<Vec<u8>> {
    response.headers_mut().insert(
        header::ACCESS_CONTROL_ALLOW_ORIGIN,
        HeaderValue::from_static(WEBVIEW_ORIGIN),
    );
    response
}
