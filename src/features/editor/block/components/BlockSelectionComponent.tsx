import { useEffect } from "react";
import { BlockSelectionOverlay } from "@/features/editor/block/components";
import { useBlockSelection } from "@/features/editor/block/hooks";

/**
 * Component dùng để hiển thị selection block, và cũng như là ẩn phẩn selection
 * mặc định của người dùng
 */
export default function BlockSelectionComponent() {
	const blockSelection = useBlockSelection();

	useEffect(() => {
		const editorElement = document.querySelector('[data-slate-editor="true"]');
		if (!editorElement) return;

		if (blockSelection.isSelectingFullBlock) {
			// Sử dụng Tailwind classes
			editorElement.classList.add("selection:bg-transparent");
		} else {
			editorElement.classList.remove("selection:bg-transparent");
		}

		return () => {
			editorElement.classList.remove("selection:bg-transparent");
		};
	}, [blockSelection.isSelectingFullBlock]);

	if (!blockSelection.isSelectingFullBlock) {
		return null;
	}

	return (
		<BlockSelectionOverlay
			blockElements={blockSelection.selectedBlockElements}
		/>
	);
}
