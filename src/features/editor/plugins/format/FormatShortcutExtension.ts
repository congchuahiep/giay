import type { ShortcutExtension } from "@/core/shortcut";
import type { Editor } from "slate";

const FormatShortcutExtension: ShortcutExtension<Editor> = {
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
