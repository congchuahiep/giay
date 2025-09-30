import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useShortcutStore } from "@/core/shortcut";
import { useSlashMenuStore } from "@/features/editor/plugins/slash-menu";
import { useSettingsStore } from "@/features/user-settings/stores/useSettingsStore";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { toast } from "sonner";

const DebugMenu = () => {
	const { getActions, getHotkeys, updateHotkey, getExtensions } =
		useShortcutStore();
	const slashMenuState = useSlashMenuStore.getState();
	const reload = useSettingsStore((state) => state.reload);
	const document = useYjsWorkspace((state) => state.provider.document);

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
				<ContextMenuItem
					onClick={() => {
						toast("Hello!");
					}}
				>
					Toast testing
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						console.log(document);
					}}
				>
					Workspace ydoc
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default DebugMenu;
