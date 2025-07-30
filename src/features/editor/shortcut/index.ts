import { type KeyboardEvent } from "react";
import { type Editor } from "slate";
import {
  ShortcutManager,
  type ShortcutPlugin,
  type ShortcutConfig,
} from "./core/ShortcutManager";

import { createShortcutConfig } from "./defaultConfig";
import {
  BlockPlugin,
  DefaultBehaviourPlugin,
  MarkdownPlugin,
  MarkPlugin,
  SlashCommandPlugin,
} from "./plugins";

export default function useShortcut(
  editor: Editor,
  config: ShortcutConfig = {}
) {
  const finalConfig = createShortcutConfig(config);
  const manager = new ShortcutManager(finalConfig);

  // Đăng ký plugins
  manager.registerPlugin(MarkPlugin);
  manager.registerPlugin(BlockPlugin);
  manager.registerPlugin(MarkdownPlugin);
  manager.registerPlugin(DefaultBehaviourPlugin);
  manager.registerPlugin(SlashCommandPlugin);

  return (event: KeyboardEvent) => {
    manager.handleKeyDown(event, editor);
  };
}

export { ShortcutManager };
export type { ShortcutPlugin, ShortcutConfig };
