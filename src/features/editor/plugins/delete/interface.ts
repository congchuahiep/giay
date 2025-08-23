import type { KeyboardEvent } from "react";

/**
 * Interface cung cấp các hành vi xoá tuỳ chỉnh trong Slate editor, plugin của interface này cũng ghi đè lại các
 * phương thức mặc định như `editor.deleteBackward`, `editor.deleteForward`, `editor.deleteFragment` giúp điều
 * chỉnh cách editor xử lý việc xoá nội dung, xoá node,...
 */
export default interface DeleteEditor {
  /**
   * Mặc định, khi con trỏ nằm ở vị trí đầu tiên của tài liệu (cụ thể tại `{ path: [0, 0], offset: 0 }`),
   * việc nhấn phím "Backspace" trong Slate sẽ không thực hiện hành động nào. Tuy nhiên, trong một số trường hợp
   * như block đầu tiên là void hoặc có định dạng đặc biệt, ta muốn chuyển block này về dạng mặc định (ví dụ: paragraph)
   * khi nhấn "Backspace"
   *
   * Phương thức `handleDeleteFirstBlock` giải quyết nhu cầu này bằng cách kiểm tra vị trí con trỏ, nếu đang ở đầu tài liệu
   * thì sẽ reset block hiện tại về định dạng mặc định. Hàm này không gọi `preventDefault` trên sự kiện,
   * do đó các hành vi mặc định của Slate (`editor.deleteBackward`, `editor.deleteForward`, `editor.deleteFragment`)
   * vẫn sẽ được thực thi sau khi handler này chạy xong.
   */
  handleDeleteFirstBlock: (event: KeyboardEvent) => void;
}
