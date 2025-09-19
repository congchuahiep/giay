use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_pages_table",
            sql: "
            CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY,
            title VARCHAR(255),
            content TEXT NOT NULL,
            page_data BLOB NOT NULL,
            sync_status TEXT NOT NULL DEFAULT 'pending' CHECK(sync_status IN ('pending', 'synced')),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add_emoji_column_to_pages_table",
            sql: "ALTER TABLE pages ADD COLUMN page_icon VARCHAR(1);",
            kind: MigrationKind::Up,
        },
    ]
}
