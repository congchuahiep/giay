import { type Editor, type Element, Node, Path } from "slate";

/**
 * Xử lý việc xoá block phía sau
 *
 * Xử lý việc xoá nếu block phía sau là void thì chuyển selection sang block đó
 * @param editor
 * @returns
 */
export default function handleDeleteForward(editor: Editor): boolean {
	const currentPath = editor.getCurrentBlockPath();
	if (!currentPath) return false;

	try {
		// Tìm block phía sau
		const nextPath = Path.next(currentPath);
		const prevBlock = Node.get(editor, nextPath) as Element | undefined;

		// Nếu không có block phía sau
		if (!prevBlock) {
			return false;
		}

		// Nếu block phía sau là void thì chuyển selection sang đó
		if (prevBlock && editor.isVoid(prevBlock)) {
			editor.select(nextPath);
			return true;
		}
		return false;
	} catch {
		return false;
	}
}
