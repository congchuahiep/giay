import type { ShortcutStore } from "@/core/shortcut";
import getHotkeyFromEvent from "@/core/shortcut/utils/getHotketFromEvent";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

      setActiveShortcutScope: (scope = "global") =>
        set(() => ({ activeScope: scope })),

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
            return action(event as any, extention.context);
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
