import handleCloseSlashCommand from "@/features/editor/plugins/slash-command/handleCloseSlashCommand";
import handleOpenSlashCommand from "@/features/editor/plugins/slash-command/handleOpenSlashCommand";
import handleSlashCommandSelection from "@/features/editor/plugins/slash-command/handleSlashCommandSelection";
import type SlashEditor from "@/features/editor/plugins/slash-command/interface";
import type {
  SlashCommandListener,
  SlashMenuState,
} from "@/features/editor/plugins/slash-command/SlashCommandManager";
import slashMenuManager from "@/features/editor/plugins/slash-command/SlashCommandManager";
import type { Editor } from "slate";

import SlashCommandShortcutExtension from "@/features/editor/plugins/slash-command/SlashCommandShortcutExtension";

export { SlashCommandShortcutExtension, slashMenuManager };
export type { SlashCommandListener, SlashEditor, SlashMenuState };

export function withSlashEditor(editor: Editor): Editor & SlashEditor {
  editor.handleOpenSlashCommand = () => handleOpenSlashCommand(editor);
  editor.handleCloseSlashCommand = (event) => handleCloseSlashCommand(event);
  editor.handleSlashCommandSelection = (item) =>
    handleSlashCommandSelection(editor, item);

  return editor;
}
