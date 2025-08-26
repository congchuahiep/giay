import Database from "@tauri-apps/plugin-sql";
import * as Y from "yjs";

/**
 * Mặc định tauri sẽ lưu nó tại AppConfig
 */
let db: Database | null = null;

/**
 * Khởi tạo kết nối với SQLite database
 */
export async function initializeDatabase() {
  if (!db) {
    db = await Database.load("sqlite:pages.db");

    // Tạo bảng nếu chưa tồn tại
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        page_data BLOB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}

/**
 * Lưu Y.Doc vào SQLite
 */
export async function saveDocumentToSQLite(
  docId: string,
  ydoc: Y.Doc
): Promise<void> {
  const db = await initializeDatabase();

  // Encode Y.Doc thành binary update để lưu trữ hiệu quả
  const encodedState = Y.encodeStateAsUpdate(ydoc);

  // Lưu vào database, thay thế nếu đã tồn tại
  await db.execute(
    "INSERT OR REPLACE INTO pages (id, page_data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)",
    [docId, encodedState]
  );
}

/**
 * Nạp dữ liệu Y.Doc từ SQLite
 */
export async function loadDocumentFromSQLite(
  docId: string
): Promise<Y.Doc | null> {
  try {
    const db = await initializeDatabase();

    // Truy vấn document từ database
    const result = await db.select<{ page_data: Uint8Array }[]>(
      "SELECT page_data FROM pages WHERE id = $1",
      [docId]
    );

    if (result && result.length > 0) {
      const ydoc = new Y.Doc();
      let bytes: Uint8Array;
      const raw = result[0].page_data;

      if (typeof raw === "string") {
        // Nếu là chuỗi JSON
        bytes = new Uint8Array(JSON.parse(raw));
      } else if (Array.isArray(raw)) {
        // Nếu là mảng số
        bytes = new Uint8Array(raw);
      } else if (raw instanceof Uint8Array) {
        bytes = raw;
      } else {
        throw new Error("Unknown type for page_data");
      }

      Y.applyUpdate(ydoc, bytes);
      return ydoc;
    }

    return null;
  } catch (error) {
    console.error("Error loading document from SQLite:", error);
    return null;
  }
}
