import { type ShortcutExtension } from "@/core/shortcut/store/shortcutStore";
import type { Editor } from "slate";

const MarkdownShortcutExtension: ShortcutExtension<Editor> = {
  name: "markdown",
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

  keySettings: {
    "space": "markdown-shortcut", // UNMODIFIED
    "-": "divider-markdown-shortcut", // UNMODIFIED
  },
};

export default MarkdownShortcutExtension;
