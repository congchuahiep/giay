use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_pages_table",
            sql: "
            CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY,
            parent_page_id TEXT,
            title NVARCHAR(255),
            content TEXT NOT NULL,
            page_data BLOB NOT NULL,
            sync_status VARCHAR(7) NOT NULL DEFAULT 'initial' CHECK(sync_status IN ('initial', 'pending', 'synced')),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_page_id) REFERENCES pages(id)
            );
            ",
            kind: MigrationKind::Up,
        },
    ]
}
