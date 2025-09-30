use tauri_plugin_sql::{Migration, MigrationKind};

/// Lưu trữ thông tin về các workspace mà người dùng hiện tại có
pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 2,
        description: "create_workspaces_table",
        sql: "
            CREATE TABLE IF NOT EXISTS workspaces (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            icon TEXT NOT NULL,
            owner INTEGER NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner) REFERENCES users(id)
            );
            ",
        kind: MigrationKind::Up,
    }]
}
