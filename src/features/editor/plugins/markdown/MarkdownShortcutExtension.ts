import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";
import { defaultShortcutSettings } from "@/features/user-settings/default-settings/defaultShortcutSettings";

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
};

export default MarkdownShortcutExtension;
