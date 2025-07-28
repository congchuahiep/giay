import { useCallback, useEffect, useState } from "react";
import { Editor, Element, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import isSelectFullBlock from "../../select/isSelectFullblock";

export interface BlockSelectionState {
	isSelectingFullBlock: boolean;
	selectedBlockElements: HTMLElement[];
}

/**
 * Hook này cho phép sử dụng khả năng selection nguyên một block
 * @returns
 */
export default function useBlockSelection(): BlockSelectionState {
	// Sử dụng useSlate() thay vì nhận editor từ props
	const editor = useSlate();

	const [blockSelection, setBlockSelection] = useState<BlockSelectionState>({
		isSelectingFullBlock: false,
		selectedBlockElements: [],
	});

	const updateBlockSelection = useCallback(() => {
		const { selection } = editor;

		if (
			!selection ||
			!isSelectFullBlock(editor) ||
			Range.isCollapsed(selection)
		) {
			setBlockSelection({
				isSelectingFullBlock: false,
				selectedBlockElements: [],
			});
			return;
		}

		// Lấy tất cả DOM elements của blocks được select
		try {
			const blockElements: HTMLElement[] = [];
			const blocks = Array.from(
				Editor.nodes(editor, {
					at: selection,
					match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
				})
			);

			for (const [node] of blocks) {
				try {
					const domElement = ReactEditor.toDOMNode(editor, node);
					if (domElement instanceof HTMLElement) {
						blockElements.push(domElement);
					}
				} catch (err) {
					console.error("❌ Error getting DOM element:", err);
				}
			}

			setBlockSelection({
				isSelectingFullBlock: true,
				selectedBlockElements: blockElements,
			});
		} catch (error) {
			console.error("❌ Error in updateBlockSelection:", error);
			setBlockSelection({
				isSelectingFullBlock: false,
				selectedBlockElements: [],
			});
		}
	}, [editor]);

	// tự động chạy updateBlockSelection nhờ vào editor.selection
	useEffect(() => {
		updateBlockSelection();
	}, [updateBlockSelection, editor.selection]);

	return blockSelection;
}
