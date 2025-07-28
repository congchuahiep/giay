import { Editor, Range } from "slate";

/**
 * Xử lý tình huống khi người dùng chọn một vùng chọn (tức bôi đen) trên trình soạn thảo
 * và bấm xoá
 *
 * Nếu như toàn bộ tài liệu được chọn, thực thi xoá tất cả nội dung, nếu không, để slate
 * xử lý mặc định
 *
 * @param editor Đối tượng Editor của Slate.
 */
export default function handleDeleteFragment(editor: Editor): boolean {
  const { selection } = editor;
  if (!selection) return false;

  // Kiểm tra select all
  const start = Editor.start(editor, []);
  const end = Editor.end(editor, []);

  if (Range.equals({ anchor: start, focus: end }, selection)) {
    editor.delete();
    return true;
  }

  return false; // Để Slate xử lý mặc định
}
