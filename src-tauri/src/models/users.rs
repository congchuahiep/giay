use tauri_plugin_sql::{Migration, MigrationKind};

/// Client lưu trữ bảng users chủ yếu để cung cấp thông tin
/// các người dùng tồn tại trong workspace (khi offline tất nhiên)
///
/// Thông tin users sẽ được cập nhật mỗi khi ứng dụng được khởi động
pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_users_table",
        sql: "
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username VARCHAR(150) NOT NULL,
            first_name VARCHAR(150) NOT NULL,
            last_name VARCHAR(150) NOT NULL,
            avatar VARCHAR(255) NULL,
            email VARCHAR(254) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ",
        kind: MigrationKind::Up,
    }]
}
