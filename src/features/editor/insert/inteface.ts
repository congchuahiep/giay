import type { BlockType } from "@/features/editor/types";
import type { KeyboardEvent } from "react";

export default interface InsertEditor {
  /**
   * Xử lý việc bấm enter hoặc shift-enter, vì mỗi block có một cách khi bấm enter
   * sẽ thực hiện các hành vi khác nhau, ví dụ:
   * - `h1`: Bấm enter sẽ tạo ra một paragraph mới, shift-enter sẽ tạo xuống dòng (soft-break)
   * - `code`: Bấm enter sẽ tạo xuống dòng (soft-break), enter sẽ tạo ra một paragraph mới
   * - `bulletList`: Bấm enter sẽ tạo ra một bulletList mới (hành vi mặc định của slate),
   *    shift enter sẽ xuống dòng (soft-break)
   *
   * Mặc định khi bấm enter sẽ tạo một paragraph mới và shift-enter sẽ là xuống dòng
   */
  handleEnter: (event: KeyboardEvent, shift: boolean) => void;

  /**
   * Chèn một block mới vào editor tại vị trí xác định. Hàm này chỉ thực
   * thi công việc chèn block, chứ không thực hiện việc tách block
   *
   * @param editor - Đối tượng editor hiện tại.
   * @param blockType - Loại block cần chèn.
   * @param configs - Cấu hình cho việc chèn block
   * @param additionalProps - Các thuộc tính bổ sung cho block mới.
   * @returns {boolean} Trả về `true` nếu chèn thành công, ngược lại trả về `false`.
   */
  insertBlock: (
    blockType: BlockType,
    configs?: InsertBlockConfigProps,
    additionalProps?: Record<string, any>
  ) => boolean;

  /**
   * Nới một paragraph mới, (hành vi mặc định của nhiều block khi nhấn phím enter).
   * Logic nó khác với các logic insert thuần là nó còn xử lý việc chia block, cho
   * cho phép "tách" block chứ không chỉ lại tạo một block paragraph mới
   */
  handleAppendParagraph: () => void;

  /**
   * Chèn một danh sách đánh số vào vị trí hiện tại của con trỏ trong editor.
   * Nếu con trỏ ở cuối phần tử, sẽ chèn một danh sách mới; nếu không, sẽ tách và chuyển đổi phần tử hiện tại thành danh sách đánh số.
   *
   * @param editor Editor Slate để thao tác.
   */
  insertNumberedList: () => void;
}

export interface InsertBlockConfigProps {
  /**
   * Chèn block phía bên trên
   */
  reverse?: boolean;
}
