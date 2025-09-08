import type { SlashMenuItem } from "@/components/Editor/SlashMenu/SlashMenuItems";
import type { Editor } from "slate";
import type { SlashMenuState } from "./types/SlashMenuState";
import type { ShortcutExtension } from "@/core/shortcut";

interface SlashCommandShortcutContext {
  editor: Editor;
  slashMenuState: SlashMenuState;
  filteredItems: SlashMenuItem[];
  closeSlashCommand: () => void;
  setSelectedIndex: (index: number) => void;
  scrollToIndex: (index: number) => void;
}

const SlashCommandShortcutExtension: ShortcutExtension<SlashCommandShortcutContext> =
  {
    name: "slash-command",
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
            context.closeSlashCommand
          );
        }
        return true;
      },
    },

    keySettings: {
      up: "select-previous-item", // UNMODIFIED
      down: "select-next-item", // UNMODIFIED
      escape: "close-slash-command", // UNMODIFIED
      enter: "select-slash-command", // UNMODIFIED
    },
  };

export default SlashCommandShortcutExtension;
