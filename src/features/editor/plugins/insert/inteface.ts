import type { BlockType } from "@/features/editor/types";
import type { ElementBlock } from "@/features/editor/types/block.ts";
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
   * Nếu cần tách block, hãy sử dụng `insertBlockAndBreak()`
   *
   * @param editor - Đối tượng editor hiện tại.
   * @param additionalProps - Các thuộc tính bổ sung cho block mới.
   * @param configs - Cấu hình cho việc chèn block
   * @returns {boolean} Trả về `true` nếu chèn thành công, ngược lại trả về `false`.
   */
  insertBlock: (
    additionalProps?: Partial<ElementBlock>,
    configs?: InsertBlockConfigProps
  ) => boolean;

  /**
   * Ngắt dòng và chèn một khối mới vào vị trí hiện tại của con trỏ trong editor.
   * Hàm này dùng để ghi đè lại hành vi khi người dùng nhấn phím "Enter" trong slate,
   * cho phép ngắt và tạo dòng mới.
   *
   * Hàm này kiểm tra vị trí của con trỏ trong khối hiện tại:
   * - Nếu con trỏ ở cuối khối, sẽ chèn một khối mới sau khối hiện tại.
   * - Nếu con trỏ ở đầu khối, sẽ chèn một khối mới trước khối hiện tại.
   * - Nếu con trỏ ở giữa khối, sẽ tách khối tại vị trí con trỏ và chuyển đổi phần sau
   * thành loại khối mới.
   *
   * @param editor Editor hiện tại.
   * @param blockType Loại khối cần chèn (mặc định là "paragraph").
   * @param additionalProps - Các thuộc tính bổ sung cho block mới.
   * @returns {boolean} Trả về false nếu không thể chèn, ngược lại không trả về gì.
   */
  insertBlockAndBreak: (
    blockType?: BlockType,
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
