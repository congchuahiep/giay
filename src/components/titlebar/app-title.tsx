import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useSlashMenu } from "@/features/editor-plugins/slash-menu";
import { useShortcut } from "@/features/shortcut";
import { useSetting } from "@/features/user-settings";
import { useYjsWorkspace } from "@/features/yjs-workspace";

export default function AppTitle() {
	const { getActions, getHotkeys, updateHotkey, getExtensions } = useShortcut();
	const slashMenuState = useSlashMenu.getState();
	const reload = useSetting((state) => state.reload);
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
}
