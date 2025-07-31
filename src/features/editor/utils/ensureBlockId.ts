import type { Element } from "slate";
import { v4 as uuidv4 } from "uuid";

/**
 * Đảm bảo block có UUID (thêm nếu chưa có)
 */
export default function ensureBlockId(block: any): Element {
  if (!block.id) {
    return {
      ...block,
      id: uuidv4(),
    };
  }
  return block;
}
