import { useContext } from "react";
import { useStore } from "zustand";
import { YjsPageContext } from "./context";
import type { YjsPageState } from "./types";

/**
 * Custom hook để truy cập vào Zustand store được cung cấp bởi `YjsPageProvider`.
 *
 * Hook này giúp bạn lấy ra một phần state hoặc action từ `YjsPageState`
 * thông qua một selector. Nó đảm bảo rằng store đã được bọc trong context,
 * nếu không sẽ ném lỗi để cảnh báo thiếu `YjsPageProvider`.
 *
 * @template T - Kiểu dữ liệu mà selector trả về.
 * @param selector - Hàm selector nhận toàn bộ state (`YjsPageState`) và trả về giá trị mong muốn.
 * @returns Giá trị được chọn từ store (theo kiểu `T`).
 *
 * @throws {Error} Nếu hook được gọi bên ngoài `YjsPageProvider`.
 *
 * @example
 * ```tsx
 * // Lấy page hiện tại đang mở
 * const page = useYjsPage((s) => s.currentPage);
 * ```
 */
export function useYjsPage<T>(selector: (state: YjsPageState) => T): T {
	const store = useContext(YjsPageContext);

	if (!store) {
		throw new Error("useYjsPage must be used within a YjsPageProvider");
	}

	return useStore(store, selector);
}
