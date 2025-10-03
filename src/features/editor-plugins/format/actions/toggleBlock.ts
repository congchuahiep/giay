import { Editor, Element, Transforms } from "slate";
import type { BlockType } from "@/features/editor/types";

export default function toggleBlock(editor: Editor, format: BlockType) {
	const isActive = editor.isBlockType(format);
	Transforms.setNodes(
		editor,
		{ type: isActive ? "paragraph" : format },
		{
			match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
		},
	);
}
