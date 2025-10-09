import type { HocuspocusProvider } from "@hocuspocus/provider";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";
import { api, endpoint } from "@/configs";
import type { PagePreview } from "@/types";
import { getLocalDatabase } from "../database";
import { isTauri } from "@tauri-apps/api/core";
import { fromUint8Array } from "js-base64";

interface CreatePageVariables {
	parentPageId?: string;
}

/**
 * Sử dụng để tạo một trang mới trong workspace
 *
 * @param workspaceId
 * @param provider
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
			// Hiển thị trang mới trong workspace sidebar
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

	// Nếu là tauri, tạo trang local
	if (isTauri()) await createPageLocal(pageId, workspaceId, parentPageId);

	return await createPageServer(pageId, workspaceId, parentPageId);
}

async function createPageLocal(
	pageId: string,
	workspaceId: string,
	parentPageId?: string,
): Promise<PagePreview> {
	// Gửi yDoc dưới dạng mảng byte
	const yDoc = new Y.Doc();
	const encodedState = Y.encodeStateAsUpdate(yDoc);
	const base64Encoded = fromUint8Array(encodedState);

	const db = await getLocalDatabase();
	console.log("Tạo trang local!");

	const page = {
		id: pageId,
		workspace_id: workspaceId,
		parent_page_id: parentPageId,
		title: "",
		icon: "",
		content: "",
		page_data: base64Encoded,
		sync_status: "initial",
	};

	// Lưu vào database, thay thế nếu đã tồn tại
	try {
		await db.execute(
			`INSERT OR REPLACE INTO pages (
				id,
				workspace_id,
				parent_page_id,
				title,
				icon,
				content,
				page_data,
				sync_status,
				updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
			[
				page.id,
				page.workspace_id,
				page.parent_page_id,
				page.title,
				page.icon,
				page.content,
				page.page_data,
				page.sync_status,
			],
		);

		// Trả về đối tượng PagePreview sau khi lưu thành công
		return {
			id: page.id,
			title: page.title,
			icon: page.icon,
			parent_page_id: page.parent_page_id,
			is_deleted: false,
			children: [],
		};
	} catch (error) {
		console.error("Lỗi khi tạo trang:", error);
		throw error;
	}
}

async function createPageServer(
	pageId: string,
	workspaceId: string,
	parentPageId?: string,
): Promise<PagePreview> {
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
