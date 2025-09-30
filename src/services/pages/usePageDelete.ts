import type { HocuspocusProvider } from "@hocuspocus/provider";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";

interface DeletePageVariables {
	page_id: string;
	parent_page_id?: string;
}

/**
 * Sử dụng để tạo xoá một trang trong workspace
 *
 * - `mutationFn`: Hàm thực hiện xoá trang, trả về id của trang đã xoá
 *
 * @param workspaceId
 * @param options
 * @returns
 */
export function usePageDelete(
	provider: HocuspocusProvider,
	options?: UseMutationOptions<string, Error, DeletePageVariables>,
) {
	return useMutation<string, Error, DeletePageVariables>({
		mutationFn: (variables) => deletePage(variables.page_id),
		...options,
		onSuccess: (data, variables, context) => {
			provider.document
				.getMap<PagePreview>(variables.parent_page_id || "root-pages")
				.delete(variables.page_id);

			options?.onSuccess?.(data, variables, context);
		},
	});
}

async function deletePage(id: string) {
	return await api
		.delete(endpoint.pages.delete(id))
		.then(() => id)
		.catch((error) => {
			console.error(error);
			throw error;
		});
}
