import { type ShortcutPlugin } from "../core/ShortcutManager";

const DefaultBehaviourPlugin: ShortcutPlugin = {
  name: "navigation",
  priority: 70,
  actions: {
    "backspace-handler": (event, editor) => {
      editor.handleDeleteFirstBlock(event);
    },

    "select-all": (event, editor) => {
      editor.expandSelectionToFullBlocks(event);
    },

    "undo": (_, editor) => {
      editor.undo();
    },

    "redo": (_, editor) => {
      editor.redo();
    },
  },
};

export default DefaultBehaviourPlugin;
