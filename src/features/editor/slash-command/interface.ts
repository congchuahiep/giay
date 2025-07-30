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
}
