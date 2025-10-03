import type { NavigateFunction } from "react-router-dom";
import type { Editor } from "slate";
import type { ShortcutExtension } from "@/features/shortcut";

interface PageBlockShortCutExtensionContext {
	editor: Editor;
	workspaceId: string;
	navigate: NavigateFunction;
}

export const PageBlockShortcutExtension: ShortcutExtension<PageBlockShortCutExtensionContext> =
	{
		name: "page-block",
		scope: "editor.page-block",
		priority: 0,
		actions: {
			"enter-page": (_, context) => {
				const { editor, workspaceId, navigate } = context;
				return editor.handleEnterPage(workspaceId, navigate);
			},
			"delete-page": (event, context) => {
				const { editor } = context;
				event.stopPropagation();
				console.log("delete-page");
				return editor.handleDeletePage();
			},
		},
	};
