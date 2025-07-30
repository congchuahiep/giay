import { slashMenuManager } from "@/features/editor/slash-command";
import type { ShortcutPlugin } from "../core/ShortcutManager";

const SlashCommandPlugin: ShortcutPlugin = {
  name: "slash-command",
  priority: 200, // Priority cao hơn DefaultBehaviourPlugin (70) để xử lý trước
  actions: {
    "slash-command": (_, editor) => {
      return editor.handleOpenSlashCommand();
    },
    "close-slash-command": (event, editor) => {
      return editor.handleCloseSlashCommand(event);
    },

    "enter-handler": () => {
      // Chỉ xử lý Enter khi slash menu đang mở
      // Logic xử lý Enter sẽ được xử lý trong SlashMenu component
      // Trả về true để ngăn không cho các plugin khác xử lý
      // Nếu menu không mở, để plugin khác xử lý
      return slashMenuManager.isMenuOpen();
    },
  },
};

export default SlashCommandPlugin;
