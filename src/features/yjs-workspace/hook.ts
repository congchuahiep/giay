import { useContext } from "react";
import { useStore } from "zustand";
import { YjsWorkspaceContext } from "./context";
import type { YjsWorkspaceState } from "./types";

/**
 * Custom hook để truy cập vào Zustand store được cung cấp bởi `YjsWorkspaceProvider`.
 *
 * Hook này giúp bạn lấy ra một phần state hoặc action từ `YjsWorkspaceState`
 * thông qua một selector. Nó đảm bảo rằng store đã được bọc trong context,
 * nếu không sẽ ném lỗi để cảnh báo thiếu `YjsWorkspaceProvider`.
 *
 * @template T - Kiểu dữ liệu mà
 * selector trả về.
 * @param selector - Hàm selector nhận toàn bộ state (`YjsWorkspaceState`) và trả về giá trị mong muốn.
 * @returns Giá trị được chọn từ store (theo kiểu `T`).
 *
 * @throws {Error} Nếu hook được gọi bên ngoài `YjsWorkspaceProvider`.
 *
 * @example
 * ```tsx
 * // Lấy danh sách workspaces
 * const workspaces = useYjsWorkspace((s) => s.userWorkspaces);
 *
 * // Lấy action để thêm workspace
 * const addWorkspace = useYjsWorkspace((s) => s.addWorkspace);
 * ```
 */
export function useYjsWorkspace<T>(
	selector: (state: YjsWorkspaceState) => T,
): T {
	const store = useContext(YjsWorkspaceContext);

	if (!store) {
		throw new Error(
			"useYjsWorkspace must be used within a YjsWorkspaceProvider",
		);
	}

	return useStore(store, selector);
}
