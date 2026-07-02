use keyring::Error as KeyringError;

#[derive(Debug, thiserror::Error)]
pub enum AuthError {
    #[error("Không thể truy cập keyring của hệ thống")]
    KeyringAccess,

    #[error("{0}")]
    Keyring(String),
}

impl From<KeyringError> for AuthError {
    fn from(e: KeyringError) -> Self {
        match e {
            KeyringError::NoStorageAccess(_) => AuthError::KeyringAccess,
            other => AuthError::Keyring(other.to_string()),
        }
    }
}
