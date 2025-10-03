// biome-ignore-all lint/suspicious/noExplicitAny: Context có thể là bất kỳ loại dữ liệu nào
import type {
	Hotkeys,
	ShortcutAction,
	ShortcutExtension,
	ShortcutType,
} from "../types";

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
export default interface ShortcutStore {
	/**
	 * Các extension phím tắt đã được đăng ký
	 *
	 * Chủ yếu là để lưu trữ context của các extension
	 */
	extensions: ShortcutExtension[];

	/**
	 * Các action phím tắt đã được đăng ký
	 *
	 * Có cấu trúc "<scope> : {<actionName>: (event: KeyboardEvent, context: any) => boolean | void}"
	 *
	 * @example
	 * {
	 *   "editor": {
	 *     "undo": (event, context) => {
	 *       context.editor.undo();
	 *       return true;
	 *     },
	 *     "redo": (event, context) => {
	 *       context.editor.redo();
	 *       return true;
	 *     }
	 *   },
	 *   "global": {
	 *     "openSettings": (event, context) => {
	 *       context.gl.openSettings();
	 *       return true;
	 *     }
	 *   }
	 * }
	 */
	actions: Record<string, Record<string, ShortcutAction>>;

	/**
	 * Các phím tắt đã được đăng ký
	 *
	 * Có cấu trúc "<scope> : {<key> : <actionName>}"
	 *
	 * @example
	 * {
	 *   "editor": {
	 *     "mod+z": "editor.undo",
	 *     "mod+y": "editor.redo"
	 *   },
	 *   "global": {
	 *     "mod+,": "gl.openSettings",
	 *     "mod+o": "gl.openFile"
	 *   },
	 * }
	 */
	hotkeys: Record<string, Hotkeys>;

	/**
	 * Scope hiện đang active, ví dụ "editor", "sidebar", "global". Ở một thời điểm
	 * chỉ có một scope được active.
	 */
	activeScope: string;

	/**
	 * Đăng ký một extension shortcut mới vào hệ thống.
	 * Các extension sẽ được sắp xếp lại theo thứ tự ưu tiên (thật ra cái này không còn quan trọng nữa)
	 *
	 * Công việc chính là thêm actions vào danh sách actions hiện có. Và cung cấp
	 * context cho các action
	 *
	 * "Việc đăng ký các phím tắt chưa đăng ký tại đây"
	 *
	 * "Không khuyến khích tự đăng ký extension, hãy đăng ký bằng hook `useRegisterShortcut`"
	 * @param extension extension shortcut cần đăng ký
	 */
	registerExtension: (extension: ShortcutExtension<any>) => void;

	/**
	 * Hủy đăng ký một extension phím tắt theo tên.
	 * @param name Tên extension cần hủy đăng ký
	 */
	unregisterExtension: (name: string) => void;

	/**
	 * Thiết lập scope đang active. Nếu không truyền scope, thì mặc định sẽ là "global"
	 *
	 * @param scope
	 * @returns
	 */
	setActiveShortcutScope: (scope?: string) => void;

	/**
	 * Xử lý sự kiện nhấn phím. Tức là xử lý phím tắt đóooo
	 *
	 * @param event Sự kiện bàn phím
	 * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
	 */
	handleKeyDown: (event: KeyboardEvent) => boolean;

	/**
	 * Tìm kiếm action tương ứng với một key và extension.
	 *
	 * @param scope - Tên scope hiện tại
	 * @param key - Key cần tìm kiếm
	 * @returns Tên action tương ứng với key và extension, hoặc undefined nếu không tìm thấy
	 */
	findActionByKey: (scope: string, key: string) => string | undefined;

	/**
	 * Thiết lập toàn bộ hotkeys. Thường sử dụng khi mới khởi tạo hotkey
	 *
	 * @param hotkeys - Mảng mới của hotkeys
	 */
	setHotkey: (hotkeys: Record<ShortcutType, Hotkeys>) => void;

	/**
	 * Cập nhật hotkeys cho một extension cụ thể.
	 *
	 * @param key - Key cần cập nhật
	 * @param action - Tên action mới
	 * @param scope - Tên scope mới
	 */
	updateHotkey: (key: string, action: string, scope: string) => void;

	/**
	 * Lấy danh sách các extension phím tắt đã đăng ký.
	 * @returns Danh sách các extension phím tắt
	 */
	getExtensions: () => ShortcutExtension[];

	/**
	 * Lấy danh sách các action phím tắt đã đăng ký.
	 * @returns Danh sách các action
	 */
	getActions: () => Record<string, ShortcutAction>;

	/**
	 * Lấy danh sách các phím tắt đã đăng ký với hành động.
	 * @returns Danh sách các phím tắt
	 */
	getHotkeys: () => Hotkeys;

	/**
	 * Lấy context của một action
	 *
	 * @param actionName
	 * @returns
	 */
	getActionContext: (actionName: string) => any;

	/**
	 * @returns Danh sách tất cả các phím tắt hiện tại cùng action và extension tương ứng
	 */
	getShortcuts: () => Array<{
		hotkey: string;
		action: string;
		extension: string;
	}>;

	/**
	 *
	 * @returns
	 */
	getAvailableActions: () => Array<{ extension: string; action: string }>;

	// New methods
	registerScope: (scope: string, context: any) => void;
	unregisterScope: (scope: string) => void;

	// Private helpers (có thể expose để debug)
	findActionHandlers: (actionName: string, scop?: string) => ShortcutAction[];
}
