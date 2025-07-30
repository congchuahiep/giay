import slashMenuManager from "@/features/editor/slash-command/SlashCommandManager";
import type { KeyboardEvent } from "react";

export default function handleCloseSlashCommand(event: KeyboardEvent): boolean {
  if (slashMenuManager.isMenuOpen()) {
    slashMenuManager.close();
    event.preventDefault();
    return true;
  }
  return false;
}
