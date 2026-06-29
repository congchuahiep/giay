use keyring::Entry;

use crate::auth::error::AuthError;

const SERVICE: &str = env!("CARGO_PKG_NAME");

#[tauri::command]
pub fn save_tokens(access_token: String, refresh_token: String) -> Result<(), AuthError> {
    Entry::new(SERVICE, "access_token")?.set_password(&access_token)?;
    Entry::new(SERVICE, "refresh_token")?.set_password(&refresh_token)?;
    Ok(())
}

#[tauri::command]
pub fn get_access_token() -> Result<Option<String>, AuthError> {
    let entry = Entry::new(SERVICE, "access_token")?;
    match entry.get_password() {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.into()),
    }
}

#[tauri::command]
pub fn get_refresh_token() -> Result<Option<String>, AuthError> {
    let entry = Entry::new(SERVICE, "refresh_token")?;
    match entry.get_password() {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.into()),
    }
}

#[tauri::command]
pub fn clear_tokens() -> Result<(), AuthError> {
    clear_one(SERVICE, "access_token")?;
    clear_one(SERVICE, "refresh_token")?;
    Ok(())
}

fn clear_one(service: &str, user: &str) -> Result<(), AuthError> {
    match Entry::new(service, user) {
        Ok(entry) => match entry.delete_credential() {
            Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
            Err(e) => Err(e.into()),
        },
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.into()),
    }
}
