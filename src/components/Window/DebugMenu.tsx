import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useShortcutStore } from "@/core/shortcut";

const DebugMenu = () => {
  const { getExtensions } = useShortcutStore();

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

      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DebugMenu;
