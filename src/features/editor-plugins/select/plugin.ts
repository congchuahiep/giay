import type { Editor } from "slate";
import {
	expandSelectionToFullBlocks,
	isSelectAllBlock,
	isSelectFullBlock,
} from "./actions";
import type { SelectEditor } from "./types";

export default function withSelectEditor(
	editor: Editor,
): Editor & SelectEditor {
	editor.expandSelectionToFullBlocks = (event) =>
		expandSelectionToFullBlocks(editor, event);

	editor.isSelectFullBlock = () => isSelectFullBlock(editor);
	editor.isSelectAllBlock = () => isSelectAllBlock(editor);

	return editor;
}
