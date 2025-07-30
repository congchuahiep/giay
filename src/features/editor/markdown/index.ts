import handleDividerShortcut from "@/features/editor/markdown/handleDividerShortcut";
import handleMarkdownShortcut from "@/features/editor/markdown/handleMarkdownShortcut";
import type MarkdownEditor from "@/features/editor/markdown/interface";
import MARKDOWN_SHORTCUT_MAP from "@/features/editor/markdown/markdownShortcutMap";
import type { Editor } from "slate";

export { MARKDOWN_SHORTCUT_MAP };
export type { MarkdownEditor };

export function withMarkdownEditor(editor: Editor): Editor & MarkdownEditor {
  editor.handleMarkdownShortcut = (event) =>
    handleMarkdownShortcut(editor, event);

  editor.handleDividerShortcut = (event) =>
    handleDividerShortcut(editor, event);

  return editor;
}
