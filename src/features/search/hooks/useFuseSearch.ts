import Fuse, { type FuseResult, type IFuseOptions } from "fuse.js";
import { useMemo } from "react";

/**
 * Hook `useFuseSearch` dùng để thực hiện tìm kiếm mờ (fuzzy search) trên một danh sách items sử dụng thư viện Fuse.js.
 *
 * @template T - Kiểu dữ liệu của các phần tử trong danh sách items.
 * @param {T[]} items - Danh sách các phần tử cần tìm kiếm.
 * @param {string} searchQuery - Chuỗi truy vấn tìm kiếm do người dùng nhập.
 * @param {IFuseOptions<T>} searchOption - Các tuỳ chọn cấu hình cho Fuse.js (ví dụ: keys, threshold, ...).
 * @returns {{
 *   filteredItems: T[];
 *   searchResults: Fuse.FuseResult<T>[];
 * }}
 * - `filteredItems`: Danh sách các phần tử đã được lọc dựa trên kết quả tìm kiếm.
 * - `searchResults`: Kết quả chi tiết từ Fuse.js, bao gồm thông tin về điểm số, vị trí khớp, v.v.
 *
 * @example
 * const { filteredItems, searchResults } = useFuseSearch(data, query, options);
 *
 * @note
 * - Nếu `searchQuery` rỗng hoặc chỉ chứa khoảng trắng, hook sẽ trả về toàn bộ danh sách items.
 * - Kết quả được memo hóa để tối ưu hiệu năng khi danh sách items hoặc truy vấn thay đổi.
 */
export default function useFuseSearch<T>(
	items: T[],
	searchQuery: string,
	searchOption: IFuseOptions<T>,
): {
	filteredItems: T[];
	searchResults: FuseResult<T>[];
} {
	// Tạo Fuse instance với memoization
	const fuse = useMemo(() => {
		return new Fuse(items, searchOption);
	}, [items, searchOption]);

	// Thực hiện search với memoization
	const searchResults = useMemo(() => {
		if (!searchQuery.trim()) {
			// Nếu không có query, trả về tất cả items
			return items.map((item, index) => ({
				item,
				refIndex: index,
				score: 0,
				matches: [],
			}));
		}

		// Thực hiện fuzzy search
		return fuse.search(searchQuery);
	}, [fuse, searchQuery, items]);

	// Trả về chỉ items để dễ sử dụng
	const filteredItems = useMemo(() => {
		return searchResults.map((result) => result.item);
	}, [searchResults]);

	// Trả về cả kết quả chi tiết và items đã lọc
	return {
		filteredItems,
		searchResults,
	};
}
