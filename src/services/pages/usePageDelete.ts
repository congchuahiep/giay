import { api, endpoint } from "@/configs";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

interface DeletePageVariables {
	id: string;
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
	options?: UseMutationOptions<string, Error, DeletePageVariables>,
) {
	return useMutation<string, Error, DeletePageVariables>({
		mutationFn: (variables) => deletePage(variables.id),
		...options,
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
