import type { Editor } from "slate";
import { handleDividerShortcut, handleMarkdownShortcut } from "./actions";
import type { MarkdownEditor } from "./types";

export default function withMarkdownEditor(
	editor: Editor,
): Editor & MarkdownEditor {
	editor.handleMarkdownShortcut = (event) =>
		handleMarkdownShortcut(editor, event);

	editor.handleDividerShortcut = (event) =>
		handleDividerShortcut(editor, event);

	return editor;
}
