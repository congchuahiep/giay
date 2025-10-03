import { type Editor, Transforms } from "slate";
import type { BlockType, ElementBlock } from "@/features/editor/types/block.ts";

/**
 * Phân giải dữ liệu (plaintext) từ bên ngoài vào có cú pháp markdown, chuyển hoá
 * nội dung đó thành các node/leaf/element/block và chèn chúng vào editor
 *
 * @param editor
 * @param text
 */
export default function deserializerMarkdownAndInsert(
	editor: Editor,
	text: string,
) {
	const blocks = splitIntoBlocks(text);
	const nodes = blocks.map((blockText) =>
		deserializerMarkdown(editor, blockText),
	);

	if (nodes.length > 0) {
		if (
			editor.getCurrentBlockContent() === "" &&
			editor.getCurrentBlockType() === "paragraph"
		)
			editor.removeNodes();
		Transforms.insertNodes(editor, nodes);
	}
}

/**
 * Tách các dòng plaintext một, các tách này tuỳ thuộc vào nhiều điều kiện khác nhau,
 * như paragraph thì cần
 *
 * @param text
 * @returns
 */
function splitIntoBlocks(text: string): string[] {
	const blocks: string[] = [];
	let currentBlock = "";
	let inCodeBlock = false;

	const lines = text.split("\n");

	for (const line of lines) {
		// Kiểm tra bắt đầu/kết thúc code block
		if (line.startsWith("```")) {
			if (!inCodeBlock) {
				// Bắt đầu code block mới
				inCodeBlock = true;
				currentBlock = line;
			} else {
				// Kết thúc code block
				inCodeBlock = false;
				currentBlock += "\n" + line;
				blocks.push(currentBlock.trim());
				currentBlock = "";
			}
			continue;
		}

		if (inCodeBlock) {
			// Đang trong code block, thêm line vào block hiện tại
			currentBlock += "\n" + line;
		} else {
			// Xử lý các block thông thường
			if (line.trim()) {
				blocks.push(line.trim());
			}
		}
	}

	// Xử lý block cuối cùng nếu có
	if (currentBlock.trim()) {
		blocks.push(currentBlock.trim());
	}

	return blocks;
}

/**
 * Phân giải một dòng text markdown thành block data
 */
function deserializerMarkdown(editor: Editor, blockText: string): ElementBlock {
	let type: BlockType = "paragraph";
	let content = blockText;
	const additionalProps: Record<string, any> = {};

	// Parse markdown syntax
	if (blockText.startsWith("# ")) {
		type = "h1";
		content = blockText.replace(/^# +/, "");
	} else if (blockText.startsWith("## ")) {
		type = "h2";
		content = blockText.replace(/^## +/, "");
	} else if (blockText.startsWith("### ")) {
		type = "h3";
		content = blockText.replace(/^### +/, "");
	} else if (blockText.startsWith("#### ")) {
		type = "h4";
		content = blockText.replace(/^#### +/, "");
	} else if (blockText.startsWith("- [ ]") || blockText.startsWith("* [ ]")) {
		type = "checkList";
		content = blockText.replace(/^[-*] \[ \]+/, "");
		additionalProps.checked = false;
	} else if (blockText.startsWith("- [x]") || blockText.startsWith("* [x]")) {
		type = "checkList";
		content = blockText.replace(/^[-*] \[x\]+/, "");
		additionalProps.checked = true;
	} else if (blockText.startsWith("-") || blockText.startsWith("*")) {
		type = "bulletList";
		content = blockText.replace(/^[-*]+/, "");
	} else if (blockText.startsWith(">")) {
		type = "quote";
		content = blockText.replace(/^>+/, "");
	} else if (blockText.startsWith("```")) {
		type = "code";
		content = blockText.replace(/^```.*\n?/, "").replace(/```$/, "");
	} else if (blockText === "---" || blockText === "***") {
		type = "divider";
		content = "";
	}

	// Tạo block với ID tự động
	return editor.buildBlock({
		children: [{ text: content }],
		type: type,
		...additionalProps,
	});
}
