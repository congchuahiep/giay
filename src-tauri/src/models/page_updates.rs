use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 3,
        description: "create_page_updates_table",
        sql: "
            CREATE TABLE IF NOT EXISTS page_updates (
            id TEXT PRIMARY KEY,
            title VARCHAR(255),
            content TEXT NOT NULL,
            update_data BLOB NOT NULL,
            sync_status TEXT NOT NULL DEFAULT 'pending' CHECK(sync_status IN ('pending', 'synced')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ",
        kind: MigrationKind::Up,
    }]
}
