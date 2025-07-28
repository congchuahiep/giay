import { type ShortcutPlugin } from "../core/ShortcutManager";

const MarkPlugin: ShortcutPlugin = {
  name: "mark",
  priority: 100,
  actions: {
    "mark-bold": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("bold");
    },
    "mark-italic": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("italic");
    },
    "mark-underline": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("underline");
    },
    "mark-strike-through": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("strikeThrough");
    },
    "mark-code": (event, editor) => {
      event.preventDefault();
      editor.toggleMark("code");
    },
  },
};

export default MarkPlugin;
