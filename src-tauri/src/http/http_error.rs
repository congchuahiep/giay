use tauri::http::StatusCode;

use crate::http::cors;

#[derive(Debug, thiserror::Error)]
pub enum HttpError {
    #[error("Request failed: {0}")]
    Network(String),

    #[error("Authentication required")]
    NotAuthenticated,

    #[error("Server error: {0}")]
    BadResponse(String),

    #[error("Keyring error: {0}")]
    Keyring(String),
}

impl HttpError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            HttpError::NotAuthenticated => StatusCode::UNAUTHORIZED,
            HttpError::BadResponse(_) => StatusCode::BAD_GATEWAY,
            HttpError::Network(_) => StatusCode::BAD_GATEWAY,
            HttpError::Keyring(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn to_json(&self) -> serde_json::Value {
        serde_json::json!({
            "code": match self {
                HttpError::NotAuthenticated => "UNAUTHORIZED",
                HttpError::BadResponse(_) => "BAD_RESPONSE",
                HttpError::Network(_) => "NETWORK_ERROR",
                HttpError::Keyring(_) => "KEYRING_ERROR",
            },
            "message": self.to_string(),
        })
    }

    pub fn to_response(&self) -> tauri::http::Response<Vec<u8>> {
        let body = self.to_json();
        cors::with_cors(
            tauri::http::Response::builder()
                .status(self.status_code())
                .header("Content-Type", "application/json")
                .body(body.to_string().into_bytes())
                .expect("Failed to build error response"),
        )
    }
}

impl From<reqwest::Error> for HttpError {
    fn from(e: reqwest::Error) -> Self {
        HttpError::Network(e.to_string())
    }
}

impl From<crate::auth::error::AuthError> for HttpError {
    fn from(e: crate::auth::error::AuthError) -> Self {
        HttpError::Keyring(e.to_string())
    }
}
