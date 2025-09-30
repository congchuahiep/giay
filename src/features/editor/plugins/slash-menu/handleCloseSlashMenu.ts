import slashMenuManager from "@/features/editor/plugins/slash-menu/stores/useSlashMenuStore";
import type { KeyboardEvent } from "react";

export default function handleCloseSlashCommand(event: KeyboardEvent): boolean {
  if (slashMenuManager.isMenuOpen()) {
    slashMenuManager.close();
    event.preventDefault();
    return true;
  }
  return false;
}
