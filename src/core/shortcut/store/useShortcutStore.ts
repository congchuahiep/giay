import _ from "lodash";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ShortcutStore } from "@/core/shortcut";
import getHotkeyFromEvent from "@/core/shortcut/utils/getHotketFromEvent";

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
export const useShortcutStore = create<ShortcutStore>()(
	devtools(
		(set, get) => ({
			// Khởi tạo các state
			extensions: [],
			actions: {},
			hotkeys: {},
			activeScope: "",

			/**
			 * Đăng ký một extension shortcut mới vào hệ thống.
			 * Các extension sẽ được sắp xếp lại theo thứ tự ưu tiên (thật ra cái này không còn quan trọng nữa)
			 *
			 * Công việc chính là thêm actions vào danh sách actions hiện có. Và cung cấp
			 * context cho các action
			 *
			 * Việc đăng ký các phím tắt chưa đăng ký tại đây
			 *
			 * @param extension extension shortcut cần đăng ký
			 */
			registerExtension: (extension) => {
				set((state) => ({
					extensions: [...state.extensions, extension],
					actions: {
						...state.actions,
						[extension.scope]: {
							...state.actions[extension.scope],
							...extension.actions,
						},
					},
				}));
			},

			/**
			 * Hủy đăng ký một extension phím tắt theo tên.
			 * @param name Tên extension cần hủy đăng ký
			 */
			unregisterExtension: (name) =>
				set((state) => ({
					extensions: state.extensions.filter((p) => p.name !== name),
				})),

			/**
			 * Thiết lập scope đang active. Nếu không truyền scope, thì mặc định sẽ là "global"
			 *
			 * @param scope
			 * @returns
			 */
			setActiveShortcutScope: (scope = "global") =>
				set(() => ({ activeScope: scope })),

			/**
			 * Xử lý sự kiện nhấn phím. Tức là xử lý phím tắt đóooo
			 *
			 * @param event Sự kiện bàn phím
			 * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
			 */
			handleKeyDown: (event) => {
				const { activeScope, findActionByKey, actions, getActionContext } =
					get();
				const eventHotkey = getHotkeyFromEvent(event);

				// Thử tìm extension phù hợp trong active scope trước, sau đó đến global scope
				// Nếu tìm thấy, gọi action tương ứng và trả về true
				// Nếu không tìm thấy, trả về false
				// Lưu ý: Có thể mở rộng để kiểm tra nhiều scope khác nhau nếu cần (Cái này đánh dấu cho mai sau nè)
				// Ví dụ: [activeScope, "sidebar", "global"]
				// Trong đó "sidebar" có thể là một scope khác đang active
				// Cách này giúp hỗ trợ nhiều scope hơn thay vì chỉ một active scope
				const scopesToCheck = [activeScope, "global"];

				for (const scope of scopesToCheck) {
					// Tìm các extension phù hợp trong scope hiện tại
					// Tìm action tương ứng với hotkey trong extensions
					const actionName = findActionByKey(scope, eventHotkey);
					console.log("actionName: ", actionName);

					// Không tìm thấy action -> bỏ qua
					if (!actionName) continue;

					const actionContext = getActionContext(actionName);
					console.log("actionContext: ", actionContext);
					const action = actions[scope][actionName];
					console.log("action: ", action);
					return action(event, actionContext);
				}

				return false;
			},

			/**
			 * Lấy danh sách các extension phím tắt đã đăng ký.
			 * @returns Danh sách các extension phím tắt
			 */
			findActionByKey: (scope: string, key: string) => {
				const { hotkeys } = get();
				return hotkeys[scope][key];
			},

			/**
			 * Thiết lập toàn bộ hotkeys. Thường sử dụng khi mới khởi tạo hotkey
			 *
			 * @param hotkeys - Mảng mới của hotkeys
			 */
			setHotkey: (hotkeys) => {
				set({ hotkeys: hotkeys });
			},

			/**
			 * Cập nhật hotkeys cho một extension cụ thể.
			 *
			 * @param extensionName - Tên extension cần cập nhật
			 * @param newHotkeys - Mảng mới của hotkeys
			 */
			updateHotkey: (key: string, action: string, scope: string) => {
				const { hotkeys } = get();

				// Xoá phím tắt cũ
				// TODO: Việc đăng ký phím tắt hiện tại không hỗ trợ đăng ký nhiều phím tắt cho một actions
				const updatedHotkeys = _.chain(hotkeys)
					.get(scope)
					.omitBy((value) => value === action)
					.set(key, action)
					.value();

				console.log(updatedHotkeys);

				set({
					hotkeys: {
						...hotkeys,
						[scope]: updatedHotkeys as Record<string, string>,
					},
				});
			},

			/**
			 * Lấy danh sách các extension phím tắt đã đăng ký.
			 * @returns Danh sách các extension phím tắt
			 */
			getExtensions: () => {
				return get().extensions;
			},

			/**
			 * Lấy danh sách các action phím tắt đã đăng ký.
			 * @returns Danh sách các action
			 */
			getActions: () => {
				return get().actions;
			},

			/**
			 * Lấy danh sách các phím tắt đã đăng ký với hành động.
			 * @returns Danh sách các phím tắt
			 */
			getHotkeys: () => {
				return get().hotkeys;
			},

			/**
			 * Lấy context của một action
			 *
			 * @param actionName
			 * @returns
			 */
			getActionContext: (actionName: string) => {
				const { extensions } = get();
				const extension = extensions.find((ext) => ext.actions[actionName]);
				return extension?.context;
			},

			/**
			 * Lấy danh sách tất cả các action có sẵn từ các extension đã đăng ký.
			 * @returns Mảng các đối tượng chứa `{extension, action}`
			 */
			getAvailableActions: () => {
				const { extensions } = get();
				return extensions.flatMap((extension) =>
					Object.keys(extension.actions).map((action) => ({
						extension: extension.name,
						action,
					})),
				);
			},
		}),
		{
			name: "shortcut-store",
		},
	),
);
