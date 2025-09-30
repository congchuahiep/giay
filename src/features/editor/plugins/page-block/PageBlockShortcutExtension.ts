import type { NavigateFunction } from "react-router-dom";
import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";

interface PageBlockShortCutExtensionContext {
	editor: Editor;
	workspaceId: string;
	navigate: NavigateFunction;
}

const PageBlockShortcutExtension: ShortcutExtension<PageBlockShortCutExtensionContext> =
	{
		name: "page-block",
		scope: "editor.page-block",
		priority: 0,
		actions: {
			"enter-page": (_, context) => {
				const { editor, workspaceId, navigate } = context;
				return editor.handleEnterPage(editor, workspaceId, navigate);
			},
		},
	};

export default PageBlockShortcutExtension;
