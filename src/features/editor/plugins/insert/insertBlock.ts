import { type Editor, type Node, Path, Transforms } from "slate";
import type { NodeInsertNodesOptions } from "slate/dist/interfaces/transforms/node";
import type { ElementBlock } from "@/features/editor/types/block.ts";

export type InsertBlockOptions = NodeInsertNodesOptions<Node> & {
	/**
	 * Chèn block phía bên trên, chỉ áp dụng cho trường hợp không đặt sẵn vị trí
	 */
	reverse?: boolean;
};

/**
 * Chèn một block mới vào editor tại vị trí xác định. Hàm này chỉ thực
 * thi công việc chèn block, chứ không thực hiện việc tách block hay
 * thay đổi vị trí select
 *
 * @param editor - Đối tượng editor hiện tại.
 * @param additionalProps - Các thuộc tính bổ sung cho block mới.
 * @param options - Cấu hình cho việc chèn block
 * @returns Trả về `true` nếu chèn thành công, ngược lại trả về `false`.
 */
export default function insertBlock(
	editor: Editor,
	additionalProps: Partial<ElementBlock> = {},
	options: InsertBlockOptions = { reverse: false },
): boolean {
	// Lấy path của block hiện tại
	const currentBlockPath = editor.getCurrentBlockPath();
	if (!currentBlockPath) return false;

	// Xác định vị trí cần đặt block mới
	const targetBlockPath = options.at
		? options.at
		: options?.reverse
			? currentBlockPath
			: Path.next(currentBlockPath);

	// Tạo block mới dựa trên type
	const block = editor.buildBlock(additionalProps);

	// Chèn block vào editor
	Transforms.insertNodes(editor, block, { at: targetBlockPath });

	return true;
}
