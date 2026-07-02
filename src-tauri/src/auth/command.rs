use tauri::State;

use crate::{
    auth::Auth,
    http::{ApiClient, HttpError},
};

fn bff_err<E: Into<HttpError>>(e: E) -> serde_json::Value {
    e.into().to_json()
}

#[tauri::command]
pub async fn login(
    api: State<'_, ApiClient>,
    auth: State<'_, Auth>,
    email: String,
    password: String,
) -> Result<(), serde_json::Value> {
    let res = api
        .client()
        .post(format!("{}/auth/login", api.base_url()))
        .json(&serde_json::json!({ "email": email, "password": password }))
        .send()
        .await
        .map_err(bff_err)?;

    if !res.status().is_success() {
        let status = res.status();
        let body: serde_json::Value = res.json().await.unwrap_or(serde_json::json!({
            "code": "UNKNOWN_SERVER_ERROR",
            "message": format!("Server returned {status}"),
        }));
        return Err(body);
    }

    let body: serde_json::Value = res.json().await.map_err(bff_err)?;

    let access = body["access_token"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing access_token".into()))
        .map_err(bff_err)?;
    let refresh = body["refresh_token"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing refresh_token".into()))
        .map_err(bff_err)?;

    auth.set_tokens(access, refresh).map_err(bff_err)?;

    Ok(())
}

#[tauri::command]
pub async fn logout(
    api: State<'_, ApiClient>,
    auth: State<'_, Auth>,
) -> Result<(), serde_json::Value> {
    if let Ok(Some(refresh)) = auth.get_refresh_token() {
        let _ = api
            .client()
            .post(format!("{}/auth/logout", api.base_url()))
            .json(&serde_json::json!({ "refresh_token": refresh }))
            .send()
            .await;
    }

    auth.clear_tokens().map_err(bff_err)?;

    Ok(())
}

#[tauri::command]
pub async fn check_auth(auth: State<'_, Auth>) -> Result<bool, serde_json::Value> {
    Ok(auth.get_access_token().map_err(bff_err)?.is_some())
}
