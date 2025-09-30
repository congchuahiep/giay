import handleOpenSlashMenu from "@/features/editor/plugins/slash-menu/handleOpenSlashMenu";
import handleSlashMenuSelection from "@/features/editor/plugins/slash-menu/handleSelectSlashItem";
import type SlashEditor from "@/features/editor/plugins/slash-menu/interface";
import type { SlashMenuState } from "./types/SlashMenuState";
import type { Editor } from "slate";
import OpenSlashMenuShortcutExtension from "@/features/editor/plugins/slash-menu/OpenSlashMenuShortcutExtension";
import SlashMenuShortcutExtension from "@/features/editor/plugins/slash-menu/SlashMenuShortcutExtension";

export * from "./stores/useSlashMenuStore";

export { OpenSlashMenuShortcutExtension as OpenSlashCommandShortcutExtension, SlashMenuShortcutExtension as SlashCommandShortcutExtension };
export type { SlashEditor, SlashMenuState };

export function withSlashEditor(editor: Editor): Editor & SlashEditor {
  editor.handleOpenSlashMenu = (
    openSlashCommand,
    slashRef,
    slashContainerRef,
  ) =>
    handleOpenSlashMenu(editor, openSlashCommand, slashRef, slashContainerRef);

  // editor.handleCloseSlashCommand = (event) => handleCloseSlashCommand(event);

  editor.handleSelectSlashItem = (item, slashMenuState, closeSlashCommand) =>
    handleSlashMenuSelection(editor, item, slashMenuState, closeSlashCommand);

  return editor;
}
