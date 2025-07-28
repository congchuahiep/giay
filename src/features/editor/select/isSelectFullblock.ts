import { Editor, Element, Range } from "slate";

export default function isSelectFullBlock(editor: Editor): boolean {
	const { selection } = editor;
	if (!selection) return false;

	// Tìm tất cả block trong selection
	const blocks = Array.from(
		Editor.nodes(editor, {
			at: selection,
			match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
		})
	);

	if (blocks.length === 0) return false;

	// Lấy path đầu và path cuối
	const [, firstPath] = blocks[0];
	const [, lastPath] = blocks[blocks.length - 1];

	// Tạo range bao trọn từ start block đầu → end block cuối
	const start = Editor.start(editor, firstPath);
	const end = Editor.end(editor, lastPath);
	const fullRange = { anchor: start, focus: end };

	// So sánh selection hiện tại với fullRange
	return Range.equals(selection, fullRange);
}
