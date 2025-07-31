import type { BlockType } from "@/features/editor/types";
import type { Element } from "slate";

/**
 * Tạo block mới dựa trên type, lưu ý này chỉ là khởi tạo block
 * chưa có gắn block lên editor
 */
export default function buildBlock(
  blockType: BlockType = "paragraph",
  additionalProps: Record<string, any> = {}
): Element {
  const baseBlock = {
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
