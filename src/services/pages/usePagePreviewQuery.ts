import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview, PageRawData } from "@/types/Page";

/**
 * Custom hook để lấy dữ liệu preview của một trang dựa trên pageId.
 *
 * Sử dụng React Query để fetch dữ liệu từ server và quản lý trạng thái tải.
 *
 * @param pageId - ID của trang cần lấy preview. Nếu undefined, query sẽ không được kích hoạt.
 * @param options - Các tùy chọn bổ sung cho useQuery, ngoại trừ queryKey và queryFn.
 * @returns Kết quả truy vấn từ React Query, bao gồm dữ liệu, trạng thái tải, và lỗi (nếu có).
 */
export function usePagePreviewQuery(
	pageId: string | undefined,
	options?: Omit<UseQueryOptions<PagePreview, Error>, "queryKey" | "queryFn">,
) {
	return useQuery<PagePreview>({
		enabled: !!pageId,
		queryKey: ["pages", pageId],
		// biome-ignore lint/style/noNonNullAssertion: Đã được giải quyết bằng enabled: !!pageId
		queryFn: () => fetchPageDataFromServer(pageId!),
		...options,
	});
}

async function fetchPageDataFromServer(pageId: string): Promise<PagePreview> {
	return await api
		.get(endpoint.pages.preview(pageId))
		.then((res) => {
			const rawData: PageRawData = res.data;

			// Trả về Page object với Y.Doc đã decode
			const page: PagePreview = {
				id: rawData.id,
				title: rawData.title,
				icon: rawData.icon,
				parent_page_id: rawData.parent_page_id,
				is_deleted: rawData.is_deleted,
				children: [], // TODO: Implement children fetching logic
			};

			return page;
		})
		.catch((error) => {
			console.error("Error fetching pages:", error);
			throw error;
		});
}
