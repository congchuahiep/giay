import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview, PageRawData } from "@/types/Page";

export function usePagePreviewQuery(
	pageId: string,
	options?: Omit<UseQueryOptions<PagePreview, Error>, "queryKey" | "queryFn">,
) {
	return useQuery<PagePreview>({
		queryKey: ["pages", pageId],
		queryFn: () => fetchPageDataFromServer(pageId),
		...options,
	});
}

async function fetchPageDataFromServer(pageId: string): Promise<PagePreview> {
	return await api
		.get(endpoint.pages.retrieve(pageId))
		.then((res) => {
			const rawData: PageRawData = res.data;

			// Trả về Page object với Y.Doc đã decode
			const page: PagePreview = {
				id: rawData.id,
				title: rawData.title,
				icon: rawData.icon,
				parent_page_id: rawData.parent_page_id,
				children: [], // TODO: Implement children fetching logic
			};

			return page;
		})
		.catch((error) => {
			console.error("Error fetching pages:", error);
			throw error;
		});
}
