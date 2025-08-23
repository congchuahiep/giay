import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type KeyboardEvent } from "react";
import { type Editor } from "slate";
import isHotkey from "is-hotkey";

export type ShortcutAction = (
  event: KeyboardEvent,
  editor: Editor
) => boolean | void;

export interface ShortcutExtension {
  /**
   * Tên của bộ shortcut muốn đăng ký
   */
  name: string;

  /**
   * Thứ tự ưu tiên của bộ shortcut
   */
  priority: number;

  /**
   * Liệt kê cách bộ hành vi, cấu trúc: <tên hành vi, (event, editor) => boolean>
   */
  actions: Record<string, ShortcutAction>;

  /**
   * Đáng lẽ cái này phải chết rồi
   *
   * @deprecated
   * @param event
   * @param editor
   * @returns
   */
  onKeyDown?: (event: KeyboardEvent, editor: Editor) => boolean | void;
}

/**
 * Sử dụng để thiết lập shortcut
 */
export interface ShortcutConfig {
  [hotkey: string]: string; // hotkey -> action name
}

/**
 * Quản lý các extension phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký extension, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
interface ShortcutStore {
  // State
  extensions: ShortcutExtension[];
  config: ShortcutConfig;

  // Actions
  registerExtension: (extension: ShortcutExtension) => void;
  unregisterExtension: (name: string) => void;
  updateConfig: (config: ShortcutConfig) => void;
  handleKeyDown: (event: KeyboardEvent, editor: Editor) => boolean;
  getShortcuts: () => Array<{ hotkey: string; action: string; extension: string }>;
  getAvailableActions: () => Array<{ extension: string; action: string }>;

  // Private helpers (có thể expose để debug)
  findActionHandlers: (actionName: string) => ShortcutAction[];
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
      config: {},

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
          extensions: state.extensions.filter((p) => p.name !== name)
        })),

      /**
       * Cập nhật cấu hình các phím tắt.
       * @param config Đối tượng cấu hình mới sẽ được gộp vào cấu hình hiện tại
       */
      updateConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config }
        })),

      /**
       * Xử lý sự kiện nhấn phím (keydown) trong editor.
       * Ưu tiên gọi handler onKeyDown của từng extension, sau đó kiểm tra các phím tắt đã cấu hình.
       *
       * Các phím tắt đã cấu hình sẽ được gọi dựa trên piority
       *
       * @param event Sự kiện bàn phím
       * @param editor Đối tượng editor
       * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
       */
      handleKeyDown: (event, editor) => {
        const { extensions: extensions, config, findActionHandlers } = get();

        // Chạy qua từng extension theo priority
        for (const extension of extensions) {
          if (extension.onKeyDown) {
            const handled = extension.onKeyDown(event, editor);
            if (handled) return true;
          }
        }

        // Kiểm tra config shortcuts
        for (const [hotkey, actionName] of Object.entries(config)) {
          if (isHotkey(hotkey, event)) {
            const handlers = findActionHandlers(actionName);
            for (const handler of handlers) {
              const handled = handler(event, editor);
              if (handled) return true;
            }
          }
        }

        return false;
      },

      /**
       * Lấy danh sách tất cả các phím tắt hiện tại cùng action và extension tương ứng.
       * @returns Mảng các đối tượng chứa `{hotkey, action, pluginName}`
       */
      getShortcuts: () => {
        const { config, extensions: extensions } = get();
        return Object.entries(config).map(([hotkey, actionName]) => {
          const extension = extensions.find((p) => p.actions[actionName]);
          return {
            hotkey,
            action: actionName,
            extension: extension?.name || "unknown"
          };
        });
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
            action
          }))
        );
      },

      /**
       * Tìm danh sách action handler kèm theo độ priority của extension chứa nó.
       * @param actionName Tên action cần tìm
       * @returns Mảng các đối tượng chứa `handler` (các action được sắp xếp theo độ piority),
       * hoặc mảng rỗng nếu không tìm thấy
       */
      findActionHandlers: (actionName) => {
        const { extensions: extensions } = get();
        return extensions
          .filter((extension) => !!extension.actions[actionName])
          .sort((a, b) => b.priority - a.priority)
          .map((extension) => extension.actions[actionName]);
      }
    }),
    {
      name: "shortcut-store"
    }
  )
);