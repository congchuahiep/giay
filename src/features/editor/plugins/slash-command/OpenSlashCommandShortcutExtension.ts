import type { ShortcutExtension } from "@/core/shortcut/store/shortcutStore";
import type SlashEditor from "@/features/editor/plugins/slash-command/interface";
import type { SafeMenuPlacement } from "@/types";

interface OpenSlashCommandShortcutContext {
  editor: SlashEditor;
  openSlashCommand: (
    position: SafeMenuPlacement | undefined,
    anchorOffset: number
  ) => void;
  slashRef: React.RefObject<HTMLDivElement | null>;
  slashContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Bộ phím tắt cho việc "bật" slash command
 *
 * Chỉ thực thi việc bật slash command, việc lựa chọn item sẽ được xử lý trong
 * `SlashCommandShortcutExtension.ts`
 */
const OpenSlashCommandShortcutExtension: ShortcutExtension<OpenSlashCommandShortcutContext> =
  {
    name: "open-slash-command",
    priority: 50,
    actions: {
      "slash-command": (_, context) => {
        const { editor, slashRef, slashContainerRef, openSlashCommand } = context;
        return editor.handleOpenSlashMenu(openSlashCommand, slashRef, slashContainerRef);
      },
    },

    keySettings: {
      "/": "slash-command",
    },
  };

export default OpenSlashCommandShortcutExtension;
