import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useShortcutStore } from "@/core/shortcut";
import { useSlashCommandStore } from "@/features/editor/plugins/slash-command";

const DebugMenu = () => {
  const { getExtensions } = useShortcutStore();
  const slashMenuState = useSlashCommandStore.getState();

  return (
    <ContextMenu>
      <ContextMenuTrigger>Tauri</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            console.log(getExtensions());
          }}
        >
          Extension list
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            console.log(slashMenuState);
          }}
        >
          Slash menu state
        </ContextMenuItem>

      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DebugMenu;
