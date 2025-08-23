import { Editor, Element, Transforms } from "slate";
import type { KeyboardEvent } from "react";
import isSelectFullBlock from "@/features/editor/plugins/select/isSelectFullblock";

/**
 * Mở rộng selection hiện tại trong Slate editor để selection bao trọn các block element đầy đủ
 *
 * - Nếu selection đã bao trọn toàn bộ các block, hàm sẽ bỏ chọn (clear selection)
 * - Nếu selection nằm trong một block duy nhất, hàm sẽ mở rộng selection để chọn toàn bộ block đó
 * - Nếu selection trải dài nhiều block, hàm sẽ mở rộng selection để chọn từ đầu block đầu tiên đến cuối block cuối cùng
 *
 * @param editor - Đối tượng Slate editor.
 * @param event - Sự kiện bàn phím kích hoạt việc mở rộng vùng chọn. Hàm sẽ ngăn hành động mặc định của sự kiện này
 */
export default function expandSelectionToFullBlocks(
  editor: Editor,
  event: KeyboardEvent
) {
  const { selection } = editor;
  if (!selection) return;

  // Xem selection hiện tại bao quanh bao nhiêu block
  const blocks = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    })
  );

  event.preventDefault();

  if (isSelectFullBlock(editor)) {
    // Select all block
    Transforms.select(editor, []);
    return;
  }

  // Selection đang nằm trong duy nhất 1 block → chỉ select toàn bộ block đó
  // Lấy path đầu và path cuối
  const [, firstPath] = blocks[0];
  const [, lastPath] = blocks[blocks.length - 1];

  // Tạo range bao trọn từ đầu block đầu đến cuối block cuối
  const start = Editor.start(editor, firstPath);
  const end = Editor.end(editor, lastPath);
  const range = { anchor: start, focus: end };

  Transforms.select(editor, range);
}
