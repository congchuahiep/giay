import { useEffect, useCallback, type KeyboardEvent } from "react";
import { type Editor } from "slate";
import {
  useShortcutStore,
  type ShortcutConfig,
  type ShortcutExtension,
} from "../store/shortcutStore.ts";
import { createShortcutConfig } from "../defaultConfig.ts";

/**
 * Hook quản lý các phím tắt trong editor
 *
 * @param editor - Instance của Slate editor
 * @param config - Cấu hình phím tắt tùy chỉnh (optional)
 * @param extensions - Mảng các extension để mở rộng chức năng phím tắt (optional)
 *
 * @example
 * ```tsx
 * const editor = useMemo(() => createEditor(), []);
 *
 * // Cấu hình phím tắt cơ bản
 * const shortcuts = useShortcut(editor);
 *
 * // Với cấu hình tùy chỉnh
 * const customConfig = {
 *   'mod+b': 'mark-bold',
 *   'mod+i': 'mark-italic'
 * };
 * const shortcuts = useShortcut(editor, customConfig);
 *
 * // Với extensions tùy chỉnh
 * const customExtensions = [markExtension, blockExtension];
 * const shortcuts = useShortcut(editor, customConfig, customExtensions);
 *
 * // Sử dụng trong Editable
 * <Editable onKeyDown={shortcuts} />
 * ```
 *
 * @returns Hàm xử lý sự kiện keydown để gắn vào Editable component
 */
export default function useShortcut(
  editor: Editor,
  config: ShortcutConfig = {},
  extensions: ShortcutExtension[] = []
) {
  const {
    registerExtension,
    unregisterExtension,
    updateConfig,
    handleKeyDown,
  } = useShortcutStore();

  // Cập nhật config (các phím tắt của người dùng) khi có sự thay đổi
  useEffect(() => {
    const finalConfig = createShortcutConfig(config);
    updateConfig(finalConfig);
  }, [config]);

  // Xử lý đăng ký/hủy đăng ký extensions
  useEffect(() => {
    // Đăng ký các extensions được cung cấp
    extensions.forEach((extension) => registerExtension(extension));

    // Cleanup khi unmount hoặc khi extensions thay đổi
    return () => {
      extensions.forEach((extension) => unregisterExtension(extension.name));
    };
  }, [extensions]);

  return useCallback(
    (event: KeyboardEvent) => {
      handleKeyDown(event, editor);
    },
    [handleKeyDown, editor]
  );
}
