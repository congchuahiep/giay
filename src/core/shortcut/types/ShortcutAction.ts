import type { KeyboardEvent } from "react";

/**
 * Kiểu định nghĩa hàm xử lý hành động phím tắt
 */
export default interface ShortcutAction<T = any> {
	(event: KeyboardEvent, context: T): boolean | void;
}
