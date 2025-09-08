import type { ShortcutAction, ShortcutExtension } from "@/core/shortcut";

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
export default interface ShortcutStore {
  /**
   * Các extension phím tắt đã được đăng ký
   */
  extensions: ShortcutExtension[];

  /**
   * Scope hiện đang active, ví dụ "editor", "sidebar", "global". Ở một thời điểm
   * chỉ có một scope được active.
   */
  activeScope: string;

  /**
   * Đăng ký một bộ shortcut extension phím tắt mới vào hệ thống.
   * Các extension sẽ được sắp xếp lại theo thứ tự ưu tiên (priority).
   * 
   * Không khuyến khích tự đăng ký extension, hãy đăng ký bằng hook `useRegisterShortcut`
   *
   * @param extension - Extension phím tắt cần đăng ký
   * @returns
   */
  registerExtension: (extension: ShortcutExtension<any>) => void;

  /**
   * Hủy đăng ký một extension phím tắt theo tên.
   * @param name - Tên extension cần hủy đăng ký
   */
  unregisterExtension: (name: string) => void;

  /**
   * Thiết lập scope đang active. Nếu không truyền scope, thì mặc định sẽ là "global"
   *
   * @param scope
   * @returns
   */
  setActiveShortcutScope: (scope?: string) => void;

  /**
   * Cập nhật cấu hình các phím tắt.
   * @param config - Đối tượng cấu hình mới sẽ được gộp vào cấu hình hiện tại
   */
  updateConfig: (config: Record<string, string>) => void;

  /**
   * Xử lý sự kiện nhấn phím.
   *
   * @param event - Sự kiện bàn phím
   * @param scoop - Tên scope hiện tại
   * @param context - Đối tượng context tương ứng với scope
   * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
   */
  handleKeyDown: (
    event: KeyboardEvent,
    scoop?: string,
    context?: any
  ) => boolean;

  /**
   * Lấy danh sách các extension phím tắt đã đăng ký.
   * @returns Danh sách các extension phím tắt
   */
  getExtensions: () => ShortcutExtension[];

  /**
   * @returns Danh sách tất cả các phím tắt hiện tại cùng action và extension tương ứng
   */
  getShortcuts: () => Array<{
    hotkey: string;
    action: string;
    extension: string;
  }>;

  /**
   *
   * @returns
   */
  getAvailableActions: () => Array<{ extension: string; action: string }>;

  // New methods
  registerScope: (scope: string, context: any) => void;
  unregisterScope: (scope: string) => void;

  // Private helpers (có thể expose để debug)
  findActionHandlers: (actionName: string, scop?: string) => ShortcutAction[];
}
