import type { ShortcutPlugin } from "@/features/editor/shortcut/core/ShortcutManager";

const BlockPlugin: ShortcutPlugin = {
  name: "block",
  priority: 90,
  actions: {
    "toggle-code-block": (event, editor) => {
      event.preventDefault();
      editor.toggleBlock("code");
      return true;
    },
  },
};

export default BlockPlugin;
