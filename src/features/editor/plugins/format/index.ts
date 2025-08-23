import type FormatEditor from "@/features/editor/plugins/format/interface";
import isBlockType from "@/features/editor/plugins/format/isBlockType";
import isMarkActive from "@/features/editor/plugins/format/isMarkActive";
import toggleBlock from "@/features/editor/plugins/format/toggleBlock";
import toggleMark from "@/features/editor/plugins/format/toggleMark";
import type { Editor } from "slate";

import FormatShortcutExtension from "@/features/editor/plugins/format/FormatShortcutExtension";
import MarkShortcutExtension from "@/features/editor/plugins/format/MarkShortcutExtension";

export { FormatShortcutExtension, MarkShortcutExtension };
export type { FormatEditor };

export function withFormatEditor(editor: Editor): Editor & FormatEditor {
  editor.toggleBlock = (type) => toggleBlock(editor, type);
  editor.toggleMark = (format) => toggleMark(editor, format);
  editor.isBlockType = (type) => isBlockType(editor, type);
  editor.isMarkActive = (format) => isMarkActive(editor, format);

  return editor;
}
