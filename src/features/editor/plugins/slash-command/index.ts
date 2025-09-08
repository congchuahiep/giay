import handleOpenSlashMenu from "@/features/editor/plugins/slash-command/handleOpenSlashMenu";
import handleSlashMenuSelection from "@/features/editor/plugins/slash-command/handleSelectSlashItem";
import type SlashEditor from "@/features/editor/plugins/slash-command/interface";
import type {
  SlashCommandListener,
  SlashMenuState,
} from "@/features/editor/plugins/slash-command/SlashCommandManager";
import type { Editor } from "slate";
import OpenSlashCommandShortcutExtension from "@/features/editor/plugins/slash-command/OpenSlashCommandShortcutExtension";
import SlashCommandShortcutExtension from "@/features/editor/plugins/slash-command/SlashCommandShortcutExtension";

export * from "./SlashCommandManager";

export { OpenSlashCommandShortcutExtension, SlashCommandShortcutExtension };
export type { SlashCommandListener, SlashEditor, SlashMenuState };

export function withSlashEditor(editor: Editor): Editor & SlashEditor {
  editor.handleOpenSlashMenu = (
    openSlashCommand,
    slashRef,
    slashContainerRef
  ) =>
    handleOpenSlashMenu(editor, openSlashCommand, slashRef, slashContainerRef);

  // editor.handleCloseSlashCommand = (event) => handleCloseSlashCommand(event);

  editor.handleSelectSlashItem = (item, slashMenuState, closeSlashCommand) =>
    handleSlashMenuSelection(editor, item, slashMenuState, closeSlashCommand);

  return editor;
}
