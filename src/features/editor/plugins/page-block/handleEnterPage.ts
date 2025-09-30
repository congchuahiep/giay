import type { NavigateFunction } from "react-router-dom";
import type { Editor } from "slate";
import type { PageBlock } from "../../types";

export default function handleEnterPage(
	editor: Editor,
	workspaceId: string,
	navigate: NavigateFunction,
): boolean {
	const currentBlock = editor.getCurrentBlock();

	if (!currentBlock) return false;

	if (currentBlock.type === "page") {
		const pageBlock = currentBlock as PageBlock;
		navigate(`/${workspaceId}/${pageBlock.pageId}`);
		return true;
	}

	return false;
}
