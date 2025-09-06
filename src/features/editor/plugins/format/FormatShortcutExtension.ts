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

  keySettings: {
    "mod+k": "toggle-code-block",
    "mod+`": "toggle-code-block",
  },
};

export default FormatShortcutExtension;
