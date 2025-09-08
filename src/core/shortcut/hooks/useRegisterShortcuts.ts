import { useEffect } from "react";
import {
  useShortcutStore,
  type ShortcutExtension,
} from "../store/shortcutStore";

/**
 * Hook này được sử dụng để đăng ký các phím tắt với một scope cụ thể.
 *
 * @param scope - Tên scope để đăng ký (ví dụ: "editor", "sidebar", "global"), nếu 
 * không để, hoặc để là "global" thì tức bộ phím tắt này hoạt động toàn cục
 * @param context - Ngữ cảnh để truyền vào các action của extension
 * @param extensions - Mảng các extension để đăng ký
 */
export default function useRegisterShortcuts<T = any>(
  scope: string,
  context: T,
  extensions: ShortcutExtension<T>[],
  keySettings: Record<string, string> = {}
): void {
  const { registerExtension, unregisterExtension } =
    useShortcutStore();

  // Đăng ký bộ shortcut khi component mount
  useEffect(() => {
    const scopedExtensions = extensions.map((ext) => ({
      ...ext,
      scope,
    }));

    scopedExtensions.forEach((extension) =>
      registerExtension({
        ...extension,
        scope,
        context,
        keySettings: { ...keySettings, ...extension.keySettings },
      })
    );

    return () => {
      scopedExtensions.forEach((extension) =>
        unregisterExtension(extension.name)
      );
    };
  }, [scope, context]);
}
