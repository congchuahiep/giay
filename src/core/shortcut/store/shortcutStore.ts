import getHotkeyFromEvent from "@/core/shortcut/utils/getHotketFromEvent";
import { type KeyboardEvent } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ShortcutAction<T = any> = (
  event: KeyboardEvent,
  context: T
) => boolean | void;

/**
 * Lưu ý: Mỗi bộ extension chỉ có các phím tắt tồn tại duy nhất một lần.
 * Nếu có nhiều extension cùng đăng ký một phím tắt, thì chỉ có extension
 * có độ ưu tiên (priority) cao nhất được kích hoạt.
 *
 * Ví dụ:
 * - Extension A có priority = 10, đăng ký "mod+b" cho action "toggle-bold"
 * - Extension B có priority = 5, đăng ký "mod+b" cho action "toggle-italic"
 * Khi người dùng nhấn "mod+b", chỉ có action "toggle-bold" của extension A được gọi.
 */
export interface ShortcutExtension<T = any> {
  /**
   * Tên của bộ shortcut muốn đăng ký
   */
  name: string;

  /**
   * Thứ tự ưu tiên của bộ shortcut
   */
  priority: number;

  /**
   * Yêu cầu phạm vi sử dụng (scope) khi đăng ký, ví dụ "editor", "sidebar", "global"
   * Mặc định là "global", tức là không cần scope
   *
   * Khi một extension có scope, thì nó chỉ được kích hoạt khi scope đó đang active,
   *
   * Lưu ý: Nếu một extension không yêu cầu scope (scope = "global"),
   * thì nó sẽ luôn được kích hoạt trong mọi scope
   *
   * Ví dụ:
   * - Một extension chỉ dành cho editor, thì cần đặt scope = "editor"
   * - Một extension dùng chung cho toàn app, thì đặt scope = "global"
   *
   * Mục đích của thuộc tính này là để tránh xung đột phím tắt giữa các phần khác nhau
   * của ứng dụng, đồng thời giúp quản lý các phím tắt theo từng ngữ cảnh (context) cụ thể.
   */
  scope?: string | "global";

  /**
   * Liệt kê cách bộ hành vi, cấu trúc: <tên hành vi, (event, editor) => boolean>
   */
  actions: Record<string, ShortcutAction<T>>;

  /**
   * Context truyền vào cho các action handler khi thực thi.
   */
  context?: T;

  /**
   * Cấu hình phím tắt cho extension này. Với cú pháp là <phím tắt, action>
   *
   * Ví dụ:
   * ```ts
   * {
   *   "mod+b": "toggle-bold"
   * }
   * ```
   */
  keySettings?: Record<string, string>;
}

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
interface ShortcutStore {
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
   * Thiết lập scope đang active.
   *
   * @param scope
   * @returns
   */
  setActiveScope: (scope: string) => void;

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

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
export const useShortcutStore = create<ShortcutStore>()(
  devtools(
    (set, get) => ({
      // Khởi tạo các state
      extensions: [],
      activeScope: "",

      /**
       * Đăng ký một extension phím tắt mới vào hệ thống.
       * Các extension sẽ được sắp xếp lại theo thứ tự ưu tiên (priority).
       * @param extension extension phím tắt cần đăng ký
       */
      registerExtension: (extension) =>
        set((state) => {
          const newExtensions = [...state.extensions, extension];
          newExtensions.sort((a, b) => b.priority - a.priority);
          return { extensions: newExtensions };
        }),

      /**
       * Hủy đăng ký một extension phím tắt theo tên.
       * @param name Tên extension cần hủy đăng ký
       */
      unregisterExtension: (name) =>
        set((state) => ({
          extensions: state.extensions.filter((p) => p.name !== name),
        })),

      setActiveScope: (scope) => set(() => ({ activeScope: scope })),

      /**
       * Xử lý sự kiện nhấn phím. Tức là xử lý phím tắt đóooo
       *
       * @param event Sự kiện bàn phím
       * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
       */
      handleKeyDown: (event) => {
        const { extensions, activeScope } = get();
        const eventHotkey = getHotkeyFromEvent(event as any);

        // Helper to find the highest priority extension with this hotkey in a given scope
        const findMatchingExtension = (scope: string) =>
          extensions
            .filter(
              (ext) =>
                (ext.scope ?? "global") === scope &&
                !!ext.keySettings?.[eventHotkey]
            )
            .sort((a, b) => b.priority - a.priority)[0];

        // Thử tìm extension phù hợp trong active scope trước, sau đó đến global scope
        // Nếu tìm thấy, gọi action tương ứng và trả về true
        // Nếu không tìm thấy, trả về false
        // Lưu ý: Có thể mở rộng để kiểm tra nhiều scope khác nhau nếu cần (Cái này đánh dấu cho mai sau nè)
        // Ví dụ: [activeScope, "sidebar", "global"]
        // Trong đó "sidebar" có thể là một scope khác đang active
        // Cách này giúp hỗ trợ nhiều scope hơn thay vì chỉ một active scope
        const scopesToCheck = [activeScope, "global"];

        for (const scope of scopesToCheck) {
          const extention = findMatchingExtension(scope);
          if (!extention) continue;
          const actionName = extention.keySettings?.[eventHotkey];
          const action = actionName && extention.actions[actionName];
          if (action) {
            return action(event, extention.context);
          }
        }

        return false;
      },

      getExtensions: () => {
        return get().extensions;
      },

      /**
       * Lấy danh sách tất cả các action có sẵn từ các extension đã đăng ký.
       * @returns Mảng các đối tượng chứa `{extension, action}`
       */
      getAvailableActions: () => {
        const { extensions: extensions } = get();
        return extensions.flatMap((extension) =>
          Object.keys(extension.actions).map((action) => ({
            extension: extension.name,
            action,
          }))
        );
      },
    }),
    {
      name: "shortcut-store",
    }
  )
);
