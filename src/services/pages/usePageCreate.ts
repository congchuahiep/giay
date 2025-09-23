import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";

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
	options?: UseMutationOptions<PagePreview, Error, CreatePageVariables>,
) {
	return useMutation<PagePreview, Error, CreatePageVariables>({
		mutationFn: (variables) => createPage(workspaceId, variables.parentPageId),
		...options,
	});
}

async function createPage(workspaceId: string, parentPageId?: string) {
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

	console.log("Creating new page...", page);

	return await api
		.post(endpoint.pages.create, { ...page })
		.then((response) => response.data)
		.catch((error) => {
			console.error(error.request.responseText);
			throw error;
		});
}
