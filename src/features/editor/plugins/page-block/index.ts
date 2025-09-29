import type { Editor } from "slate";
import handleEnterPage from "./handleEnterPage";
import type { PageBlockEditor } from "./interface";

export { default as PageBlockShortcutExtension } from "./PageBlockShortcutExtension";

export const withPageBlock = (editor: Editor & PageBlockEditor) => {
	editor.handleEnterPage = (editor, workspaceId, navigateFn) =>
		handleEnterPage(editor, workspaceId, navigateFn);

	return editor;
};

export type { PageBlockEditor };
