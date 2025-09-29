import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useShortcutStore } from "@/core/shortcut";
import { useSlashMenuStore } from "@/features/editor/plugins/slash-menu";
import { useSettingsStore } from "@/features/user-settings/stores/useSettingsStore";

const DebugMenu = () => {
	const { getActions, getHotkeys, updateHotkey, getExtensions } =
		useShortcutStore();
	const slashMenuState = useSlashMenuStore.getState();
	const reload = useSettingsStore((state) => state.reload);

	return (
		<ContextMenu>
			<ContextMenuTrigger>Giấy</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						console.log("extensions:", getExtensions());
						console.log("actions:", getActions());
						console.log("hotkeys:", getHotkeys());
					}}
				>
					Shortcut info
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						console.log(slashMenuState);
					}}
				>
					Slash menu state
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						updateHotkey("mod+g", "mark-bold", "editor");
					}}
				>
					Update hotkey
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						reload();
					}}
				>
					Reload settings
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default DebugMenu;
