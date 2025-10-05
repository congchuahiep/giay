import { useQuery } from "@tanstack/react-query";
import { toUint8Array } from "js-base64";
import * as Y from "yjs";
import { api, endpoint } from "@/configs";
import type { Page, PageRawData } from "@/types/Page";

/**
 * Hook dùng để fetch dữ liệu đầy đủ của một trang tài liệu.
 * Trả về dữ liệu trang dưới dạng object Page, bao gồm thông tin cơ bản và nội dung đã decode.
 *
 * @param pageId - ID của trang cần lấy dữ liệu
 * @param options - Tuỳ chọn cho react-query (ví dụ: enabled)
 * @returns Kết quả truy vấn react-query chứa dữ liệu trang
 */
export function usePageQuery(pageId: string, options?: { enabled?: boolean }) {
	return useQuery<Page>({
		queryKey: ["pages", pageId],
		queryFn: () => fetchPageDataFromServer(pageId),
		...options,
	});
}

async function fetchPageDataFromServer(pageId: string): Promise<Page> {
	return await api
		.get(endpoint.pages.retrieve(pageId))
		.then((res) => {
			const rawData: PageRawData = res.data;

			// Decode page_data từ Uint8Array thành Y.Doc
			const yDoc = new Y.Doc();
			const decodedPageData = toUint8Array(rawData.page_data);
			Y.applyUpdate(yDoc, decodedPageData);

			// Trả về Page object với Y.Doc đã decode
			const page: Page = {
				id: rawData.id,
				title: rawData.title,
				icon: rawData.icon,
				// Bổ sung children
				parent_page_id: rawData.parent_page_id,
				page_data: yDoc,
				is_deleted: rawData.is_deleted,
			};

			return page;
		})
		.catch((error) => {
			console.error("Error fetching pages:", error);
			throw error;
		});
}
