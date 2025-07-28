import type { ShortcutConfig } from "./core/ShortcutManager";

export const defaultShortcutConfig: ShortcutConfig = {
  // Hotkey -> Action name
  "mod+b": "mark-bold",
  "mod+i": "mark-italic",
  "mod+u": "mark-underline",
  "mod+shift+x": "mark-strike-through",
  "mod+e": "mark-code",

  "mod+`": "toggle-code-block",

  // Default behaviour
  "mod+a": "select-all",
  "mod+z": "undo",
  "mod+y": "redo",
  "enter": "enter-handler",
  "shift+enter": "shift-enter-handler",
  "backspace": "backspace-handler",
  "shift+tab": "shift-tab-handler",
};

// Cho phép user override config
export const createShortcutConfig = (
  userConfig: ShortcutConfig = {}
): ShortcutConfig => {
  return { ...defaultShortcutConfig, ...userConfig };
};
