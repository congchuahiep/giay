import type { Editor } from "slate";

export type Plugin<E extends Editor = Editor> =
  | ((editor: E) => E)
  | [(editor: E, ...args: any[]) => E, ...any[]];

/**
 * Compose nhiều plugin Slate.js thành một hàm khởi tạo editor duy nhất.
 *
 * Thay vì lồng các plugin theo kiểu:
 * ```ts
 * const editor = withA(withB(withC(createEditor())))
 * ```
 * Bạn có thể viết:
 * ```ts
 * const editor = composePlugins(createEditor(), [
 *   withA,
 *   withB,
 *   withC
 * ])
 * ```
 *
 * @template TEditor - Kiểu của editor (thường là sự kết hợp giữa BaseEditor và các plugin Slate).
 * @param editor - editor dùng để khởi tạo, thường khởi tạo bằng `createEditor()`
 * @param {...Array<(...args: any[]) => any>} plugins - Danh sách plugin Slate cần áp dụng.
 * Mỗi plugin là một hàm nhận `editor` (và tùy chọn các tham số khác) rồi trả về `editor` đã được mở rộng.
 *
 * @returns {(editor: TEditor) => TEditor} Hàm nhận vào một editor gốc và trả về editor đã được áp dụng toàn bộ plugin.
 */
export const composePlugins = <E extends Editor>(
  editor: E,
  plugins: Plugin<E>[]
): E => {
  return plugins.reduce((acc, plugin) => {
    if (Array.isArray(plugin)) {
      const [fn, ...args] = plugin;
      return fn(acc, ...args);
    }
    return plugin(acc);
  }, editor);
};
