import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";

/**
 * Hook này dùng để lấy dữ liệu các trang con trong trang hiện tại.
 * Tuy nhiên, dữ liệu các trang con thường được sử dụng với Yjs để đồng bộ hóa
 * thời gian thực. Không khuyến cáo sử dụng hook này để tự fetch trang con, thay
 * vào đó hãy sử dụng `usePageChildrenSharedQuery` để truy vấn.
 *
 * Hook `usePageChildrenSharedQuery` sẽ tự động cập nhật và sync dữ liệu Yjs
 * sẵn, bạn chỉ cần theo dõi dữ liệu Yjs có thay đổi để cập nhật.
 */
export function usePageChildrenQuery(
	pageId: string,
	options?: Omit<UseQueryOptions<PagePreview[]>, "queryKey" | "queryFn">,
) {
	return useQuery<PagePreview[]>({
		queryKey: ["page_children", pageId],
		queryFn: () => fetchPageChildrenDataFromServer(pageId),
		...options,
	});
}

async function fetchPageChildrenDataFromServer(
	pageId: string,
): Promise<PagePreview[]> {
	return await api
		.get(endpoint.pages.children(pageId))
		.then((res) => {
			return res.data;
		})
		.catch((error) => {
			console.error("Error fetching pages:", error);
			throw error;
		});
}
