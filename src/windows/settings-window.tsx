import { isTauri } from "@tauri-apps/api/core";
import { SettingPanel } from "@/features/user-settings";

export default function SettingsWindow() {
	if (isTauri()) {
		// Tauri: render full page (cửa sổ riêng)
		return <SettingPanel />;
	}
	// Web: render dialog/modal
	return <SettingPanel />;
}
