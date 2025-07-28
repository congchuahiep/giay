import insertNumberedList from "@/features/editor/insert/insertNumberedList";
import insertParagraph from "@/features/editor/insert/insertParagraph";
import type { BlockType } from "@/features/editor/types";
import { type KeyboardEvent } from "react";
import { Editor } from "slate";

/**
 * Xử lý việc bấm enter hoặc shift-enter, vì mỗi block có một cách khi bấm enter
 * sẽ thực hiện các hành vi khác nhau, ví dụ:
 *
 * - `h1`: Bấm enter sẽ tạo ra một paragraph mới, shift-enter sẽ tạo xuống dòng (soft-break)
 * - `code`: Bấm enter sẽ tạo xuống dòng (soft-break), enter sẽ tạo ra một paragraph mới
 * - `bulletList`: Bấm enter sẽ tạo ra một bulletList mới (hành vi mặc định của slate),
 *    shift enter sẽ xuống dòng (soft-break)
 *
 * Mặc định khi bấm enter sẽ tạo một paragraph mới và shift-enter sẽ là xuống dòng
 *
 * @param event
 * @param editor
 * @param shift
 */
export default function handleEnter(
  editor: Editor,
  event: KeyboardEvent,
  shift: boolean
) {
  const currentBlockType = editor.getCurrentBlockType();

  if (currentBlockType) {
    const blockHandler = getHandlerForBlockType(currentBlockType as BlockType);
    const handler = shift
      ? blockHandler.handleShiftEnter
      : blockHandler.handleEnter;

    // Nếu handler là null, không làm gì (để Slate xử lý mặc định)
    if (handler === null) {
      return;
    }

    if (handler) {
      event.preventDefault();
      handler(editor);
    }
  }
}

/**
 * Interface để xử lý hành vi sẽ được chạy khi nhấn enter hay shift-enter
 */
export interface BlockEnterHandler {
  handleEnter: ((editor: Editor) => boolean | void) | null;
  handleShiftEnter: ((editor: Editor) => boolean | void) | null;
}

/**
 * Hàm đặc biệt để báo hiệu không làm gì (để Slate xử lý mặc định)
 */
const NO_ACTION = null;

// Hành vi mặc định
const defaultHandler: BlockEnterHandler = {
  handleEnter: insertParagraph,
  handleShiftEnter: softBreakline,
};

// Đăng ký các hành vi khác mặc định
const BlockEnterHandlerOverrides: Partial<
  Record<BlockType, Partial<BlockEnterHandler>>
> = {
  paragraph: { handleEnter: NO_ACTION },
  bulletList: { handleEnter: NO_ACTION },
  numberedList: { handleEnter: insertNumberedList },
  checkList: { handleEnter: NO_ACTION },
  code: { handleEnter: softBreakline, handleShiftEnter: insertParagraph },
  divider: { handleShiftEnter: insertParagraph },
};

/**
 * Lấy handler cho một block type
 */
function getHandlerForBlockType(blockType: BlockType): BlockEnterHandler {
  const override = BlockEnterHandlerOverrides[blockType];

  return {
    handleEnter:
      override?.handleEnter !== undefined
        ? override.handleEnter
        : defaultHandler.handleEnter,
    handleShiftEnter:
      override?.handleShiftEnter !== undefined
        ? override.handleShiftEnter
        : defaultHandler.handleShiftEnter,
  };
}

/**
 * Tạo một soft-break, tức xuống dòng trong block
 *
 * @param editor
 */
export function softBreakline(editor: Editor) {
  editor.insertText("\n");
}
