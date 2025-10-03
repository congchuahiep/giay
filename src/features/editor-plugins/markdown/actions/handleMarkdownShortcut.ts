import type { KeyboardEvent } from "react";
import { Editor, Element, Range, Transforms } from "slate";
import MARKDOWN_MAP from "../markdown-map";

// const NUMBERED_LIST_REGEX = /^(\d+)\./;

export default function handleMarkdownShortcut(
	editor: Editor,
	event: KeyboardEvent,
): boolean {
	const { selection } = editor;

	if (
		!selection ||
		selection.anchor.offset > 5 ||
		!Range.isCollapsed(selection)
	) {
		return false;
	}

	const [blockEntry, node] = Editor.nodes(editor, {
		match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
	});

	if (!blockEntry) return false;

	const [, path] = blockEntry;
	const start = Editor.start(editor, path);
	const range = { anchor: start, focus: selection.anchor };
	const text = Editor.string(editor, range);

	if (Element.isElement(node) && node.type === "bulletList") return false;

	// TODO: NUMBERLIST Kiểm tra numbered list với custom start
	// const numberedMatch = text.match(NUMBERED_LIST_REGEX);
	// if (numberedMatch) {
	//   const startIndex = parseInt(numberedMatch[1], 10);
	//   event.preventDefault();
	//   Transforms.select(editor, range);
	//   Transforms.delete(editor);
	//   Transforms.setNodes(
	//     editor,
	//     {
	//       type: "numberedList",
	//       startIndex: startIndex,
	//     },
	//     {
	//       match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
	//     }
	//   );
	//   return true;
	// }

	// Kiểm tra các cú pháp markdown khác
	const shortcut = Object.keys(MARKDOWN_MAP).find((key) => text === key);

	if (!shortcut) return false;

	// Thực thi thay đổi type của block
	event.preventDefault();
	Transforms.select(editor, range);
	Transforms.delete(editor);
	Transforms.setNodes(
		editor,
		{ type: MARKDOWN_MAP[shortcut] },
		{
			match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
		},
	);
	return true;
}
