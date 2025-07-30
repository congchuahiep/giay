import { type ShortcutPlugin } from "../core/ShortcutManager";

const MarkdownPlugin: ShortcutPlugin = {
  name: "markdown",
  priority: 80,
  actions: {
    "markdown-shortcut": (event, editor) => {
      editor.handleMarkdownShortcut(event);
    },

    "divider-markdown-shortcut": (event, editor) => {
      editor.handleDividerShortcut(event);
    },
  },
};

export default MarkdownPlugin;
