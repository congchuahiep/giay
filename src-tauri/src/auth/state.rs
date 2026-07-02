use std::sync::RwLock;

use keyring::Entry;

use crate::auth::error::AuthError;

/// A tauri state provider for the authentication.
pub struct Auth {
    cache: RwLock<Option<String>>,
    service: &'static str,
}

impl Auth {
    pub fn new() -> Self {
        Self {
            cache: RwLock::new(None),
            service: env!("CARGO_PKG_NAME"),
        }
    }

    /// Read access token: cache first, fallback keyring
    pub fn get_access_token(&self) -> Result<Option<String>, AuthError> {
        {
            let cache = self.cache.read().unwrap();
            if let Some(ref token) = *cache {
                return Ok(Some(token.clone()));
            }
        }

        let token = get_keyring_password(self.service, "access_token")?;
        if let Some(ref t) = token {
            *self.cache.write().unwrap() = Some(t.clone());
        }
        Ok(token)
    }

    /// Read refresh token: cache first, fallback keyring
    pub fn get_refresh_token(&self) -> Result<Option<String>, AuthError> {
        get_keyring_password(self.service, "refresh_token")
    }

    pub fn set_tokens(&self, access_token: &str, refresh_token: &str) -> Result<(), AuthError> {
        Entry::new(self.service, "access_token")?.set_password(access_token)?;
        Entry::new(self.service, "refresh_token")?.set_password(refresh_token)?;
        *self.cache.write().unwrap() = Some(access_token.to_owned());
        Ok(())
    }

    pub fn clear_tokens(&self) -> Result<(), AuthError> {
        *self.cache.write().unwrap() = None;

        clear_one(self.service, "access_token")?;
        clear_one(self.service, "refresh_token")?;

        Ok(())
    }
}

fn get_keyring_password(service: &str, key: &str) -> Result<Option<String>, AuthError> {
    let entry = Entry::new(service, key)?;

    let value = match entry.get_password() {
        Ok(value) => Some(value),
        Err(keyring::Error::NoEntry) => None,
        Err(e) => return Err(e.into()),
    };

    Ok(value)
}

fn clear_one(service: &str, key: &str) -> Result<(), AuthError> {
    match Entry::new(service, key) {
        Ok(entry) => match entry.delete_credential() {
            Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
            Err(e) => Err(e.into()),
        },
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.into()),
    }
}
