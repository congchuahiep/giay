import type { ElementBlock } from "@/features/editor/types/block.ts";
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
  additionalProps: Partial<ElementBlock> = {}
): Element {
  const baseBlock = {
    id: editor.generateId(),
    children: [{ text: "" }],
    ...additionalProps,
  };

  const { type } = additionalProps;

  switch (type) {
    case "h1":
    case "h2":
    case "h3":
    case "paragraph":
    case "h4":
    case "bulletList":
    case "code":
    case "quote":
    case "divider":
      return { ...baseBlock, type: type };
    case "checkList":
      return { ...baseBlock, type: "checkList", checked: false };
    default:
      return { ...baseBlock, type: "paragraph" };
  }
}
