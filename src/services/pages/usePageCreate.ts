import type { HocuspocusProvider } from "@hocuspocus/provider";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";

interface CreatePageVariables {
	parentPageId?: string;
}

/**
 * Sử dụng để tạo một trang mới trong workspace
 *
 * @param workspaceId
 * @param options
 * @returns
 */
export function usePageCreate(
	workspaceId: string,
	provider: HocuspocusProvider,
	options?: UseMutationOptions<PagePreview, Error, CreatePageVariables>,
) {
	return useMutation<PagePreview, Error, CreatePageVariables>({
		mutationFn: (variables) => createPage(workspaceId, variables.parentPageId),
		...options,
		onSuccess: (data, variables, context) => {
			provider.document
				.getMap<PagePreview>(variables.parentPageId || "root-pages")
				.set(data.id, data);

			options?.onSuccess?.(data, variables, context);
		},
	});
}

async function createPage(
	workspaceId: string,
	parentPageId?: string,
): Promise<PagePreview> {
	const pageId = uuidv4();

	// Gửi yDoc dưới dạng mảng byte
	const yDoc = new Y.Doc();
	const encodeState = Y.encodeStateAsUpdate(yDoc);
	const arrayData = Array.from(encodeState);

	const page = {
		id: pageId,
		title: "",
		icon: "",
		workspace: workspaceId,
		parent_page: parentPageId,
		page_data: arrayData,
		sync_status: "initial",
		children: [],
	};

	return await api
		.post(endpoint.pages.create, { ...page })
		.then((response) => ({
			id: response.data.id,
			title: "",
			icon: "",
			parent_page_id: response.data.parent_page,
			is_deleted: false,
			children: [],
		}))
		.catch((error) => {
			console.error(error.request.responseText);
			throw error;
		});
}
