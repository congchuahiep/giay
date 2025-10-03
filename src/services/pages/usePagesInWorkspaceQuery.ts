import { useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types/Page";

export function usePagesInWorkspaceQuery(workspaceId: string) {
	return useQuery<PagePreview[]>({
		queryKey: ["page_previews"],
		queryFn: () => fetchPagesData(workspaceId),
	});
}

async function fetchPagesData(workspaceId: string) {
	await new Promise((resolve) => setTimeout(resolve, 3000)); // Giả lập thời gian chờ 1 giây
	return await api
		.get(endpoint.workspaces.rootPage(workspaceId), {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		})
		.then((res) => res.data)
		.catch((error) => {
			console.error("Error fetching pages:", error);
			return [];
		});
}
