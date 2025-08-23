import type { ShortcutPlugin } from "@/core/shortcut";

const FormatShortcutExtension: ShortcutPlugin = {
  name: "block",
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
