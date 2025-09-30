import type { Editor } from "slate";
import type { SlashMenuItem } from "@/components/Editor/SlashMenu/SlashMenuItems";
import type { ShortcutExtension } from "@/core/shortcut";
import { defaultShortcutSettings } from "@/features/user-settings/default-settings/defaultShortcutSettings";
import type { SlashMenuState } from "./types/SlashMenuState";

interface SlashMenuShortcutContext {
  editor: Editor;
  slashMenuState: SlashMenuState;
  filteredItems: SlashMenuItem[];
  closeSlashCommand: () => void;
  setSelectedIndex: (index: number) => void;
  scrollToIndex: (index: number) => void;
}

const SlashMenuShortcutExtension: ShortcutExtension<SlashMenuShortcutContext> =
  {
    name: "slash-menu",
    priority: 100,
    actions: {
      "close-slash-command": (_, context) => {
        return context.closeSlashCommand();
      },

      "select-previous-item": (event, context) => {
        event.preventDefault();

        const { filteredItems, scrollToIndex } = context;
        const menuState = context.slashMenuState;

        const prevIndex =
          menuState.selectedIndex > 0
            ? menuState.selectedIndex - 1
            : filteredItems.length - 1;
        context.setSelectedIndex(prevIndex);

        scrollToIndex(prevIndex);

        return true;
      },

      "select-next-item": (event, context) => {
        event.preventDefault();

        const { filteredItems, scrollToIndex } = context;
        const menuState = context.slashMenuState;

        const nextIndex =
          menuState.selectedIndex < filteredItems.length - 1
            ? menuState.selectedIndex + 1
            : 0;

        context.setSelectedIndex(nextIndex);
        scrollToIndex(nextIndex);

        return true;
      },

      "select-slash-command": (event, context) => {
        event.preventDefault();

        console.log("select-slash-command");
        const { filteredItems, editor, slashMenuState } = context;
        if (filteredItems[slashMenuState.selectedIndex]) {
          editor.handleSelectSlashItem(
            filteredItems[slashMenuState.selectedIndex],
            slashMenuState,
            context.closeSlashCommand,
          );
        }
        return true;
      },
    },
  };

export default SlashMenuShortcutExtension;
