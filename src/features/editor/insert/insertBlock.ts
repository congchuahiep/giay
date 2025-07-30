import type { BlockType } from "@/features/editor/types";
import { Editor, Path, Transforms, type Element } from "slate";

export default function insertBlock(
  editor: Editor,
  blockType: BlockType
): boolean {
  // Lấy path của block hiện tại
  const currentBlockPath = editor.getCurrentBlockPath();
  if (!currentBlockPath) return false;

  // Xác định vị trí cần đặt block mới
  const nextBlockPath = Path.next(currentBlockPath);

  // Tạo block mới dựa trên type
  const block = buildBlockByType(blockType);

  // Chèn block vào editor
  Transforms.insertNodes(editor, block, { at: nextBlockPath });
  Transforms.select(editor, Editor.start(editor, nextBlockPath));

  return true;
}

/**
 * Tạo block mới dựa trên type
 */
export function buildBlockByType(blockType: BlockType): Element {
  switch (blockType) {
    case "h1":
      return { type: "h1", children: [{ text: "" }] };
    case "h2":
      return { type: "h2", children: [{ text: "" }] };
    case "h3":
      return { type: "h3", children: [{ text: "" }] };
    case "h4":
      return { type: "h4", children: [{ text: "" }] };
    case "paragraph":
      return { type: "paragraph", children: [{ text: "" }] };
    case "bulletList":
      return { type: "bulletList", children: [{ text: "" }] };
    case "checkList":
      return { type: "checkList", checked: false, children: [{ text: "" }] };
    case "code":
      return { type: "code", children: [{ text: "" }] };
    case "quote":
      return { type: "quote", children: [{ text: "" }] };
    case "divider":
      return { type: "divider", children: [{ text: "" }] };
    default:
      return { type: "paragraph", children: [{ text: "" }] };
  }
}
