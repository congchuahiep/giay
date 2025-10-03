import type { Editor } from "slate";
import { isBlockType, isMarkActive, toggleBlock, toggleMark } from "./actions";
import type { FormatEditor } from "./types";

export default function withFormatEditor(
	editor: Editor,
): Editor & FormatEditor {
	editor.toggleBlock = (type) => toggleBlock(editor, type);
	editor.toggleMark = (format) => toggleMark(editor, format);
	editor.isBlockType = (type) => isBlockType(editor, type);
	editor.isMarkActive = (format) => isMarkActive(editor, format);

	return editor;
}
