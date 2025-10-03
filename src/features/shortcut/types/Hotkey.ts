/**
 * Mapping phím tắt, được định nghĩa trong hệ thống với cú pháp là <phím tắt, action>
 *
 * @example
 * ```ts
 *   "mod+b": "toggle-bold"
 * ```
 */
export type Hotkeys = Record<string, string>;
