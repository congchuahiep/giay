import type { KeyboardEvent } from "react";

/**
 * Giao diện cho trình soạn thảo Markdown, cung cấp các phương thức để xử lý các thao tác đặc thù của trình soạn thảo.
 */
export default interface MarkdownEditor {
  /**
   * Xử lý các phím tắt dành riêng cho việc soạn thảo Markdown.
   *
   * @param event Sự kiện bàn phím được kích hoạt bởi người dùng.
   * @returns Trả về true nếu phím tắt đã được xử lý, ngược lại trả về false.
   */
  handleMarkdownShortcut: (event: KeyboardEvent) => boolean;

  /**
   * Xử lý phím tắt để chèn hoặc thao tác với divider (đường phân cách) trong Markdown.
   *
   * @param event Sự kiện bàn phím được kích hoạt bởi người dùng.
   * @returns Trả về true nếu phím tắt đã được xử lý, ngược lại trả về false.
   */
  handleDividerShortcut: (event: KeyboardEvent) => boolean;
}
