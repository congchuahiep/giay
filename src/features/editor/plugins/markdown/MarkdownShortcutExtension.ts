import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";

const MarkdownShortcutExtension: ShortcutExtension<Editor> = {
	name: "markdown",
	scope: "editor",
	priority: 10,
	actions: {
		"markdown-shortcut": (event, editor) => {
			editor.handleMarkdownShortcut(event);
			return true;
		},

		"divider-markdown-shortcut": (event, editor) => {
			editor.handleDividerShortcut(event);
			return true;
		},
	},
};

export default MarkdownShortcutExtension;
