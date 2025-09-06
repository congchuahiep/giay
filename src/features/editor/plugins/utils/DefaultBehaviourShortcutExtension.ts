import { type ShortcutExtension } from "@/core/shortcut/store/shortcutStore";
import type { Editor } from "slate";

const DefaultBehaviourShortCutExtension: ShortcutExtension<Editor> = {
  name: "navigation",
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

  keySettings: {
    "backspace": "backspace-handler", // UNMODIFIED
    "mod+a": "select-all",
    // "mod+z": "undo",
    // "mod+shift+z": "redo",
    // "mod+y": "redo",
  },
};

export default DefaultBehaviourShortCutExtension;
