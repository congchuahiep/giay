use tauri_plugin_sql::{Migration, MigrationKind};

/// Lưu trữ thông tin về các workspace mà người dùng hiện tại có
pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 3,
        description: "create_workspace_user_table",
        sql: "
            CREATE TABLE IF NOT EXISTS workspace_user (
            workspace_id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(id),
            FOREIGN KEY (user_id) REFERENCES user(id)
            );
            ",
        kind: MigrationKind::Up,
    }]
}
