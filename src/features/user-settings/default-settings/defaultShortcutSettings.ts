import type { Hotkeys } from "@/core/shortcut";

export const defaultShortcutSettings: Record<string, Hotkeys> = {
	editor: {
		// Mark
		"mod+b": "mark-bold",
		"mod+i": "mark-italic",
		"mod+u": "mark-underline",
		"mod+shift+x": "mark-strike-through",
		"mod+e": "mark-code",

		// Format
		"mod+k": "toggle-code-block",
		"mod+`": "toggle-code-block",

		// Markdown
		space: "markdown-shortcut", // UNMODIFIED
		"-": "divider-markdown-shortcut", // UNMODIFIED

		// Open slash menu
		"/": "slash-command",

		// Default behaviour
		backspace: "backspace-handler", // UNMODIFIED
		"mod+a": "select-all", // UNMODIFIED
		// "mod+z": "undo",
		// "mod+shift+z": "redo",
		// "mod+y": "redo",
	},

	global: {
		// App navigation
		"mod+s": "toggle-sidebar",
		"mod+,": "open-settings",
	},

	"slash-menu": {
		up: "select-previous-item", // UNMODIFIED
		down: "select-next-item", // UNMODIFIED
		escape: "close-slash-command", // UNMODIFIED
		enter: "select-slash-command", // UNMODIFIED
	},
};
