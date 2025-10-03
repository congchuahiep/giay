import type { Element } from "slate";
import { create } from "zustand";

interface DragState {
	isDragging: boolean;
	draggedBlockId: string | null;
	draggedBlockData: Element | null;
	overBlockId: string | null;
	dropPosition: "top" | "bottom" | null;

	// Actions
	startDrag: (blockId: string, blockData: Element) => void;
	setDropTarget: (
		overId: string | null,
		position: "top" | "bottom" | null,
	) => void;
	endDrag: () => void;
	resetDrag: () => void;
}

const useDragBlock = create<DragState>((set) => ({
	isDragging: false,
	draggedBlockId: null,
	draggedBlockData: null,
	overBlockId: null,
	dropPosition: null,

	startDrag: (blockId: string, blockData: Element) =>
		set({
			isDragging: true,
			draggedBlockId: blockId,
			draggedBlockData: blockData,
		}),

	endDrag: () =>
		set({
			isDragging: false,
			draggedBlockId: null,
			draggedBlockData: null,
		}),

	setDropTarget: (overId, position) =>
		set({
			overBlockId: overId,
			dropPosition: position,
		}),

	resetDrag: () =>
		set({
			isDragging: false,
			draggedBlockId: null,
			draggedBlockData: null,
		}),
}));

export default useDragBlock;
