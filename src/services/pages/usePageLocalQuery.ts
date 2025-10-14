import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { isTauri } from "@tauri-apps/api/core";
import { toUint8Array } from "js-base64";
import * as Y from "yjs";
import { api, endpoint } from "@/configs";
import type { Page, PageRawData } from "@/types/Page";
import { getLocalDatabase } from "../database";

/**
 * Hook dùng để fetch dữ liệu đầy đủ của một trang tài liệu. Trả về dữ liệu
 * trang dưới dạng object Page, bao gồm thông tin cơ bản và nội dung đã decode.
 *
 * @param pageId - ID của trang cần lấy dữ liệu
 * @param options - Tuỳ chọn cho react-query (ví dụ: enabled)
 * @returns Kết quả truy vấn react-query chứa dữ liệu trang
 */
export function usePageLocalQuery(
	pageId: string,
	options?: Omit<UseQueryOptions<Page | null, Error>, "queryKey" | "queryFn">,
) {
	return useQuery<Page | null>({
		queryKey: ["pages", pageId],
		queryFn: () => fetchPageData(pageId),
		retry: (_, error) => {
			console.log(error.message);
			return !error.message.includes("Page not found on local store");
		},
		...options,
	});
}

async function fetchPageData(pageId: string): Promise<Page | null> {
	if (isTauri()) {
		return await fetchPageDataFromLocal(pageId);
	}

	// Nếu là web, luôn lấy từ server
	// return await fetchPageDataFromServer(pageId);
	return null;
}

async function fetchPageDataFromLocal(pageId: string): Promise<Page> {
	try {
		const db = await getLocalDatabase();

		// Truy vấn page từ local database
		const result = await db.select<PageRawData[]>(
			"SELECT * FROM pages WHERE id = $1",
			[pageId],
		);
		if (result.length === 0)
			throw new Error(`Page not found on local store: ${pageId}`);
		const rawData = result[0];

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
		console.log("Fetched page from local:", page);

		return page;
	} catch (error) {
		console.error("Error fetching pages:", error);
		throw error;
	}
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

			console.log("Fetched page from server:", page);

			return page;
		})
		.catch((error) => {
			console.error("Error fetching pages:", error);
			throw error;
		});
}
