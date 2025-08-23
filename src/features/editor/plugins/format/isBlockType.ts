import type { BlockType } from "@/features/editor/types";
import { Editor, Element } from "slate";

export default function isBlockType(editor: Editor, type: BlockType) {
	const [match] = Editor.nodes(editor, {
		match: (n) => Element.isElement(n) && n.type === type,
	});

	return !!match;
}
