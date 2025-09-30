import {
	type Editor,
	type Element,
	Node,
	Path,
	type Range,
	Transforms,
} from "slate";

/**
 * Xử lý việc người dùng bấm phím "Backspace", cụ thể là xử lý việc người dùng xoá nội dung
 * tài liệu. Tuỳ vào vị trí con trỏ thực hiện và block hiện tại đang thực hiện sẽ thực thi
 * các thao tác khác nhau
 *
 * @param event Sự kiện bàn phím (KeyboardEvent) khi nhấn Backspace
 * @param editor Đối tượng Editor của Slate
 */
export default function handleDeleteBackward(editor: Editor): boolean {
	const { selection } = editor;

	// Early return nếu không có selection
	if (!selection) return false;

	// Xử lý selection collapsed
	return handleCollapsedSelection(editor, selection);
}

/**
 * Xử lý sự kiện Backspace khi selection đang bị thu gọn (collapsed):
 *
 * Các trường hợp xử lý Backspace khi selection đang bị thu gọn hầu hết chỉ xử
 * lý trong trường hợp con trỏ đang nằm ở đầu block:
 * - Nếu con trỏ đang ở đầu block đặc biệt (tức block không phải paragraph),
 * chuyển block đó về kiểu paragraph
 * - Nếu con trỏ đang ở đầu block (bất kỳ loại block nào), mà block trên nó là
 * một void block -> chuyển selection sang block trên
 * - Nếu không phải trường hợp trên, thực hiện merge với block liền trước nếu
 * có thể
 *
 * @param event Sự kiện bàn phím (KeyboardEvent) khi nhấn Backspace.
 * @param editor Đối tượng Editor của Slate.
 * @param selection Vùng selection hiện tại (Range).
 * @param currentBlockType Kiểu block hiện tại, hoặc null nếu không xác định.
 */
function handleCollapsedSelection(editor: Editor, selection: Range): boolean {
	const currentBlockType = editor.getCurrentBlockType();
	const isAtBlockStart = selection.focus.offset === 0;
	const isSpecialBlock = currentBlockType !== "paragraph";

	if (!isAtBlockStart) return false;

	// Reset block đặc biệt thành paragraph khi con trỏ đang ở đầu block
	if (isSpecialBlock && isAtBlockStart) {
		console.log("Resetting block to paragraph");
		Transforms.setNodes(editor, { type: "paragraph" });
		return true;
	}
	const currentPath = editor.getCurrentBlockPath();
	if (!currentPath) return false;

	// Tìm block phía trước
	try {
		const prevPath = Path.previous(currentPath);
		const prevBlock = Node.get(editor, prevPath) as Element | undefined;

		// Nếu không có block phía trước hoặc block phía trước không rỗng
		if (!prevBlock || Node.string(prevBlock).length !== 0) {
			return false;
		}

		// Nếu block phía trước là void thì chuyển selection sang đó
		if (prevBlock && editor.isVoid(prevBlock)) {
			editor.select(prevPath);
			return true;
		}

		// Nếu block phía trước rỗng, giữ lại block đó thay vì để Slate tự động xoá
		// Chuyển kiểu block hiện tại sang kiểu của block phía trước, sau đó xoá block phía trước
		editor.setNodes({ type: prevBlock.type });
		editor.removeNodes({ at: prevPath });
		return true;
	} catch {
		console.log("Không có block phía trên để xoá.");
		return false;
	}
}
