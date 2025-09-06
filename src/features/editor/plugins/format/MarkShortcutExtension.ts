import { type ShortcutExtension } from "@/core/shortcut/store/shortcutStore";

const MarkShortcutExtension: ShortcutExtension = {
  name: "mark",
  priority: 10,
  actions: {
    "mark-bold": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("bold");
      return true;
    },
    "mark-italic": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("italic");
      return true;
    },
    "mark-underline": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("underline");
      return true;
    },
    "mark-strike-through": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("strikeThrough");
      return true;
    },
    "mark-code": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("code");
      return true;
    },
  },
  keySettings: {
    "mod+b": "mark-bold",
    "mod+i": "mark-italic",
    "mod+u": "mark-underline",
    "mod+shift+x": "mark-strike-through",
    "mod+e": "mark-code",
  },
};

export default MarkShortcutExtension;
