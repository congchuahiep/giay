import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useShortcutStore } from "@/core/shortcut";
import { useSlashMenuStore } from "@/features/editor/plugins/slash-menu";

const DebugMenu = () => {
  const { getExtensions } = useShortcutStore();
  const slashMenuState = useSlashMenuStore.getState();

  return (
    <ContextMenu>
      <ContextMenuTrigger>Giấy</ContextMenuTrigger>
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
