import type { Editor } from "slate";
import type { ShortcutExtension } from "@/core/shortcut";
import { defaultShortcutSettings } from "@/features/user-settings/default-settings/defaultShortcutSettings";

const DefaultBehaviourShortCutExtension: ShortcutExtension<Editor> = {
  name: "default-behaviour",
  priority: 0,
  actions: {
    "backspace-handler": (event, editor) => {
      editor.handleDeleteFirstBlock(event);
      return true;
    },

    "select-all": (event, editor) => {
      editor.expandSelectionToFullBlocks(event);
      return true;
    },

    // "undo": (_, editor) => {
    //   editor.undo();
    //   return true;
    // },

    // "redo": (_, editor) => {
    //   editor.redo();
    //   return true;
    // },
  },
};

export default DefaultBehaviourShortCutExtension;
