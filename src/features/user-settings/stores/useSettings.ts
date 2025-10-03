import { isTauri } from "@tauri-apps/api/core";
import { Store } from "@tauri-apps/plugin-store";
import _ from "lodash";
import { create } from "zustand";
import type { Hotkeys } from "@/features/shortcut";
import { defaultShortcutSettings } from "../default-settings/defaultShortcutSettings";
import type {
	SettingAction,
	SettingKey,
	SettingValue,
	UserSetting,
} from "../types";

// biome-ignore lint/correctness/noUnusedFunctionParameters: set không dùng
const useSetting = create<SettingAction>()((set, get) => ({
	getSettingDb: async () =>
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
			const settingsDB = await get().getSettingDb();
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
	 * @param {SettingKeys} settingName - Khóa duy nhất dùng để định danh cài đặt trong store.
	 * @param {(value: T | undefined) => void} onChange - Một hàm callback sẽ được gọi mỗi khi giá trị của cài đặt thay đổi.
	 * @returns {Promise<T | undefined>} Một Promise trả về giá trị hiện tại của cài đặt, hoặc `undefined` nếu cài đặt không tồn tại.
	 */
	registerSetting: async <T = SettingValue>(
		settingName: SettingKey,
		onChange: (newestChange: T | undefined) => void,
	): Promise<T | undefined> => {
		const settingDb = await get().getSettingDb();
		settingDb.onKeyChange<T>(settingName, onChange);

		return settingDb.get<T>(settingName);
	},

	save: async () => {
		const settingsDb = await get().getSettingDb();
		await settingsDb.save();
	},

	//==================GETTER==========================
	getSetting: async <T = SettingValue>(settingName: SettingKey) => {
		const settingDb = await get().getSettingDb();
		return settingDb.get<T>(settingName);
	},

	//==================UPDATE==========================
	updateSetting: async (key: keyof UserSetting, newValue) => {
		const settingsDb = await get().getSettingDb();
		await settingsDb.set(key, newValue);

		// Tự động lưu khi cài đặt thay đổi
		await settingsDb.save();
	},

	// TODO: Việc đăng ký phím tắt hiện tại không hỗ trợ đăng ký nhiều phím tắt cho một actions
	updateHotkey: async (scope, key, action) => {
		const { getSetting: getSettings, updateSetting: updateSettings } = get();
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

	reload: async () => {
		const { getSettingDb: getSettingsDb } = get();
		const settingsDb = await getSettingsDb();
		await settingsDb.reload();
	},

	//==================RESET==========================

	resetSetting: async () => {
		const { getSettingDb: getSettingsDb } = get();
		const settingsDb = await getSettingsDb();
		await settingsDb.reset();
	},
}));

export default useSetting;
