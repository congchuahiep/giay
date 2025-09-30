import { use, useEffect } from "react";
import { useSettingsStore } from "@/features/user-settings/stores/useSettingsStore";
import { useShortcutStore } from "../store/useShortcutStore";
import type { ShortcutType } from "@/features/user-settings/types/ShortcutType";
import type { Hotkeys } from "../types/Hotkey";

/**
 * Component này lắng nghe tất cả các phím tắt trong ứng dụng.
 * Nên được đặt ở cấp cao nhất của ứng dụng.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <div>
 *       <ShortcutListener />
 *       <Editor />
 *       { ...Other components }
 *     </div>
 *   );
 * }
 * ```
 */
export function ShortcutListener() {
	const { handleKeyDown, setHotkey } = useShortcutStore();
	const { registerSettings } = useSettingsStore();

	// Đăng ký sự kiện lắng nghe phím tắt
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			handleKeyDown(event);
		};

		document.addEventListener("keydown", listener);
		return () => document.removeEventListener("keydown", listener);
	}, [handleKeyDown]);

	// Nạp phím tắt từ settings
	useEffect(() => {
		(async () => {
			const shortcuts = await registerSettings<Record<ShortcutType, Hotkeys>>(
				"hotkeys",
				// Cập nhật phím tắt khi settings thay đổi
				(newestHotkey) => {
					console.log("Tiến hành cập nhật phím tắt");
					if (!newestHotkey) return;
					setHotkey(newestHotkey);
				},
			);

			if (!shortcuts) return;

			setHotkey(shortcuts);
		})();
	}, [registerSettings, setHotkey]);

	return null; // Component này không hiển thị gì cả
}
