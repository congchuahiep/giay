import { type KeyboardEvent } from "react";
import { type Editor } from "slate";
import isHotkey from "is-hotkey";

export type ShortcutAction = (
  event: KeyboardEvent,
  editor: Editor
) => boolean | void;

export interface ShortcutPlugin {
  name: string;
  priority: number;
  actions: Record<string, ShortcutAction>;
  onKeyDown?: (event: KeyboardEvent, editor: Editor) => boolean | void;
}

// Sửa lại: hotkey -> action name
export interface ShortcutConfig {
  [hotkey: string]: string; // hotkey -> action name
}

/**
 * Quản lý các plugin phím tắt (shortcut) cho editor.
 *
 * ShortcutManager cho phép đăng ký, hủy đăng ký plugin, cấu hình các phím tắt,
 * xử lý sự kiện phím, và cung cấp các tiện ích để lấy danh sách phím tắt và actions hiện có.
 */
export class ShortcutManager {
  private plugins: ShortcutPlugin[] = [];
  private config: ShortcutConfig = {};

  constructor(config: ShortcutConfig = {}) {
    this.config = config;
  }

  /**
   * Đăng ký một plugin phím tắt mới vào hệ thống.
   * Các plugin sẽ được sắp xếp lại theo thứ tự ưu tiên (priority).
   * @param plugin Plugin phím tắt cần đăng ký
   */
  registerPlugin(plugin: ShortcutPlugin) {
    this.plugins.push(plugin);
    this.plugins.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Hủy đăng ký một plugin phím tắt theo tên.
   * @param name Tên plugin cần hủy đăng ký
   */
  unregisterPlugin(name: string) {
    this.plugins = this.plugins.filter((p) => p.name !== name);
  }

  /**
   * Cập nhật cấu hình các phím tắt.
   * @param config Đối tượng cấu hình mới sẽ được gộp vào cấu hình hiện tại
   */
  updateConfig(config: ShortcutConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Tìm action đã đăng ký
   * @param actionName 
   * @returns 
   */
  private findActionHandler(actionName: string): ShortcutAction | null {
    for (const plugin of this.plugins) {
      if (plugin.actions[actionName]) {
        return plugin.actions[actionName];
      }
    }
    return null;
  }

  /**
   * Xử lý sự kiện nhấn phím (keydown) trong editor.
   * Ưu tiên gọi handler onKeyDown của từng plugin, sau đó kiểm tra các phím tắt đã cấu hình.
   * @param event Sự kiện bàn phím
   * @param editor Đối tượng editor
   * @returns true nếu sự kiện đã được xử lý, ngược lại trả về false
   */
  handleKeyDown = (event: KeyboardEvent, editor: Editor): boolean => {
    // Chạy qua từng plugin theo priority
    for (const plugin of this.plugins) {
      // Kiểm tra custom onKeyDown handler trước
      if (plugin.onKeyDown) {
        const handled = plugin.onKeyDown(event, editor);
        if (handled) return true;
      }
    }

    // Kiểm tra config shortcuts
    for (const [hotkey, actionName] of Object.entries(this.config)) {
      if (isHotkey(hotkey, event)) {
        const handler = this.findActionHandler(actionName);
        if (handler) {
          const handled = handler(event, editor);
          if (handled !== false) {
            return true;
          }
        }
      }
    }

    return false;
  };

  /**
   * Lấy danh sách các phím tắt hiện tại cùng action và plugin tương ứng.
   * @returns Mảng các đối tượng chứa hotkey, action và plugin
   */
  getShortcuts(): Array<{ hotkey: string; action: string; plugin: string }> {
    return Object.entries(this.config).map(([hotkey, actionName]) => {
      const plugin = this.plugins.find((p) => p.actions[actionName]);
      return {
        hotkey,
        action: actionName,
        plugin: plugin?.name || "unknown",
      };
    });
  }

  /**
   * Lấy danh sách tất cả các action có sẵn từ các plugin đã đăng ký.
   * @returns Mảng các đối tượng chứa plugin và action
   */
  getAvailableActions(): Array<{ plugin: string; action: string }> {
    return this.plugins.flatMap((plugin) =>
      Object.keys(plugin.actions).map((action) => ({
        plugin: plugin.name,
        action,
      }))
    );
  }
}
