import type { BlockType } from "@/features/editor/types";
import type { Editor, Element } from "slate";

/**
 * Tạo block mới dựa trên type, lưu ý này chỉ là khởi tạo block
 * chưa có gắn block lên editor
 *
 * Mọi hành vi khi tạo một block mới sẽ luôn phải thông qua phương
 * thức này để tạo block mới! Vì khi sinh block với phương thức
 * này, nó cũng đảm bảo block mới tạo là duy nhất bằng id uuidv4
 */
export default function buildBlock(
  editor: Editor,
  blockType: BlockType = "paragraph",
  additionalProps: Record<string, any> = {}
): Element {
  const baseBlock = {
    id: editor.generateId(),
    children: [{ text: "" }],
    ...additionalProps,
  };

  switch (blockType) {
    case "h1":
    case "h2":
    case "h3":
    case "paragraph":
    case "h4":
    case "bulletList":
    case "code":
    case "quote":
    case "divider":
      return { ...baseBlock, type: blockType };
    case "checkList":
      return { ...baseBlock, type: "checkList", checked: false };
    default:
      return { ...baseBlock, type: "paragraph" };
  }
}
