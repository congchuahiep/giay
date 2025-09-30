import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";

const MarkShortcutExtension: ShortcutExtension<Editor> = {
	name: "mark",
	scope: "editor",
	priority: 10,
	actions: {
		"mark-bold": (event, editor) => {
			event.preventDefault();
			editor.toggleMark("bold");
			return true;
		},
		"mark-italic": (event, editor) => {
			event.preventDefault();
			editor.toggleMark("italic");
			return true;
		},
		"mark-underline": (event, editor) => {
			event.preventDefault();
			editor.toggleMark("underline");
			return true;
		},
		"mark-strike-through": (event, editor) => {
			event.preventDefault();
			editor.toggleMark("strikeThrough");
			return true;
		},
		"mark-code": (event, editor) => {
			event.preventDefault();
			editor.toggleMark("code");
			return true;
		},
	},
};

export default MarkShortcutExtension;
