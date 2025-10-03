import type { Editor } from "slate";
import { handleOpenSlashMenu, handleSelectSlashItem } from "./actions";
import type { SlashEditor } from "./types";

export default function withSlashEditor(editor: Editor): Editor & SlashEditor {
	editor.handleOpenSlashMenu = (
		openSlashCommand,
		slashRef,
		slashContainerRef,
	) =>
		handleOpenSlashMenu(editor, openSlashCommand, slashRef, slashContainerRef);

	// editor.handleCloseSlashCommand = (event) => handleCloseSlashCommand(event);

	editor.handleSelectSlashItem = (item, slashMenuState, closeSlashCommand) =>
		handleSelectSlashItem(editor, item, slashMenuState, closeSlashCommand);

	return editor;
}
