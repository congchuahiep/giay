import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";

const FormatShortcutExtension: ShortcutExtension<Editor> = {
	name: "format",
	scope: "editor",
	priority: 10,
	actions: {
		"toggle-code-block": (event, editor) => {
			event.preventDefault();
			editor.toggleBlock("code");
			return true;
		},
	},
};

export default FormatShortcutExtension;
