import Database from "@tauri-apps/plugin-sql";

export const getLocalDatabase = () =>
	Database.load("sqlite:user-local-data.db");
