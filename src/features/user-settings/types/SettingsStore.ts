import type { Store } from "@tauri-apps/plugin-store";
import type { Hotkeys } from "@/core/shortcut";

export type UserSettings = {
	theme: string;
	fontSize: number;
	hotkeys: Record<string, Hotkeys>;
};

export type SettingsKeys = keyof UserSettings;

export type SettingValue = UserSettings[SettingsKeys];

export interface SettingsStore {
	getSettingsDb: () => Promise<Store>;

	init: () => Promise<void>;

	/**
	 * Đăng ký một module để lắng nghe các thay đổi của một cài đặt cụ thể và lấy giá trị hiện tại của nó.
	 * Hàm này bất đồng bộ tải cài đặt từ store, thiết lập một listener để nhận cập nhật theo thời gian thực,
	 * và trả về ngay lập tức giá trị hiện tại của cài đặt đã yêu cầu.
	 *
	 * @template {T = SettingValue} - Kiểu dữ liệu chung (generic type) của giá trị cài đặt.
	 * @param {SettingsKeys} settingName - Khóa duy nhất dùng để định danh cài đặt trong store.
	 * @param {(value: T | undefined) => void} onChange - Một hàm callback sẽ được gọi mỗi khi giá trị của cài đặt thay đổi.
	 * @returns {Promise<T | undefined>} Một Promise trả về giá trị hiện tại của cài đặt, hoặc `undefined` nếu cài đặt không tồn tại.
	 */
	registerSettings: <T = SettingValue>(
		settingName: SettingsKeys,
		onChange: (newestChange: T | undefined) => void,
	) => Promise<T | undefined>;

	/**
	 * Lưu lại các cài đặt vào tệp settings
	 * @returns
	 */
	save: () => Promise<void>;

	/**
	 * Lấy dữ liệu settings mong muốn
	 *
	 * @param
	 * @returns
	 */
	getSettings: <T = SettingValue>(
		settingName: SettingsKeys,
	) => Promise<T | undefined>;

	/**
	 * Cập nhật một cài đặt
	 *
	 * @param key
	 * @param newValue
	 * @returns
	 */
	updateSettings: (
		key: keyof UserSettings,
		newValue: SettingValue,
	) => Promise<void>;

	/**
	 * Cập nhật một phím tắt
	 *
	 * @param hotkey
	 * @returns
	 */
	updateHotkey: (scope: string, key: string, action: string) => Promise<void>;

	/**
	 * Tải lại các cài đặt từ tệp settings
	 *
	 * @returns
	 */
	reload: () => Promise<void>;

	/**
	 * Reset tất cả các cài đặt về mặc định
	 * @returns
	 */
	resetSettings: () => Promise<void>;
}
