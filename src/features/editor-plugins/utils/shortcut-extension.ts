import type { Editor } from "slate";
import type { ShortcutExtension } from "@/features/shortcut";

export const DefaultBehaviourShortCutExtension: ShortcutExtension<Editor> = {
	name: "default-behaviour",
	scope: "editor",
	priority: 0,
	actions: {
		"backspace-handler": (event, editor) => {
			editor.handleDeleteFirstBlock(event);
			return true;
		},

		"select-all": (event, editor) => {
			editor.expandSelectionToFullBlocks(event);
			return true;
		},

		// "undo": (_, editor) => {
		//   editor.undo();
		//   return true;
		// },

		// "redo": (_, editor) => {
		//   editor.redo();
		//   return true;
		// },
	},
};
