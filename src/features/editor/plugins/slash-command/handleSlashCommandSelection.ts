import type { SlashMenuItem } from "@/components/Editor/SlashMenu/SlashMenuItems.tsx";
import slashMenuManager from "@/features/editor/plugins/slash-command/SlashCommandManager";
import { Editor, Transforms } from "slate";

/**
 * Xử lý việc chọn một item từ slash command menu
 *
 * Logic:
 * - Nếu block hiện tại rỗng: chuyển đổi block hiện tại thành loại được chọn
 * - Nếu block hiện tại không rỗng: xoá slash command text và chèn block mới
 */
export default function handleSlashCommandSelection(
  editor: Editor,
  item: SlashMenuItem
): boolean {
  const { selection } = editor;
  const state = slashMenuManager.getState();

  if (!selection || !state.isOpen) {
    return false;
  }

  // Tạo range từ anchor position đến selection hiện tại để xoá slash command text
  const anchorPoint = { ...selection.anchor, offset: state.anchorOffset };
  const currentPoint = selection.anchor;

  const slashCommandRange = {
    anchor: anchorPoint,
    focus: currentPoint,
  };

  // Xoá slash command text (bao gồm "/" và search query)
  Transforms.delete(editor, { at: slashCommandRange });

  // Thực thi logic chính
  if (editor.isCurrentBlockEmpty()) {
    editor.setNodes({ type: item.blockType });
  } else {
    editor.insertBlock({ type: item.blockType });
  }

  slashMenuManager.close();
  return true;
}
