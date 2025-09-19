import { Store } from "@tauri-apps/plugin-store";
import _ from "lodash";
import { create } from "zustand";
import type { Hotkeys } from "@/core/shortcut";
import type {
	SettingsKeys,
	SettingsStore,
	SettingValue,
	UserSettings,
} from "@/features/user-settings/types/SettingsStore";
import { defaultShortcutSettings } from "../default-settings/defaultShortcutSettings";
import { isTauri } from "@tauri-apps/api/core";

// // Tạo store riêng cho settings
// const settingsDB = await Store.load("settings.json");
// settingsDB.save();

// export const settingsStorageHandler: StateStorage = {
//   getItem: async (name: string) => {
//   },
//   // biome-ignore lint/suspicious/noExplicitAny: settingsDB values can be any type
//   setItem: async (name: string, value: any) => {
//     await settingsDB.set(name, value);
//   },
//   removeItem: async (name: string) => {
//     await settingsDB.delete(name);
//   },
// };
// biome-ignore lint/correctness/noUnusedFunctionParameters: set không dùng
export const useSettingsStore = create<SettingsStore>()((set, get) => ({
	getSettingsDb: async () =>
		await Store.load("settings.json", {
			defaults: {
				theme: "system",
				fontSize: 16,
				hotkeys: defaultShortcutSettings,
			},
			autoSave: true,
		}),

	init: async () => {
		if (!isTauri()) return;

		try {
			const settingsDB = await get().getSettingsDb();
			await settingsDB.save();
		} catch (error) {
			console.error("Failed to initialize settings:", error);
		}
	},

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
	registerSettings: async <T = SettingValue>(
		settingName: SettingsKeys,
		onChange: (newestChange: T | undefined) => void,
	): Promise<T | undefined> => {
		const settingDb = await get().getSettingsDb();
		settingDb.onKeyChange<T>(settingName, onChange);

		return settingDb.get<T>(settingName);
	},

	save: async () => {
		const settingsDb = await get().getSettingsDb();
		await settingsDb.save();
	},

	//==================GETTER==========================
	getSettings: async <T = SettingValue>(settingName: SettingsKeys) => {
		const settingDb = await get().getSettingsDb();
		return settingDb.get<T>(settingName);
	},

	//==================UPDATE==========================
	updateSettings: async (key: keyof UserSettings, newValue) => {
		const settingsDb = await get().getSettingsDb();
		await settingsDb.set(key, newValue);

		// Tự động lưu khi cài đặt thay đổi
		await settingsDb.save();
	},

	// TODO: Việc đăng ký phím tắt hiện tại không hỗ trợ đăng ký nhiều phím tắt cho một actions
	updateHotkey: async (scope, key, action) => {
		const { getSettings, updateSettings } = get();
		const hotkeys = await getSettings<Record<string, Hotkeys>>("hotkeys");

		const updatedTargetScopeHotkey = _.chain(hotkeys)
			.get(scope)
			.omitBy((value) => value === action) // Xoá phím tắt cũ của action hiện tại
			.set(key, action)
			.value();

		console.log(updatedTargetScopeHotkey);

		updateSettings("hotkeys", {
			...hotkeys,
			[scope]: updatedTargetScopeHotkey as Record<string, string>,
		});
	},

	//==================RESET==========================

	resetSettings: async () => {
		const { getSettingsDb } = get();
		const settingsDb = await getSettingsDb();
		await settingsDb.reset();
	},
}));
