import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";
import { defaultShortcutSettings } from "@/features/user-settings/default-settings/defaultShortcutSettings";

const FormatShortcutExtension: ShortcutExtension<Editor> = {
  name: "format",
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
