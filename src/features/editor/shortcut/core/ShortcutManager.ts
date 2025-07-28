import { type KeyboardEvent } from "react";
import { type Editor } from "slate";
import isHotkey from "is-hotkey";

export type ShortcutAction = (event: KeyboardEvent, editor: Editor) => boolean | void;

export interface ShortcutPlugin {
  name: string;
  priority: number;
  // Thay đổi: actions thay vì shortcuts
  actions: Record<string, ShortcutAction>;
  onKeyDown?: (event: KeyboardEvent, editor: Editor) => boolean | void;
}

// Sửa lại: hotkey -> action name
export interface ShortcutConfig {
  [hotkey: string]: string; // hotkey -> action name
}

export class ShortcutManager {
  private plugins: ShortcutPlugin[] = [];
  private config: ShortcutConfig = {};

  constructor(config: ShortcutConfig = {}) {
    this.config = config;
  }

  registerPlugin(plugin: ShortcutPlugin) {
    this.plugins.push(plugin);
    this.plugins.sort((a, b) => b.priority - a.priority);
  }

  unregisterPlugin(name: string) {
    this.plugins = this.plugins.filter(p => p.name !== name);
  }

  updateConfig(config: ShortcutConfig) {
    this.config = { ...this.config, ...config };
  }

  private findActionHandler(actionName: string): ShortcutAction | null {
    for (const plugin of this.plugins) {
      if (plugin.actions[actionName]) {
        return plugin.actions[actionName];
      }
    }
    return null;
  }

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

  // Utility để lấy danh sách shortcuts hiện tại
  getShortcuts(): Array<{hotkey: string, action: string, plugin: string}> {
    return Object.entries(this.config).map(([hotkey, actionName]) => {
      const plugin = this.plugins.find(p => p.actions[actionName]);
      return {
        hotkey,
        action: actionName,
        plugin: plugin?.name || 'unknown'
      };
    });
  }

  // Utility để lấy danh sách actions có sẵn
  getAvailableActions(): Array<{plugin: string, action: string}> {
    return this.plugins.flatMap(plugin => 
      Object.keys(plugin.actions).map(action => ({
        plugin: plugin.name,
        action
      }))
    );
  }
}
