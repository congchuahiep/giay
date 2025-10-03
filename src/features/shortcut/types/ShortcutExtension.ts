import type { ShortcutAction, ShortcutType } from "../types";

/**
 * Lưu ý: Mỗi bộ extension chỉ có các phím tắt tồn tại duy nhất một lần.
 * Nếu có nhiều extension cùng đăng ký một phím tắt, thì chỉ có extension
 * có độ ưu tiên (priority) cao nhất được kích hoạt.
 *
 * Ví dụ:
 * - Extension A có priority = 10, đăng ký "mod+b" cho action "toggle-bold"
 * - Extension B có priority = 5, đăng ký "mod+b" cho action "toggle-italic"
 * Khi người dùng nhấn "mod+b", chỉ có action "toggle-bold" của extension A được gọi.
 */
// biome-ignore lint/suspicious/noExplicitAny: Context có thể là bất kỳ loại dữ liệu nào
export default interface ShortcutExtension<T = any> {
	/**
	 * Tên của bộ shortcut muốn đăng ký
	 */
	name: ShortcutType | string;

	/**
	 * Thứ tự ưu tiên của bộ shortcut
	 */
	priority: number;

	/**
	 * Yêu cầu phạm vi sử dụng (scope) khi đăng ký, ví dụ "editor", "sidebar", "global"
	 * Mặc định là "global", tức là không cần scope
	 *
	 * Khi một extension có scope, thì nó chỉ được kích hoạt khi scope đó đang active,
	 *
	 * Lưu ý: Nếu một extension không yêu cầu scope (scope = "global"),
	 * thì nó sẽ luôn được kích hoạt trong mọi scope
	 *
	 * Ví dụ:
	 * - Một extension chỉ dành cho editor, thì cần đặt scope = "editor"
	 * - Một extension dùng chung cho toàn app, thì đặt scope = "global"
	 *
	 * Mục đích của thuộc tính này là để tránh xung đột phím tắt giữa các phần khác nhau
	 * của ứng dụng, đồng thời giúp quản lý các phím tắt theo từng ngữ cảnh (context) cụ thể.
	 */
	scope: string | "global";

	/**
	 * Liệt kê cách bộ hành vi, cấu trúc: <tên hành vi, (event, editor) => boolean>
	 */
	actions: Record<string, ShortcutAction<T>>;

	/**
	 * Context truyền vào cho các action handler khi thực thi.
	 */
	context?: T;
}
