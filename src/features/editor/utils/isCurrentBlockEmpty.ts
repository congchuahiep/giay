import { Editor, Element, Node } from "slate";

export default function isCurrentBlockEmpty(editor: Editor): boolean {
	const { selection } = editor;
	if (!selection) return false;

	const [block] =
		Editor.above(editor, {
			match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
		}) ?? [];

	if (block && Element.isElement(block)) {
		const text = Node.string(block);
		return text.trim() === ""; // trim() để bỏ khoảng trắng đầu cuối
	}

	return false;
}
