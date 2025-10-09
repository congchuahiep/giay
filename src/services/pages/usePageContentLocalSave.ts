import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { QueryResult } from "@tauri-apps/plugin-sql";
import * as Y from "yjs";
import { getLocalDatabase } from "../database";
import { fromUint8Array } from "js-base64";

interface LocalPageContentSaveParams {
	pageId: string;
	workspaceId: string;
	pageData: Y.Doc;
}

/**
 * Sử dụng để tạo một trang mới trong workspace
 *
 * @param workspaceId
 * @param options
 * @returns
 */
export function usePageContentLocalSave(
	options?: UseMutationOptions<QueryResult, Error, LocalPageContentSaveParams>,
) {
	return useMutation<QueryResult, Error, LocalPageContentSaveParams>({
		mutationFn: (variables) =>
			savePageContentToLocal(
				variables.pageId,
				variables.workspaceId,
				variables.pageData,
			),
		...options,
		onSuccess: (data, variables, context) => {
			console.info("Lưu thành công!", data);
			options?.onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			console.error("Lỗi khi lưu trang nội dung cục bộ", error);
			options?.onError?.(error, variables, context);
		},
	});
}

async function savePageContentToLocal(
	pageId: string,
	workspaceId: string,
	pageData: Y.Doc,
): Promise<QueryResult> {
	const db = await getLocalDatabase();
	const encodedState = Y.encodeStateAsUpdate(pageData);
	const base64Encoded = fromUint8Array(encodedState);

	// Lưu vào database
	return await db.execute(
		`UPDATE pages
      SET
        content = $3,
        page_data = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = $1 AND
        workspace_id = $2;
    `,
		[
			pageId,
			workspaceId,
			pageData.get("content", Y.XmlText).toString(),
			base64Encoded,
		],
	);
}
