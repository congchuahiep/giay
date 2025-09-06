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
 * 
 * @returns Một đối tượng với hai hàm enableShortcuts và disableShortcuts để
 * kích hoạt hoặc vô hiệu hóa các phím tắt trong scope này. Nếu scope là "global"
 * thì sẽ không trả về gì cả.
 * 
 * @example
 * ```tsx
 * const { enableShortcuts, disableShortcuts } = useRegisterShortcuts(
 *   "editor",
 *   { editor: editorContext },
 *   [
 *     {
 *       name: "toggle-bold",
 *       priority: 10,
 *       actions: {
 *         "mod+b": (event, context) => {
 *           // Handle toggle bold action
 *           return true;
 *         },
 *       },
 *     },
 *   ]
 * );
 * 
 * // Kích hoạt phím tắt khi editor được focus
 * <Editable
 *   onFocus={() => enableShortcuts && enableShortcuts()}
 *   onBlur={() => disableShortcuts && disableShortcuts()}
 * />
 * ```
 */
export default function useRegisterShortcuts<T = any>(
  scope: string,
  context: T,
  extensions: ShortcutExtension<T>[],
  keySettings: Record<string, string> = {}
): {
  enableShortcuts: () => void;
  disableShortcuts: () => void;
} | void {
  const { registerExtension, unregisterExtension, setActiveScope } =
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

  if (scope !== "global") {
    const enableShortcuts = () => {
      setActiveScope(scope);
    };
    const disableShortcuts = () => setActiveScope("global");

    return { enableShortcuts, disableShortcuts };
  }
}
