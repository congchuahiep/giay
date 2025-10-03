import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";

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
