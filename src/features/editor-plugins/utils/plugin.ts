import type { Editor } from "slate";
import { v4 as uuidv4 } from "uuid";
import {
	buildBlock,
	ensureBlockId,
	getBlockByid,
	getBlockContentById,
	getBlockEntryById,
	getBlockPathById,
	getCurrentBlock,
	getCurrentBlockPath,
	getCurrentBlockType,
	getLastBlock,
	getLastBlockEntry,
	getLastBlockPath,
	isCurrentBlockEmpty,
} from "./actions";
import getCurrentBlockContent from "./actions/getCurrentBlockContent.ts";
import getCurrentBlockEntry from "./actions/getCurrentBlockEntry.ts";
import type { UtilsEditor } from "./types.ts";

/**
 * Plugin này chung cấp các phương thức tiện ích cho editor, mục đích của
 * các phương thức này là cho phép các phương thức của các plugin khác được
 * sử dụng chung
 *
 * Sử dụng: `editor.<tên tiện ích>`
 */
export default function withUtilsEditor(
	editor: Editor & UtilsEditor,
): Editor & UtilsEditor {
	editor.buildBlock = (additionalProps) => buildBlock(additionalProps);
	editor.generateId = () => uuidv4();
	editor.ensureBlockId = (block) => ensureBlockId(block);

	editor.getBlockById = (id) => getBlockByid(editor, id);
	editor.getBlockEntryById = (id) => getBlockEntryById(editor, id);
	editor.getBlockPathById = (id) => getBlockPathById(editor, id);
	editor.getBlockContentById = (id) => getBlockContentById(editor, id);

	editor.getCurrentBlock = () => getCurrentBlock(editor);
	editor.getCurrentBlockEntry = () => getCurrentBlockEntry(editor);
	editor.getCurrentBlockPath = () => getCurrentBlockPath(editor);
	editor.getCurrentBlockType = () => getCurrentBlockType(editor);
	editor.getCurrentBlockContent = () => getCurrentBlockContent(editor);

	editor.getLastBlock = () => getLastBlock(editor);
	editor.getLastBlockEntry = () => getLastBlockEntry(editor);
	editor.getLastBlockPath = () => getLastBlockPath(editor);

	editor.isCurrentBlockEmpty = () => isCurrentBlockEmpty(editor);

	return editor;
}
