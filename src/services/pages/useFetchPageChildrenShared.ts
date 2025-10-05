import type { HocuspocusProvider } from "@hocuspocus/provider";
import { useCallback, useEffect } from "react";
import type { PagePreview } from "@/types";
import { usePageChildrenQuery } from ".";

/**
 * Hook dùng chung để fetch danh sách các trang con của một trang cha và đồng bộ
 * vào yDoc (provider).
 *
 *
 * @param {string} pageId - ID của trang cha cần fetch các trang con.
 * @param {any} provider - Yjs provider (yDoc) dùng để lưu dữ liệu các trang con.
 * @param {boolean} [enabled=true] - Có thực hiện fetch hay không (thường dùng để kiểm soát khi expand hoặc mount).
 *
 * @returns {{
 *   pageChildrenData: PagePreview[] | undefined,
 *   handleFetch: () => Promise<any>,
 *   isFetching: boolean,
 *   isSuccess: boolean
 * }}
 *
 * @example
 * // Sử dụng trong PageEditor: fetch ngay khi truy cập trang cha
 * const currentPage = useYjsPage((state) => state.currentPage);
 * const workspaceProvider = useYjsWorkspace((state) => state.provider);
 * usePageChildrenSharedQuery(currentPage.id, workspaceProvider, true);
 *
 * @example
 * // Sử dụng trong PageItem (sidebar): chỉ fetch khi expand
 * const workspaceProvider = useYjsWorkspace((state) => state.provider);
 * const { handleFetch, isFetching, isSuccess } = usePageChildrenSharedQuery(pageId, workspaceProvider, isCollapseOpen);
 */
export function useFetchPageChildrenShared(
	pageId: string,
	provider: HocuspocusProvider,
	enabled: boolean = true,
): {
	pageChildrenData: PagePreview[] | undefined;
	handleFetch: () => Promise<void>;
	isFetching: boolean;
	isSuccess: boolean;
} {
	const {
		data: pageChildrenData,
		refetch,
		isFetching,
		isSuccess,
	} = usePageChildrenQuery(pageId, {
		enabled: false,
		initialData: [],
	});

	/**
	 * Hàm xử lý fetch dữ liệu, sau khi đã xử lý xong sẽ tự động cập nhật dữ liệu
	 * vào shared type
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: chỉ phụ thuộc vào `refetch`
	const handleFetch = useCallback(async () => {
		refetch().then((res) => {
			const pageChildrenShared = provider.document.getMap<PagePreview>(pageId);

			res.data?.forEach((child) => {
				pageChildrenShared.set(child.id, child);
			});
		});
	}, [refetch]);

	/**
	 * Tự động fetch dữ liệu khi enable
	 */
	useEffect(() => {
		if (!enabled) return;
		const pageChildrenShared = provider.document.getMap<PagePreview>(pageId);

		// Chỉ cần fetch khi pageChildrenShared rỗng
		if (pageChildrenShared.size !== 0) return;

		handleFetch();
	}, [pageId, provider, enabled, handleFetch]);

	return { pageChildrenData, handleFetch, isFetching, isSuccess };
}
