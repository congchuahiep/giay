import type { SlashMenuItem } from "@/components/Editor/SlashMenu/SlashMenuItems";
import type { SlashMenuState } from "./types/SlashMenuState";
import type { SafeMenuPlacement } from "@/types";

export default interface SlashEditor {
  /**
   * Phương thức này dùng để bắt sự kiện khi người dùng gõ "/" và tính toán vị trí, kích thước menu
   *
   * @param openSlashCommand Hàm này mới thực sự để mở menu, mục đích của hàm này là để
   * @param slashRef Ref của phần tử DOM chứa slash command menu (để tính vị trí hiển thị menu)
   * @param slashContainerRef Ref của phần tử DOM chứa danh sách item trong
   * slash command menu (để tính kích thước của )
   *
   * @returns `true` nếu như mở được menu, `false` nếu ngược lại
   */
  handleOpenSlashMenu: (
    openSlashCommand: (
      position: SafeMenuPlacement | undefined,
      anchorOffset: number
    ) => void,
    slashRef: React.RefObject<HTMLDivElement | null>,
    slashContainerRef: React.RefObject<HTMLDivElement | null>
  ) => boolean;

  /**
   * Xử lý việc đóng slash command menu khi nó đang mở, và người dùng
   * gõ phím "ESC"
   *
   * @returns `true` nếu như đóng được menu, `false` nếu ngược lại
   */
  // handleCloseSlashCommand: (event: KeyboardEvent) => boolean;

  /**
   * Xử lý việc chọn một item từ slash command menu
   *
   * - Nếu block hiện tại rỗng: chuyển đổi block hiện tại thành loại được chọn
   * - Nếu block hiện tại không rỗng: xoá slash command text và chèn block mới
   *
   * @param item - Item được chọn từ slash command menu
   * @param slashMenuState - State hiện tại của slash command menu
   * @param closeSlashCommand - Hàm dùng để đóng slash command menu
   * @returns `true` nếu xử lý thành công, `false` nếu ngược lại
   */
  handleSelectSlashItem: (
    item: SlashMenuItem,
    slashMenuState: SlashMenuState,
    closeSlashCommand: () => void
  ) => boolean;
}
