import { useEffect } from "react";
import { useSetting } from "@/features/user-settings";
import { type Hotkeys, type ShortcutType, useShortcut } from "..";

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
export default function ShortcutListener() {
	const { handleKeyDown, setHotkey } = useShortcut();
	const { registerSetting } = useSetting();

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
			const shortcuts = await registerSetting<Record<ShortcutType, Hotkeys>>(
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
	}, [registerSetting, setHotkey]);

	return null; // Component này không hiển thị gì cả
}
