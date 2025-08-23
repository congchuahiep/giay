import type { BlockType } from "@/features/editor/types";
import type { ElementBlock } from "@/features/editor/types/block.ts";
import type { Element, NodeEntry, Path } from "slate";

export default interface UtilsEditor {
  /**
   * Tạo block mới dựa trên type, lưu ý này chỉ là khởi tạo block
   * chưa có gắn block lên editor
   *
   * Mọi hành vi khi tạo một block mới sẽ luôn phải thông qua phương
   * thức này để tạo block mới! Vì khi sinh block với phương thức
   * này, nó cũng đảm bảo block mới tạo là duy nhất bằng id uuidv4
   */
  buildBlock: (additionalProps?: Partial<ElementBlock>) => Element;

  /**
   * Tạo `id` theo chuẩn uuidv4
   */
  generateId: () => string;

  /**
   * Đảm bảo block có UUID (thêm nếu chưa có)
   */
  ensureBlockId: (block: any) => Element;

  /**
   * Tìm block dựa trên ID
   *
   * @param id - Id uuidv4 của block
   * @returns {ElementBlock | undefined} Block hiện tại dưới dạng Element, hoặc
   * undefined nếu block không tồn tại
   */
  getBlockById: (id: string) => ElementBlock | undefined;

  /**
   * Tìm block entry dựa trên ID
   *
   * @param id - Id uuidv4 của block
   * @returns {NodeEntry<ElementBlock> | undefined} Là một mảng chứa hai giá trị:
   * - Block hiện tại dưới dạng Element, hoặc undefined nếu block không tồn tại
   * - Vị trí Path hiện tại của Block.
   */
  getBlockEntryById: (id: string) => NodeEntry<ElementBlock> | undefined;

  /**
   * Tìm block path dựa trên ID
   *
   * @param id - Id uuidv4 của block
   * @returns {Path | undefined} Vị trí Path hiện tại của Block.
   */
  getBlockPathById: (id: string) => Path | undefined;

  /**
   * Lấy nội dung của block hiện tại dựa trên id
   * @returns {string | undefined} Nội dung của block hoặc undefined nếu như block
   * không tồn tại
   */
  getBlockContentById: (id: string) => string | undefined;

  /**
   * Lấy block hiện tại ở vị trí con trỏ đang ở trong editor.
   *
   * @returns {ElementBlock | undefined} Block hiện tại dưới dạng Element,
   * hoặc null nếu không xác định được.
   *
   * @example
   * const currentBlock = editor.getCurrentBlock();
   * if (currentBlock) {
   *   // Xử lý với block hiện tại
   * }
   */
  getCurrentBlock: () => ElementBlock | undefined;

  /**
   * Lấy block entry hiện tại ở vị trí con trỏ đang ở trong editor.
   *
   * @returns {NodeEntry<ElementBlock> | undefined} Là một mảng chứa hai giá trị:
   * - Block hiện tại dưới dạng Element, hoặc null nếu không xác định được.
   * - Vị trí Path hiện tại của Block.
   *
   * @example
   * const currentBlockEntry = editor.getCurrentBlockEntry();
   * if (currentBlockEntry) {
   *   // Xử lý với block hiện tại
   * }
   */
  getCurrentBlockEntry: () => NodeEntry<ElementBlock> | undefined;

  /**
   * Lấy vị trí Path tại ví trị con trỏ đang ở trong editor.
   *
   * @returns {Path | undefined} Vị trí Path hoặc null
   */
  getCurrentBlockPath: () => Path | undefined;

  /**
   * Lấy loại block hiện tại mà cursor đang ở
   * @returns {BlockType | undefined} Loại block hiện tại hoặc null nếu không xác định được
   * @example
   * const blockType = editor.getCurrentBlockType();
   * console.log(blockType); // "paragraph", "heading-one", etc.
   */
  getCurrentBlockType: () => BlockType | undefined;

  /**
   * Lấy nội dung của block hiện tại mà con trỏ đang ở
   * @returns {string | undefined} Nội dung của block hiện tại hoặc null nếu như vị trí
   * con trỏ không nằm trong editor
   */
  getCurrentBlockContent: () => string | undefined;

  /**
   * Kiểm tra xem block hiện tại có rỗng (không có text) không
   * @returns {boolean} True nếu block hiện tại rỗng
   * @example
   * if (editor.isCurrentBlockEmpty()) {
   *   // Thực hiện action khi block rỗng
   * }
   */
  isCurrentBlockEmpty: () => boolean;
}
