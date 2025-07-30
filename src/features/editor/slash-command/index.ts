import handleCloseSlashCommand from "@/features/editor/slash-command/handleCloseSlashCommand";
import handleOpenSlashCommand from "@/features/editor/slash-command/handleOpenSlashCommand";
import type SlashEditor from "@/features/editor/slash-command/interface";
import type {
  SlashCommandListener,
  SlashMenuState,
} from "@/features/editor/slash-command/SlashCommandManager";
import slashMenuManager from "@/features/editor/slash-command/SlashCommandManager";
import type { Editor } from "slate";

export { slashMenuManager };
export type { SlashCommandListener, SlashEditor, SlashMenuState };

export function withSlashEditor(editor: Editor): Editor & SlashEditor {
  editor.handleOpenSlashCommand = () => handleOpenSlashCommand(editor);
  editor.handleCloseSlashCommand = (event) => handleCloseSlashCommand(event);

  return editor;
}
