import { slashMenuManager } from "@/features/editor/plugins/slash-command";
import type { ShortcutExtension } from "@/core/shortcut/store/shortcutStore";

const SlashCommandShortcutExtension: ShortcutExtension = {
  name: "slash-command",
  priority: 50,
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

export default SlashCommandShortcutExtension;
