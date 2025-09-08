import type { SafeMenuPlacement } from "@/types";

/**
 * Các hành động (actions) mà SlashCommandManager có thể thực hiện
 */
export type SlashMenuActions = {
  /**
   * Mở slash command menu
   */
  open: (position?: SafeMenuPlacement, anchorOffset?: number) => void;

  /**
   * Đóng slash command menu
   */
  close: () => void;

  /**
   * Cập nhật search query và reset selected index
   */
  updateSearchQuery: (query: string) => void;

  /**
   * Cập nhật selected index
   */
  setSelectedIndex: (index: number) => void;

  /**
   * Reset về trạng thái ban đầu
   */
  reset: () => void;
};
