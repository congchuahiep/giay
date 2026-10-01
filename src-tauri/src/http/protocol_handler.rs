use tauri::http::{Method, Request, Response, StatusCode};
use tauri::{Manager, UriSchemeContext, UriSchemeResponder};

use crate::auth::Auth;
use crate::http::HttpError;
use crate::http::{cors, state::ApiClient};

pub fn handle_auth_api<R: tauri::Runtime>(
    ctx: UriSchemeContext<'_, R>,
    request: Request<Vec<u8>>,
    responder: UriSchemeResponder,
) {
    let app = ctx.app_handle().clone();

    let path = request
        .uri()
        .path_and_query()
        .map(|s| s.to_string())
        .unwrap_or_else(|| request.uri().path().to_string());
    let method = request.method().clone();
    let body = request.body().clone();

    tauri::async_runtime::spawn(async move {
        let api = match app.try_state::<ApiClient>() {
            Some(s) => s,
            None => {
                return respond_error(responder, "ApiClient not initialized");
            }
        };

        let auth = match app.try_state::<Auth>() {
            Some(s) => s,
            None => {
                return respond_error(responder, "Auth not initialized");
            }
        };

        let response = if method == Method::OPTIONS {
            cors::preflight(&["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
        } else {
            forward_with_retry(api.inner(), auth.inner(), &method, &path, Some(&body)).await
        };

        responder.respond(response);
    });
}

pub async fn forward_with_retry(
    api: &ApiClient,
    auth: &Auth,
    method: &Method,
    path: &str,
    body: Option<&[u8]>,
) -> Response<Vec<u8>> {
    let token = match auth.get_access_token() {
        Ok(Some(t)) => t,
        _ => return HttpError::NotAuthenticated.to_response(),
    };

    let res = match api.forward(method, path, body, &token).await {
        Ok(r) => r,
        Err(e) => return e.to_response(),
    };

    if res.status() == StatusCode::UNAUTHORIZED {
        match try_refresh(api, auth).await {
            Ok(Some(new_token)) => {
                let retry = api.forward(method, path, body, &new_token).await;
                return match retry {
                    Ok(r) => pass_through(r).await,
                    Err(e) => e.to_response(),
                };
            }
            _ => return HttpError::NotAuthenticated.to_response(),
        }
    }

    pass_through(res).await
}

pub async fn try_refresh(api: &ApiClient, auth: &Auth) -> Result<Option<String>, HttpError> {
    let refresh = auth
        .get_refresh_token()?
        .ok_or(HttpError::NotAuthenticated)?;

    let resp = api
        .client()
        .post(format!("{}/auth/refresh-token", api.base_url()))
        .json(&serde_json::json!({ "refreshToken": refresh }))
        .send()
        .await?;

    if !resp.status().is_success() {
        let _ = auth.clear_tokens();
        return Ok(None);
    }

    let body: serde_json::Value = resp.json().await?;
    let new_access = body["accessToken"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing accessToken".into()))?;
    let new_refresh = body["refreshToken"].as_str().unwrap_or(&refresh);

    auth.set_tokens(new_access, new_refresh)?;

    Ok(Some(new_access.to_string()))
}

async fn pass_through(resp: reqwest::Response) -> Response<Vec<u8>> {
    let status = StatusCode::from_u16(resp.status().as_u16()).unwrap_or(StatusCode::OK);
    let body = resp.bytes().await.unwrap_or_default();
    cors::with_cors(
        Response::builder()
            .status(status)
            .header("Content-Type", "application/json")
            .body(body.to_vec())
            .unwrap(),
    )
}

fn respond_error(responder: UriSchemeResponder, msg: &str) {
    responder.respond(
        tauri::http::Response::builder()
            .status(500)
            .body(msg.as_bytes().to_vec())
            .unwrap(),
    );
}
