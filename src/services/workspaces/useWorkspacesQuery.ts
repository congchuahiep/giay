import { useQuery } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { Workspace } from "@/types";

export function useWorkspacesQuery(token: string | null) {
	return useQuery<Workspace[], Error>({
		enabled: !!token,
		queryKey: ["workspaces"],
		// biome-ignore lint/style/noNonNullAssertion: Already handled by `enabled: !!token`
		queryFn: () => fetchWorkspacesData(token!),
	});
}

async function fetchWorkspacesData(token: string) {
	// await new Promise((resolve) => setTimeout(resolve, 10000)); // Giả lập thời gian chờ 1 giây
	return await api
		.get(endpoint.workspaces.list)
		.then((res) => res.data)
		.catch((error) => {
			console.error("Error fetching workspaces:", error);
			return [];
		});
}
