import { Editor, Transforms } from "slate";

/**
 * Nới một paragraph mới, (hành vi mặc định của nhiều block khi nhấn phím enter).
 * Logic nó khác với các logic insert thuần là nó còn xử lý việc chia block, cho
 * cho phép "tách" block chứ không chỉ lại tạo một block paragraph mới
 */
export default function handleAppendParagraph(editor: Editor) {
  const { selection } = editor;
  const path = editor.getCurrentBlockPath();

  if (!path || !selection) return false;

  const isEnd = Editor.isEnd(editor, selection.anchor, path);

  if (isEnd) {
    editor.insertBlock("paragraph");
  } else {
    Transforms.splitNodes(editor);
    Transforms.setNodes(editor, { type: "paragraph" });
  }
}
