import type { SlashMenuItem } from "@/components/Editor/SlashMenu/SlashMenuItems.tsx";
import type { KeyboardEvent } from "react";

export default interface SlashEditor {
  /**
   * Xử lý việc mở slash command menu khi người dùng gõ "/" trên editor
   *
   * @returns `true` nếu như mở được menu, `false` nếu ngược lại
   */
  handleOpenSlashCommand: () => boolean;

  /**
   * Xử lý việc đóng slash command menu khi nó đang mở, và người dùng
   * gõ phím "ESC"
   *
   * @returns `true` nếu như đóng được menu, `false` nếu ngược lại
   */
  handleCloseSlashCommand: (event: KeyboardEvent) => boolean;

  /**
   * Xử lý việc chọn một item từ slash command menu
   *
   * - Nếu block hiện tại rỗng: chuyển đổi block hiện tại thành loại được chọn
   * - Nếu block hiện tại không rỗng: xoá slash command text và chèn block mới
   *
   * @param item - Item được chọn từ slash command menu
   * @returns `true` nếu xử lý thành công, `false` nếu ngược lại
   */
  handleSlashCommandSelection: (item: SlashMenuItem) => boolean;
}
