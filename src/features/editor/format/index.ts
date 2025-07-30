import toggleMark from "@/features/editor/format/toggleMark";
import toggleBlock from "@/features/editor/format/toggleBlock";
import type FormatEditor from "@/features/editor/format/interface";
import type { Editor } from "slate";
import isBlockType from "@/features/editor/format/isBlockType";
import isMarkActive from "@/features/editor/format/isMarkActive";

export type { FormatEditor };

export function withFormatEditor(editor: Editor): Editor & FormatEditor {
  editor.toggleBlock = (type) => toggleBlock(editor, type);
  editor.toggleMark = (format) => toggleMark(editor, format);
  editor.isBlockType = (type) => isBlockType(editor, type);
  editor.isMarkActive = (format) => isMarkActive(editor, format);

  return editor;
}
