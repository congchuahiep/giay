import type { ShortcutExtension } from "@/core/shortcut";
import { defaultShortcutSettings } from "@/features/user-settings/default-settings/defaultShortcutSettings";
import type { Editor } from "slate";

const MarkShortcutExtension: ShortcutExtension<Editor> = {
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
};

export default MarkShortcutExtension;
