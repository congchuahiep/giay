import { type ShortcutExtension } from "@/core/shortcut/store/shortcutStore";

const MarkdownShortcutExtension: ShortcutExtension = {
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
};

export default MarkdownShortcutExtension;
