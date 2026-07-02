use crate::http::http_error::HttpError;
use tauri::http::Method;

/// A tauri state provider for the API client.
pub struct ApiClient {
    base_url: String,
    client: reqwest::Client,
}

impl ApiClient {
    pub fn new(base_url: String) -> Self {
        Self {
            base_url,
            client: reqwest::Client::new(),
        }
    }

    pub fn client(&self) -> &reqwest::Client {
        &self.client
    }

    pub fn base_url(&self) -> &str {
        &self.base_url
    }

    /// Forward request to the server with Bearer token
    pub async fn forward(
        &self,
        method: &Method,
        path: &str,
        body: Option<&[u8]>,
        token: &str,
    ) -> Result<reqwest::Response, HttpError> {
        let url = format!("{}{}", self.base_url, path);

        let mut req = self
            .client
            .request(method.to_owned(), &url)
            .bearer_auth(token)
            .header("Content-Type", "application/json");

        if let Some(b) = body {
            if !b.is_empty() {
                req = req.body(b.to_owned());
            }
        }

        req.send().await.map_err(Into::into)
    }
}
