import isSelectAllBlock from "@/features/editor/select/isSelectAllBlock";
import type { KeyboardEvent } from "react";
import { Editor, Transforms } from "slate";

export function handleDeleteFirstBlock(editor: Editor, event: KeyboardEvent) {
  // Chỉ xử lý delete keys
  if (!["Backspace", "Delete"].includes(event.key)) {
    return false;
  }

  // Trường hợp đặc biệt, khi người dùng select toàn bộ nội dung thì tức là
  // người dùng muốn xoá sạch mọi thứ, ta thực hiện điều đó bằng
  if (isSelectAllBlock(editor)) {
    event.preventDefault();
    // Tối ưu: Xóa toàn bộ và thay thế bằng một node paragraph duy nhất
    Editor.withoutNormalizing(editor, () => {
      // Xóa tất cả children
      for (let i = editor.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(editor, { at: [i] });
      }

      // Chèn một paragraph trống
      Transforms.insertNodes(
        editor,
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
        { at: [0] }
      );
    });
    return;
  }

  // Kiểm tra nếu selection đang ở vị trí [0, 0] offset 0
  const { selection } = editor;
  if (
    selection &&
    selection.anchor.path.length === 2 &&
    selection.anchor.path[0] === 0 &&
    selection.anchor.path[1] === 0 &&
    selection.anchor.offset === 0
  ) {
    // Đang ở vị trí đầu tiên của editor
    Transforms.setNodes(editor, { type: "paragraph" });
    return;
  }

  // Để Slate xử lý theo mặc định:
  // `editor.deleteBackward`,
  // `editor.deleteForward`,
  // `editor.deleteFragment`
}
