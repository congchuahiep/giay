import type { Element } from "slate";
import { v4 as uuidv4 } from "uuid";
import type { ElementBlock } from "@/features/editor/types/block.ts";

/**
 * Tạo block mới dựa trên type, lưu ý này chỉ là khởi tạo block
 * chưa có gắn block lên editor
 *
 * Mọi hành vi khi tạo một block mới sẽ luôn phải thông qua phương
 * thức này để tạo block mới! Vì khi sinh block với phương thức
 * này, nó cũng đảm bảo block mới tạo là duy nhất bằng id uuidv4
 */
export default function buildBlock(
	additionalProps: Partial<ElementBlock> = {},
): Element {
	const baseBlock = {
		id: uuidv4(),
		children: [{ text: "" }],
		...additionalProps,
	};

	const { type } = additionalProps;

	switch (type) {
		case undefined:
			return { ...baseBlock, type: "paragraph" };
		case "checkList":
			return { type: "checkList", checked: false, ...baseBlock };
		case "page":
			return {
				type: "page",
				pageId: undefined,
				icon: "",
				title: "",
				isDeleted: false,
				...baseBlock,
			};
		default:
			return { ...baseBlock, type: type };
	}
}
