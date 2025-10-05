import { type Editor, Transforms } from "slate";

export default function deleteBlockById(editor: Editor, id: string): boolean {
	const path = editor.getBlockPathById(id);

	if (path) {
		Transforms.removeNodes(editor, { at: path });
		return true;
	}
	return false;
}
