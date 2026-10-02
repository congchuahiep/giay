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
        .post(format!("{}/api/auth/login", api.base_url()))
        .header("Content-Type", "application/json")
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

    let access = body["accessToken"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing accessToken".into()))
        .map_err(bff_err)?;
    let refresh = body["refreshToken"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing refreshToken".into()))
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
            .post(format!("{}/api/auth/logout", api.base_url()))
            .json(&serde_json::json!({ "refreshToken": refresh }))
            .send()
            .await;
    }

    auth.clear_tokens().map_err(bff_err)?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn register(
    api: State<'_, ApiClient>,
    auth: State<'_, Auth>,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    invite_token: Option<String>,
) -> Result<(), serde_json::Value> {
    let res = api
        .client()
        .post(format!("{}/api/auth/register", api.base_url()))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "email": email,
            "password": password,
            "firstName": first_name,
            "lastName": last_name,
            "inviteToken": invite_token
        }))
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

    let access = body["accessToken"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing accessToken".into()))
        .map_err(bff_err)?;
    let refresh = body["refreshToken"]
        .as_str()
        .ok_or(HttpError::BadResponse("Missing refreshToken".into()))
        .map_err(bff_err)?;

    auth.set_tokens(access, refresh).map_err(bff_err)?;

    Ok(())
}

#[tauri::command]
pub async fn check_auth(auth: State<'_, Auth>) -> Result<bool, serde_json::Value> {
    Ok(auth.get_access_token().map_err(bff_err)?.is_some())
}
