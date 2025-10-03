import type { ShortcutExtension } from "@/features/shortcut";
import type { SafeMenuPlacement } from "@/types";
import type { SlashEditor } from "../types";

interface OpenSlashMenuShortcutContext {
	editor: SlashEditor;
	openSlashCommand: (
		position: SafeMenuPlacement | undefined,
		anchorOffset: number,
	) => void;
	slashRef: React.RefObject<HTMLDivElement | null>;
	slashContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Bộ phím tắt cho việc "bật" slash menu
 *
 * Chỉ thực thi việc bật slash menu, việc lựa chọn item sẽ được xử lý trong
 * `SlashMenuShortcutExtension.ts`
 */
const OpenSlashMenuShortcutExtension: ShortcutExtension<OpenSlashMenuShortcutContext> =
	{
		name: "open-slash-menu",
		scope: "editor",
		priority: 50,
		actions: {
			"slash-command": (_, context) => {
				const { editor, slashRef, slashContainerRef, openSlashCommand } =
					context;
				return editor.handleOpenSlashMenu(
					openSlashCommand,
					slashRef,
					slashContainerRef,
				);
			},
		},
	};

export default OpenSlashMenuShortcutExtension;
