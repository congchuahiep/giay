import { type ShortcutExtension } from "@/core/shortcut/store/shortcutStore";

const DefaultBehaviourShortCutExtension: ShortcutExtension = {
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

    "undo": (_, editor) => {
      editor.undo();
      return true;
    },

    "redo": (_, editor) => {
      editor.redo();
      return true;
    },
  },
};

export default DefaultBehaviourShortCutExtension;
