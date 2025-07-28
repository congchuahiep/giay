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
   * Tạo một paragraph mới, (hành vi mặc định của nhiều block khi nhấn phím enter)
   */
  insertParagraph: () => void;

  /**
   * Chèn một danh sách đánh số vào vị trí hiện tại của con trỏ trong editor.
   * Nếu con trỏ ở cuối phần tử, sẽ chèn một danh sách mới; nếu không, sẽ tách và chuyển đổi phần tử hiện tại thành danh sách đánh số.
   *
   * @param editor Editor Slate để thao tác.
   */
  insertNumberedList: () => void;
}
