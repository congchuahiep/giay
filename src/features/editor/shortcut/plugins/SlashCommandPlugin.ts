import type { ShortcutPlugin } from "../core/ShortcutManager";

const SlashCommandPlugin: ShortcutPlugin = {
  name: "slash-command",
  priority: 100, // High priority để xử lý trước các plugin khác
  actions: {
    "slash-command": (_, editor) => {
      return editor.handleOpenSlashCommand();
    },
    "close-slash-command": (event, editor) => {
      return editor.handleCloseSlashCommand(event);
    },
  },
};

export default SlashCommandPlugin;
