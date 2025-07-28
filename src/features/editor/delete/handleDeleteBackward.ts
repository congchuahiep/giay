import {
  Editor,
  Element,
  Node,
  Path,
  Range,
  Transforms,
  type BaseSelection,
  type NodeEntry,
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
 * - Nếu con trỏ đang ở đầu block đặc biệt (tức block không phải paragraph), chuyển block
 * đó về kiểu paragraph
 * - Nếu không phải trường hợp trên, thực hiện merge với block liền trước nếu có thể
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

  // Reset block đặc biệt thành paragraph khi con trỏ đang ở đầu block
  if (isSpecialBlock && isAtBlockStart) {
    Transforms.setNodes(editor, { type: "paragraph" });
    return true;
  }

  // Nếu con trỏ đang ở đầu Xử lý merge với block trước đó
  return handleBackspaceMergeToPreviousBlock(editor, selection);
}

/**
 * Đối với trường hợp Node bên trên không có giá trị nào, mặc định Slate sẽ xoá
 * node đó luôn (bruh), thế nên ở đây ta viết thêm 1 chút logic ngăn chặn việc
 * Slate tự động xoá node bên trên nếu nó rỗng
 *
 * **Tin tao đi, nhờ có chức năng này là editor tăng life quality lên rất là nhiều đó 😉**
 *
 * @param event Sự kiện bàn phím (KeyboardEvent) khi nhấn phím Backspace.
 * @param editor Đối tượng Editor của Slate.
 * @param selection Vị trí selection hiện tại trong editor.
 */
function handleBackspaceMergeToPreviousBlock(
  editor: Editor,
  selection: BaseSelection
): boolean {
  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  // Kiểm tra nếu block hiện tại là paragraph & rỗng
  const nodeEntry = Editor.above(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  }) as NodeEntry | undefined;

  if (!nodeEntry) {
    return false;
  }

  const [currentBlock, currentPath] = nodeEntry;

  // Chỉ xử lý nếu con trỏ đang ở đầu block
  const isStart = Editor.isStart(editor, selection?.anchor, currentPath);
  if (!isStart) {
    return false;
  }

  // Tìm block phía trước
  try {
    const prevPath = Path.previous(currentPath);
    const prevBlock = Node.get(editor, prevPath) as Element | undefined;

    if (
      !prevBlock ||
      Node.string(prevBlock).length !== 0 ||
      prevBlock.type === "divider"
    ) {
      return false;
    }

    // Thực hiện logic merge block
    const text = Node.string(currentBlock); // Lấy text trong block hiện tại
    Transforms.removeNodes(editor, { at: currentPath }); // Xoá block hiện tại
    Transforms.insertText(editor, text, { at: Editor.end(editor, prevPath) }); // Chèn text đó vào block rỗng

    // Đặt lại selection về block phía trên
    const newPoint = Editor.start(editor, prevPath);
    Transforms.select(editor, newPoint);
    return true;
  } catch {
    console.log("Hihi, còn cái ở trên đâu mà đòi xoá z tròi?");
    return false;
  }
}
