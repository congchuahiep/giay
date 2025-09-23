import { useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { Workspace } from "@/types";

export function useWorkspacesQuery() {
	return useQuery<Workspace[]>({
		queryKey: ["workspaces"],
		queryFn: () => fetchWorkspacesData(),
	});
}

async function fetchWorkspacesData() {
	// await new Promise((resolve) => setTimeout(resolve, 10000)); // Giả lập thời gian chờ 1 giây
	return await api
		.get(endpoint.workspaces.list)
		.then((res) => res.data)
		.catch((error) => {
			console.error("Error fetching workspaces:", error);
			return [];
		});
}
