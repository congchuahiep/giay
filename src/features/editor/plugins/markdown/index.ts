import handleDividerShortcut from "@/features/editor/plugins/markdown/handleDividerShortcut";
import handleMarkdownShortcut from "@/features/editor/plugins/markdown/handleMarkdownShortcut";
import type MarkdownEditor from "@/features/editor/plugins/markdown/interface";
import MarkdownShortcutExtension from "@/features/editor/plugins/markdown/MarkdownShortcutExtension";
import MARKDOWN_SHORTCUT_MAP from "@/features/editor/plugins/markdown/MarkdownShortcutMap";
import type { Editor } from "slate";

export { MARKDOWN_SHORTCUT_MAP, MarkdownShortcutExtension };
export type { MarkdownEditor };

export function withMarkdownEditor(editor: Editor): Editor & MarkdownEditor {
  editor.handleMarkdownShortcut = (event) =>
    handleMarkdownShortcut(editor, event);

  editor.handleDividerShortcut = (event) =>
    handleDividerShortcut(editor, event);

  return editor;
}
